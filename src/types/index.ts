export type TopicStatus = 'not-started' | 'learning' | 'completed' | 'revision';

export interface FormulaItem {
  id: string;
  title: string;
  equation: string;
  note?: string;
}

export interface AttachmentItem {
  id: string;
  title: string;
  type: 'diagram' | 'pdf' | 'notes';
  size: string;
  date: string;
  url?: string;
  dataUrl?: string; // base64 / blob preview if uploaded
  summary?: string;
}

export interface QuestionItem {
  id: string;
  title: string;
  marks: string; // e.g. "10M Priority", "5M"
  examPaper?: string; // e.g. "Dec 2023 Paper • End-Sem Exam"
  answer?: string;
}

export interface Topic {
  id: string;
  unitId: string;
  subjectId: string;
  topicNumber: string; // e.g. "3.4"
  title: string;
  status: TopicStatus;
  estimatedWeight: string; // e.g. "10 Marks (End-Sem High Yield)"
  overview: string;
  definitions: string[];
  formulas: FormulaItem[];
  keywords: string[];
  questions: QuestionItem[];
  attachments: AttachmentItem[];
  totalStudySeconds: number; // accumulated focused study seconds
  lastStudiedAt?: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  number: number;
  title: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  code: string; // e.g. "MA301", "CS302"
  category: string; // e.g. "CORE THEORY", "MATHEMATICAL", "SYSTEMS"
  examDate: string; // e.g. "2026-11-13"
  examTime: string; // e.g. "09:30 AM – 12:30 PM"
  hall: string; // e.g. "Hall 4B"
  accentColor: string; // hex
  units: Unit[];
}

export interface StudySession {
  id: string;
  subjectId: string;
  unitId: string;
  topicId: string;
  subjectName: string;
  subjectCode: string;
  unitTitle: string;
  topicTitle: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  focusDurationSeconds: number; // actual study seconds (excluding breaks)
  breakDurationSeconds: number; // break seconds
  sessionType: 'topic_study' | 'pomodoro' | 'revision' | 'problem_solving';
  status: 'completed' | 'paused' | 'interrupted';
  notes?: string;
  pomoCycles?: number;
}

export interface Task {
  id: string;
  title: string;
  subjectId?: string;
  unitId?: string;
  topicId?: string;
  subjectName?: string;
  unitName?: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // e.g. "6:00 PM"
  completed: boolean;
  completedAt?: string;
  isCarryForward?: boolean;
  notes?: string;
}

export interface DailyRhythmItem {
  id: string;
  category: 'sleep' | 'nutrition' | 'break' | 'winddown';
  title: string;
  plannedTime: string; // e.g. "11:30 PM → 06:45 AM"
  actualTime?: string;
  status: 'logged' | 'complete' | 'log_now' | 'upcoming';
  detail: string; // e.g. "7h 15m" or "Breakfast 07:30 • Lunch 01:15"
}

export interface ActiveTimerState {
  isActive: boolean;
  isPaused: boolean;
  isOnBreak: boolean;
  subjectId: string;
  unitId: string;
  topicId: string;
  subjectName: string;
  subjectCode: string;
  unitTitle: string;
  topicTitle: string;
  sessionType: 'topic_study' | 'pomodoro' | 'revision' | 'problem_solving';
  // Timestamps for accurate tracking across navigations
  startTimestamp: number;
  lastFocusStartTimestamp: number | null;
  lastBreakStartTimestamp: number | null;
  accumulatedFocusSeconds: number;
  accumulatedBreakSeconds: number;
  targetSeconds: number; // e.g. 3000 (50m) or 1500 (25m)
}

export interface PomodoroSettings {
  focusMinutes: number; // default 25
  shortBreakMinutes: number; // default 5
  longBreakMinutes: number; // default 15
  cyclesBeforeLongBreak: number; // default 4
}

export interface UserProfile {
  name: string;
  semester: string; // "Semester 3 • CSE"
  examinationPeriod: string; // "November 2026"
  dailyTargetHours: number; // default 5.0
}

export type TimeFilter = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom';
