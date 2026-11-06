import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Subject,
  Unit,
  Topic,
  Task,
  DailyRhythmItem,
  StudySession,
  ActiveTimerState,
  UserProfile,
  TopicStatus
} from '../types';
import {
  defaultProfile,
  defaultSubjects,
  defaultTasks,
  defaultDailyRhythm,
  defaultPastSessions
} from '../data/defaultData';
import { ambientAudio } from '../utils/audio';

const STORAGE_KEY = 'exambrief_app_state_v2';

interface AppContextType {
  // Navigation
  activeTab: 'home' | 'subject' | 'analytics';
  setActiveTab: (tab: 'home' | 'subject' | 'analytics') => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  selectedTopicDetails: { subjectId: string; unitId: string; topicId: string } | null;
  openTopicDetails: (subjectId: string, unitId: string, topicId: string) => void;
  closeTopicDetails: () => void;
  isPomoModalOpen: boolean;
  setIsPomoModalOpen: (open: boolean) => void;
  isAuditLogModalOpen: boolean;
  setIsAuditLogModalOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Profile & Data
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  subjects: Subject[];
  tasks: Task[];
  dailyRhythm: DailyRhythmItem[];
  sessions: StudySession[];

  // Subject / Unit / Topic Operations
  addSubject: (subject: Omit<Subject, 'id' | 'units'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addUnit: (subjectId: string, title: string) => void;
  updateUnit: (subjectId: string, unitId: string, title: string) => void;
  deleteUnit: (subjectId: string, unitId: string) => void;
  addTopic: (subjectId: string, unitId: string, topic: Partial<Topic>) => void;
  updateTopic: (subjectId: string, unitId: string, topicId: string, updates: Partial<Topic>) => void;
  deleteTopic: (subjectId: string, unitId: string, topicId: string) => void;
  setTopicStatus: (subjectId: string, unitId: string, topicId: string, status: TopicStatus) => void;

  // Active Timer
  activeTimer: ActiveTimerState;
  timerElapsedDisplay: { focusSeconds: number; breakSeconds: number };
  startStudyTimer: (
    subjectId: string,
    unitId: string,
    topicId: string,
    sessionType?: 'topic_study' | 'pomodoro' | 'revision' | 'problem_solving'
  ) => void;
  pauseStudyTimer: () => void;
  resumeStudyTimer: () => void;
  startStudyBreak: () => void;
  endStudyTimer: (notes?: string) => void;
  resetStudyTimer: () => void;

  // Pomodoro
  pomoMode: 'focus' | 'short_break' | 'long_break' | 'custom';
  setPomoMode: (mode: 'focus' | 'short_break' | 'long_break' | 'custom') => void;
  pomoRemainingSeconds: number;
  pomoIsRunning: boolean;
  pomoCycle: number;
  pomoSelectedSubjectId: string;
  setPomoSelectedSubjectId: (id: string) => void;
  pomoSelectedTopicId: string;
  setPomoSelectedTopicId: (id: string) => void;
  pomoAmbientSound: 'rain' | 'whitenoise' | 'library' | 'none';
  setPomoAmbientSound: (sound: 'rain' | 'whitenoise' | 'library' | 'none') => void;
  pomoAutoSync: boolean;
  setPomoAutoSync: (sync: boolean) => void;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  extendPomodoro5Mins: () => void;
  skipPomoPhase: () => void;
  endPomodoroSession: () => void;

  // Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Daily Rhythm
  updateRhythmItem: (id: string, updates: Partial<DailyRhythmItem>) => void;

  // Calculations & Helpers
  getUnitProgress: (unit: Unit) => { completed: number; total: number; percentage: number };
  getSubjectProgress: (subject: Subject) => { completed: number; total: number; percentage: number };
  getOverallProgress: () => { completed: number; total: number; percentage: number };
  getNextExamination: () => { subject: Subject; daysLeft: number; formattedDate: string } | null;
  getTopicStudyStats: (topicId: string) => { todaySeconds: number; totalSeconds: number };

  // Backup & Restore
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_ACTIVE_TIMER: ActiveTimerState = {
  isActive: false,
  isPaused: false,
  isOnBreak: false,
  subjectId: '',
  unitId: '',
  topicId: '',
  subjectName: '',
  subjectCode: '',
  unitTitle: '',
  topicTitle: '',
  sessionType: 'topic_study',
  startTimestamp: 0,
  lastFocusStartTimestamp: null,
  lastBreakStartTimestamp: null,
  accumulatedFocusSeconds: 0,
  accumulatedBreakSeconds: 0,
  targetSeconds: 3000 // 50m default
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'subject' | 'analytics'>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicDetails, setSelectedTopicDetails] = useState<{
    subjectId: string;
    unitId: string;
    topicId: string;
  } | null>(null);
  const [isPomoModalOpen, setIsPomoModalOpen] = useState(false);
  const [isAuditLogModalOpen, setIsAuditLogModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // App Core State
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [dailyRhythm, setDailyRhythm] = useState<DailyRhythmItem[]>(defaultDailyRhythm);
  const [sessions, setSessions] = useState<StudySession[]>(defaultPastSessions);

  // Active Focus Timer State
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>(DEFAULT_ACTIVE_TIMER);
  const [timerElapsedDisplay, setTimerElapsedDisplay] = useState({ focusSeconds: 0, breakSeconds: 0 });

  // Dedicated Pomodoro State
  const [pomoMode, setPomoMode] = useState<'focus' | 'short_break' | 'long_break' | 'custom'>('focus');
  const [pomoRemainingSeconds, setPomoRemainingSeconds] = useState(25 * 60);
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [pomoCycle, setPomoCycle] = useState(1);
  const [pomoSelectedSubjectId, setPomoSelectedSubjectId] = useState<string>('subj-1');
  const [pomoSelectedTopicId, setPomoSelectedTopicId] = useState<string>('top-1-1-3');
  const [pomoAmbientSound, setPomoAmbientSound] = useState<'rain' | 'whitenoise' | 'library' | 'none'>('rain');
  const [pomoAutoSync, setPomoAutoSync] = useState(true);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.subjects && Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
          setSubjects(parsed.subjects);
        }
        if (parsed.tasks && Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        if (parsed.dailyRhythm && Array.isArray(parsed.dailyRhythm)) setDailyRhythm(parsed.dailyRhythm);
        if (parsed.sessions && Array.isArray(parsed.sessions)) setSessions(parsed.sessions);
        if (parsed.activeTimer) {
          setActiveTimer(parsed.activeTimer);
        }
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // Save on changes
  useEffect(() => {
    try {
      const toSave = {
        profile,
        subjects,
        tasks,
        dailyRhythm,
        sessions,
        activeTimer
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [profile, subjects, tasks, dailyRhythm, sessions, activeTimer]);

  // Live Timer Ticking Calculation (Timestamp-based to prevent drifts)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      if (activeTimer.isActive) {
        let currentFocus = activeTimer.accumulatedFocusSeconds;
        let currentBreak = activeTimer.accumulatedBreakSeconds;

        if (!activeTimer.isPaused) {
          if (activeTimer.isOnBreak && activeTimer.lastBreakStartTimestamp) {
            currentBreak += Math.floor((now - activeTimer.lastBreakStartTimestamp) / 1000);
          } else if (!activeTimer.isOnBreak && activeTimer.lastFocusStartTimestamp) {
            currentFocus += Math.floor((now - activeTimer.lastFocusStartTimestamp) / 1000);
          }
        }

        setTimerElapsedDisplay({
          focusSeconds: currentFocus,
          breakSeconds: currentBreak
        });
      } else {
        setTimerElapsedDisplay({ focusSeconds: 0, breakSeconds: 0 });
      }

      // Dedicated Pomodoro countdown tick
      if (pomoIsRunning) {
        setPomoRemainingSeconds(prev => {
          if (prev <= 1) {
            // Cycle ended
            setPomoIsRunning(false);
            ambientAudio.stop();
            // Automatically log session if focus mode finished
            if (pomoMode === 'focus') {
              const subj = subjects.find(s => s.id === pomoSelectedSubjectId);
              let unitTitle = 'Unit Study';
              let topicTitle = 'Focus Sprint';
              if (subj) {
                for (const u of subj.units) {
                  const t = u.topics.find(top => top.id === pomoSelectedTopicId);
                  if (t) {
                    unitTitle = u.title;
                    topicTitle = t.title;
                    break;
                  }
                }
              }

              const newSession: StudySession = {
                id: 'pomo-' + Date.now(),
                subjectId: pomoSelectedSubjectId || (subjects[0]?.id || ''),
                unitId: '',
                topicId: pomoSelectedTopicId || '',
                subjectName: subj ? subj.name : 'Semester Preparation',
                subjectCode: subj ? subj.code : 'SEM',
                unitTitle,
                topicTitle,
                startTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
                endTime: new Date().toISOString(),
                focusDurationSeconds: 25 * 60,
                breakDurationSeconds: 0,
                sessionType: 'pomodoro',
                status: 'completed',
                pomoCycles: 1,
                notes: 'Completed 25m Focus Sprint'
              };

              setSessions(s => [newSession, ...s]);

              // Update topic total study time if auto-sync is on
              if (pomoAutoSync && pomoSelectedTopicId) {
                setSubjects(prevSubjs =>
                  prevSubjs.map(sub => ({
                    ...sub,
                    units: sub.units.map(unit => ({
                      ...unit,
                      topics: unit.topics.map(top =>
                        top.id === pomoSelectedTopicId
                          ? {
                              ...top,
                              totalStudySeconds: top.totalStudySeconds + 25 * 60,
                              lastStudiedAt: new Date().toISOString()
                            }
                          : top
                      )
                    }))
                  }))
                );
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, pomoIsRunning, pomoMode, pomoSelectedSubjectId, pomoSelectedTopicId, pomoAutoSync, subjects]);

  // Ambient sound handler when Pomodoro runs/pauses
  useEffect(() => {
    if (pomoIsRunning && pomoMode === 'focus') {
      ambientAudio.play(pomoAmbientSound);
    } else {
      ambientAudio.stop();
    }
    return () => {
      ambientAudio.stop();
    };
  }, [pomoIsRunning, pomoMode, pomoAmbientSound]);

  // Profile update
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(p => ({ ...p, ...updates }));
  };

  // Subjects CRUD
  const addSubject = (newSubj: Omit<Subject, 'id' | 'units'>) => {
    const id = 'subj-' + Date.now();
    const created: Subject = {
      ...newSubj,
      id,
      units: []
    };
    setSubjects(s => [...s, created]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(sub => sub.id !== id));
    if (selectedSubjectId === id) setSelectedSubjectId(null);
    if (selectedTopicDetails?.subjectId === id) setSelectedTopicDetails(null);
  };

  // Units CRUD
  const addUnit = (subjectId: string, title: string) => {
    const unitId = 'u-' + Date.now();
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== subjectId) return sub;
        const newUnit: Unit = {
          id: unitId,
          subjectId,
          number: sub.units.length + 1,
          title,
          topics: []
        };
        return { ...sub, units: [...sub.units, newUnit] };
      })
    );
  };

  const updateUnit = (subjectId: string, unitId: string, title: string) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          units: sub.units.map(u => (u.id === unitId ? { ...u, title } : u))
        };
      })
    );
  };

  const deleteUnit = (subjectId: string, unitId: string) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== subjectId) return sub;
        const filtered = sub.units.filter(u => u.id !== unitId);
        // renumber units
        return {
          ...sub,
          units: filtered.map((u, idx) => ({ ...u, number: idx + 1 }))
        };
      })
    );
    if (selectedTopicDetails?.unitId === unitId) setSelectedTopicDetails(null);
  };

  // Topics CRUD
  const addTopic = (subjectId: string, unitId: string, topicData: Partial<Topic>) => {
    const topicId = 'top-' + Date.now();
    const defaultTopic: Topic = {
      id: topicId,
      unitId,
      subjectId,
      topicNumber: topicData.topicNumber || '1.1',
      title: topicData.title || 'Untitled Topic',
      status: topicData.status || 'not-started',
      estimatedWeight: topicData.estimatedWeight || '8 Marks',
      overview: topicData.overview || '',
      definitions: topicData.definitions || [],
      formulas: topicData.formulas || [],
      keywords: topicData.keywords || [],
      questions: topicData.questions || [],
      attachments: topicData.attachments || [],
      totalStudySeconds: 0,
      createdAt: new Date().toISOString()
    };

    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          units: sub.units.map(u => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: [...u.topics, defaultTopic]
            };
          })
        };
      })
    );
  };

  const updateTopic = (
    subjectId: string,
    unitId: string,
    topicId: string,
    updates: Partial<Topic>
  ) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          units: sub.units.map(u => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: u.topics.map(t => (t.id === topicId ? { ...t, ...updates } : t))
            };
          })
        };
      })
    );
  };

  const deleteTopic = (subjectId: string, unitId: string, topicId: string) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          units: sub.units.map(u => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: u.topics.filter(t => t.id !== topicId)
            };
          })
        };
      })
    );
    if (selectedTopicDetails?.topicId === topicId) setSelectedTopicDetails(null);
  };

  const setTopicStatus = (
    subjectId: string,
    unitId: string,
    topicId: string,
    status: TopicStatus
  ) => {
    updateTopic(subjectId, unitId, topicId, { status });
  };

  // Open / Close topic detail screen
  const openTopicDetails = (subjectId: string, unitId: string, topicId: string) => {
    setSelectedTopicDetails({ subjectId, unitId, topicId });
  };

  const closeTopicDetails = () => {
    setSelectedTopicDetails(null);
  };

  // Study Timer Controls
  const startStudyTimer = (
    subjectId: string,
    unitId: string,
    topicId: string,
    sessionType: 'topic_study' | 'pomodoro' | 'revision' | 'problem_solving' = 'topic_study'
  ) => {
    const now = Date.now();
    let subName = '';
    let subCode = '';
    let uTitle = '';
    let tTitle = '';

    const sub = subjects.find(s => s.id === subjectId);
    if (sub) {
      subName = sub.name;
      subCode = sub.code;
      const u = sub.units.find(unit => unit.id === unitId);
      if (u) {
        uTitle = u.title;
        const t = u.topics.find(top => top.id === topicId);
        if (t) tTitle = t.title;
      }
    }

    setActiveTimer({
      isActive: true,
      isPaused: false,
      isOnBreak: false,
      subjectId,
      unitId,
      topicId,
      subjectName: subName || 'Selected Subject',
      subjectCode: subCode || 'SEM',
      unitTitle: uTitle || 'Current Unit',
      topicTitle: tTitle || 'Current Topic',
      sessionType,
      startTimestamp: now,
      lastFocusStartTimestamp: now,
      lastBreakStartTimestamp: null,
      accumulatedFocusSeconds: 0,
      accumulatedBreakSeconds: 0,
      targetSeconds: 3000 // 50 mins deep focus target
    });
  };

  const pauseStudyTimer = () => {
    if (!activeTimer.isActive || activeTimer.isPaused) return;
    const now = Date.now();
    let addFocus = 0;
    let addBreak = 0;

    if (activeTimer.isOnBreak && activeTimer.lastBreakStartTimestamp) {
      addBreak = Math.floor((now - activeTimer.lastBreakStartTimestamp) / 1000);
    } else if (!activeTimer.isOnBreak && activeTimer.lastFocusStartTimestamp) {
      addFocus = Math.floor((now - activeTimer.lastFocusStartTimestamp) / 1000);
    }

    setActiveTimer(prev => ({
      ...prev,
      isPaused: true,
      accumulatedFocusSeconds: prev.accumulatedFocusSeconds + addFocus,
      accumulatedBreakSeconds: prev.accumulatedBreakSeconds + addBreak,
      lastFocusStartTimestamp: null,
      lastBreakStartTimestamp: null
    }));
  };

  const resumeStudyTimer = () => {
    if (!activeTimer.isActive || !activeTimer.isPaused) return;
    const now = Date.now();
    setActiveTimer(prev => ({
      ...prev,
      isPaused: false,
      isOnBreak: false,
      lastFocusStartTimestamp: now,
      lastBreakStartTimestamp: null
    }));
  };

  const startStudyBreak = () => {
    if (!activeTimer.isActive) return;
    const now = Date.now();
    let addFocus = 0;
    if (!activeTimer.isPaused && !activeTimer.isOnBreak && activeTimer.lastFocusStartTimestamp) {
      addFocus = Math.floor((now - activeTimer.lastFocusStartTimestamp) / 1000);
    }

    setActiveTimer(prev => ({
      ...prev,
      isOnBreak: true,
      isPaused: false,
      accumulatedFocusSeconds: prev.accumulatedFocusSeconds + addFocus,
      lastFocusStartTimestamp: null,
      lastBreakStartTimestamp: now
    }));
  };

  const endStudyTimer = (notes?: string) => {
    if (!activeTimer.isActive) return;
    const now = Date.now();
    let totalFocus = activeTimer.accumulatedFocusSeconds;
    let totalBreak = activeTimer.accumulatedBreakSeconds;

    if (!activeTimer.isPaused) {
      if (activeTimer.isOnBreak && activeTimer.lastBreakStartTimestamp) {
        totalBreak += Math.floor((now - activeTimer.lastBreakStartTimestamp) / 1000);
      } else if (!activeTimer.isOnBreak && activeTimer.lastFocusStartTimestamp) {
        totalFocus += Math.floor((now - activeTimer.lastFocusStartTimestamp) / 1000);
      }
    }

    // Save session record if focus >= 15 seconds
    if (totalFocus >= 15) {
      const newSession: StudySession = {
        id: 'ses-' + Date.now(),
        subjectId: activeTimer.subjectId,
        unitId: activeTimer.unitId,
        topicId: activeTimer.topicId,
        subjectName: activeTimer.subjectName,
        subjectCode: activeTimer.subjectCode,
        unitTitle: activeTimer.unitTitle,
        topicTitle: activeTimer.topicTitle,
        startTime: new Date(activeTimer.startTimestamp).toISOString(),
        endTime: new Date(now).toISOString(),
        focusDurationSeconds: totalFocus,
        breakDurationSeconds: totalBreak,
        sessionType: activeTimer.sessionType,
        status: 'completed',
        notes: notes || `Focused topic block: ${Math.round(totalFocus / 60)}m`
      };

      setSessions(prev => [newSession, ...prev]);

      // Credit topic total study seconds
      if (activeTimer.subjectId && activeTimer.unitId && activeTimer.topicId) {
        setSubjects(prev =>
          prev.map(sub => {
            if (sub.id !== activeTimer.subjectId) return sub;
            return {
              ...sub,
              units: sub.units.map(u => {
                if (u.id !== activeTimer.unitId) return u;
                return {
                  ...u,
                  topics: u.topics.map(t =>
                    t.id === activeTimer.topicId
                      ? {
                          ...t,
                          totalStudySeconds: t.totalStudySeconds + totalFocus,
                          lastStudiedAt: new Date().toISOString()
                        }
                      : t
                  )
                };
              })
            };
          })
        );
      }
    }

    setActiveTimer(DEFAULT_ACTIVE_TIMER);
    setTimerElapsedDisplay({ focusSeconds: 0, breakSeconds: 0 });
  };

  const resetStudyTimer = () => {
    setActiveTimer(DEFAULT_ACTIVE_TIMER);
    setTimerElapsedDisplay({ focusSeconds: 0, breakSeconds: 0 });
  };

  // Dedicated Pomodoro methods
  const startPomodoro = () => {
    setPomoIsRunning(true);
  };

  const pausePomodoro = () => {
    setPomoIsRunning(false);
  };

  const resetPomodoro = () => {
    setPomoIsRunning(false);
    ambientAudio.stop();
    if (pomoMode === 'focus') setPomoRemainingSeconds(25 * 60);
    else if (pomoMode === 'short_break') setPomoRemainingSeconds(5 * 60);
    else if (pomoMode === 'long_break') setPomoRemainingSeconds(15 * 60);
    else setPomoRemainingSeconds(30 * 60);
  };

  const extendPomodoro5Mins = () => {
    setPomoRemainingSeconds(prev => prev + 5 * 60);
  };

  const skipPomoPhase = () => {
    resetPomodoro();
    if (pomoMode === 'focus') {
      setPomoMode('short_break');
      setPomoRemainingSeconds(5 * 60);
      setPomoCycle(c => c + 1);
    } else {
      setPomoMode('focus');
      setPomoRemainingSeconds(25 * 60);
    }
  };

  const endPomodoroSession = () => {
    const elapsedSeconds = (pomoMode === 'focus' ? 25 * 60 : 5 * 60) - pomoRemainingSeconds;
    if (elapsedSeconds >= 30 && pomoMode === 'focus') {
      const subj = subjects.find(s => s.id === pomoSelectedSubjectId);
      const newSession: StudySession = {
        id: 'pomo-' + Date.now(),
        subjectId: pomoSelectedSubjectId,
        unitId: '',
        topicId: pomoSelectedTopicId,
        subjectName: subj ? subj.name : 'Semester Preparation',
        subjectCode: subj ? subj.code : 'SEM',
        unitTitle: 'Pomodoro Sprint',
        topicTitle: 'Focus Session',
        startTime: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        focusDurationSeconds: elapsedSeconds,
        breakDurationSeconds: 0,
        sessionType: 'pomodoro',
        status: 'completed',
        pomoCycles: 1,
        notes: `Pomodoro Sprint of ${Math.round(elapsedSeconds / 60)}m`
      };
      setSessions(prev => [newSession, ...prev]);

      if (pomoAutoSync && pomoSelectedTopicId) {
        setSubjects(prev =>
          prev.map(sub => ({
            ...sub,
            units: sub.units.map(u => ({
              ...u,
              topics: u.topics.map(t =>
                t.id === pomoSelectedTopicId
                  ? {
                      ...t,
                      totalStudySeconds: t.totalStudySeconds + elapsedSeconds,
                      lastStudiedAt: new Date().toISOString()
                    }
                  : t
              )
            }))
          }))
        );
      }
    }
    resetPomodoro();
    setIsPomoModalOpen(false);
  };

  // Task Operations
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const willBeComplete = !t.completed;
        return {
          ...t,
          completed: willBeComplete,
          completedAt: willBeComplete ? new Date().toISOString() : undefined
        };
      })
    );
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Daily Rhythm
  const updateRhythmItem = (id: string, updates: Partial<DailyRhythmItem>) => {
    setDailyRhythm(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Calculations (STRICTLY complying with rules)
  // Unit progress: Completed topics / Total topics * 100
  const getUnitProgress = useCallback((unit: Unit) => {
    const total = unit.topics.length;
    if (total === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = unit.topics.filter(
      t => t.status === 'completed' || t.status === 'revision'
    ).length;
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  }, []);

  // Subject progress: All completed topics in subject / All topics in subject * 100
  const getSubjectProgress = useCallback((subject: Subject) => {
    let total = 0;
    let completed = 0;
    subject.units.forEach(u => {
      u.topics.forEach(t => {
        total++;
        if (t.status === 'completed' || t.status === 'revision') {
          completed++;
        }
      });
    });
    if (total === 0) return { completed: 0, total: 0, percentage: 0 };
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  }, []);

  // Overall syllabus progress: All completed topics / All topics across all subjects * 100
  const getOverallProgress = useCallback(() => {
    let total = 0;
    let completed = 0;
    subjects.forEach(s => {
      s.units.forEach(u => {
        u.topics.forEach(t => {
          total++;
          if (t.status === 'completed' || t.status === 'revision') {
            completed++;
          }
        });
      });
    });
    if (total === 0) return { completed: 0, total: 0, percentage: 0 };
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  }, [subjects]);

  // Next Examination Countdown
  const getNextExamination = useCallback(() => {
    if (subjects.length === 0) return null;
    const now = new Date('2026-11-05T00:00:00Z').getTime();

    // Sort subjects by examination date
    const sorted = [...subjects].sort((a, b) => {
      const dateA = new Date(a.examDate).getTime();
      const dateB = new Date(b.examDate).getTime();
      return dateA - dateB;
    });

    const nextSubj = sorted.find(s => new Date(s.examDate).getTime() >= now) || sorted[0];
    const examTime = new Date(nextSubj.examDate).getTime();
    const daysLeft = Math.max(0, Math.ceil((examTime - now) / (1000 * 60 * 60 * 24)));

    // Format e.g. "Friday, Nov 13"
    const parsed = new Date(nextSubj.examDate + 'T00:00:00');
    const formattedDate = parsed.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    return {
      subject: nextSubj,
      daysLeft,
      formattedDate
    };
  }, [subjects]);

  // Get topic-specific stats (today's study seconds + total seconds)
  const getTopicStudyStats = useCallback(
    (topicId: string) => {
      let totalSeconds = 0;
      let todaySeconds = 0;

      // Find topic in subjects
      for (const s of subjects) {
        for (const u of s.units) {
          const t = u.topics.find(top => top.id === topicId);
          if (t) {
            totalSeconds = t.totalStudySeconds;
            break;
          }
        }
      }

      // Check today's sessions for this topic
      const todayDateStr = '2026-11-05'; // current applet date
      sessions.forEach(sess => {
        if (sess.topicId === topicId && sess.startTime.startsWith(todayDateStr)) {
          todaySeconds += sess.focusDurationSeconds;
        }
      });

      // Add currently active timer if it's on this topic
      if (activeTimer.isActive && activeTimer.topicId === topicId) {
        todaySeconds += timerElapsedDisplay.focusSeconds;
        totalSeconds += timerElapsedDisplay.focusSeconds;
      }

      return { todaySeconds, totalSeconds };
    },
    [subjects, sessions, activeTimer, timerElapsedDisplay]
  );

  // Backup & Restore
  const exportBackupJSON = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      profile,
      subjects,
      tasks,
      dailyRhythm,
      sessions
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExamBrief_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.subjects || !Array.isArray(data.subjects)) {
        return { success: false, error: 'Invalid backup file format: missing subjects array.' };
      }
      if (data.profile) setProfile(data.profile);
      setSubjects(data.subjects);
      if (data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
      if (data.dailyRhythm && Array.isArray(data.dailyRhythm)) setDailyRhythm(data.dailyRhythm);
      if (data.sessions && Array.isArray(data.sessions)) setSessions(data.sessions);
      return { success: true };
    } catch {
      return { success: false, error: 'Malformed JSON content in uploaded file.' };
    }
  };

  const resetToDefaults = () => {
    setProfile(defaultProfile);
    setSubjects(defaultSubjects);
    setTasks(defaultTasks);
    setDailyRhythm(defaultDailyRhythm);
    setSessions(defaultPastSessions);
    setActiveTimer(DEFAULT_ACTIVE_TIMER);
    setTimerElapsedDisplay({ focusSeconds: 0, breakSeconds: 0 });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedTopicDetails,
        openTopicDetails,
        closeTopicDetails,
        isPomoModalOpen,
        setIsPomoModalOpen,
        isAuditLogModalOpen,
        setIsAuditLogModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,

        profile,
        updateProfile,
        subjects,
        tasks,
        dailyRhythm,
        sessions,

        addSubject,
        updateSubject,
        deleteSubject,
        addUnit,
        updateUnit,
        deleteUnit,
        addTopic,
        updateTopic,
        deleteTopic,
        setTopicStatus,

        activeTimer,
        timerElapsedDisplay,
        startStudyTimer,
        pauseStudyTimer,
        resumeStudyTimer,
        startStudyBreak,
        endStudyTimer,
        resetStudyTimer,

        pomoMode,
        setPomoMode,
        pomoRemainingSeconds,
        pomoIsRunning,
        pomoCycle,
        pomoSelectedSubjectId,
        setPomoSelectedSubjectId,
        pomoSelectedTopicId,
        setPomoSelectedTopicId,
        pomoAmbientSound,
        setPomoAmbientSound,
        pomoAutoSync,
        setPomoAutoSync,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        extendPomodoro5Mins,
        skipPomoPhase,
        endPomodoroSession,

        addTask,
        toggleTask,
        updateTask,
        deleteTask,

        updateRhythmItem,

        getUnitProgress,
        getSubjectProgress,
        getOverallProgress,
        getNextExamination,
        getTopicStudyStats,

        exportBackupJSON,
        importBackupJSON,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
