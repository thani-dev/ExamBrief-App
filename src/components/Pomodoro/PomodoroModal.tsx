import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  BookOpen,
  Zap,
  Sparkles,
  Droplets,
  Layers,
  Check
} from 'lucide-react';

export const PomodoroModal: React.FC = () => {
  const {
    isPomoModalOpen,
    setIsPomoModalOpen,
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
    subjects,
    sessions
  } = useApp();

  const [isSelectingTopic, setIsSelectingTopic] = useState(false);

  if (!isPomoModalOpen) return null;

  const mins = Math.floor(pomoRemainingSeconds / 60);
  const secs = pomoRemainingSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Ring progress calculation
  const totalPhaseSecs =
    pomoMode === 'focus'
      ? 25 * 60
      : pomoMode === 'short_break'
      ? 5 * 60
      : pomoMode === 'long_break'
      ? 15 * 60
      : 30 * 60;
  const progressRatio = Math.max(0, Math.min(1, 1 - pomoRemainingSeconds / totalPhaseSecs));
  const strokeDashoffset = 283 - 283 * progressRatio;

  // Selected Subject & Topic names
  const currentSubj = subjects.find(s => s.id === pomoSelectedSubjectId) || subjects[0];
  let currentTopicTitle = 'General Study Block';
  let currentUnitTitle = 'Unit Review';
  if (currentSubj) {
    for (const u of currentSubj.units) {
      const top = u.topics.find(t => t.id === pomoSelectedTopicId);
      if (top) {
        currentTopicTitle = top.title;
        currentUnitTitle = u.title;
        break;
      }
    }
  }

  // Today's focus metrics
  const todayStr = '2026-11-05';
  let todaySprints = 0;
  let todayFocusMins = 0;
  let todayRestMins = 0;

  sessions.forEach(s => {
    if (s.startTime.startsWith(todayStr)) {
      if (s.sessionType === 'pomodoro' || (s.pomoCycles && s.pomoCycles > 0)) {
        todaySprints += s.pomoCycles || 1;
      }
      todayFocusMins += Math.round(s.focusDurationSeconds / 60);
      todayRestMins += Math.round(s.breakDurationSeconds / 60);
    }
  });

  const handleModeChange = (mode: 'focus' | 'short_break' | 'long_break' | 'custom') => {
    setPomoMode(mode);
    pausePomodoro();
    if (mode === 'focus') {
      // 25m
      // Remaining is updated via context reset
    }
  };

  const cycleAmbientSound = () => {
    if (pomoAmbientSound === 'rain') setPomoAmbientSound('whitenoise');
    else if (pomoAmbientSound === 'whitenoise') setPomoAmbientSound('library');
    else if (pomoAmbientSound === 'library') setPomoAmbientSound('none');
    else setPomoAmbientSound('rain');
  };

  const getAmbientLabel = () => {
    switch (pomoAmbientSound) {
      case 'rain':
        return 'Rain (Soft 42dB)';
      case 'whitenoise':
        return 'White Noise (Steady)';
      case 'library':
        return 'Library Ambience';
      case 'none':
      default:
        return 'Muted Ambience';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#101114] flex flex-col justify-between max-w-md mx-auto overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-[#101114]/90 backdrop-blur-md px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsPomoModalOpen(false)}
          className="w-9 h-9 rounded-full bg-[#1B1D22] border border-white/10 flex items-center justify-center text-[#A5A8B0] hover:text-white"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#72C99A]/15 border border-[#72C99A]/20 text-[#72C99A] text-[11px] font-semibold">
          <span
            className={`w-2 h-2 rounded-full bg-[#72C99A] ${pomoIsRunning ? 'animate-ping' : ''}`}
          />
          <span>{pomoIsRunning ? 'SESSION ACTIVE' : 'PAUSED'}</span>
        </div>

        <button
          type="button"
          onClick={cycleAmbientSound}
          className="w-9 h-9 rounded-full bg-[#1B1D22] border border-white/10 flex items-center justify-center text-[#8AB4F8] hover:text-white"
          title={`Ambient: ${getAmbientLabel()}`}
        >
          {pomoAmbientSound !== 'none' ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#A5A8B0]" />
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Interval Mode Selector */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleModeChange('focus')}
            className={`py-2 px-2.5 rounded-xl text-[12px] font-semibold transition-all ${
              pomoMode === 'focus'
                ? 'bg-[#8AB4F8] text-[#101114]'
                : 'bg-[#1B1D22] text-[#A5A8B0] border border-white/[0.06]'
            }`}
          >
            Focus (25m)
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('short_break')}
            className={`py-2 px-2.5 rounded-xl text-[12px] font-semibold transition-all ${
              pomoMode === 'short_break'
                ? 'bg-[#8AB4F8] text-[#101114]'
                : 'bg-[#1B1D22] text-[#A5A8B0] border border-white/[0.06]'
            }`}
          >
            Short Break (5m)
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('long_break')}
            className={`py-2 px-2.5 rounded-xl text-[12px] font-semibold transition-all ${
              pomoMode === 'long_break'
                ? 'bg-[#8AB4F8] text-[#101114]'
                : 'bg-[#1B1D22] text-[#A5A8B0] border border-white/[0.06]'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Selected Subject & Topic Association */}
        <div
          onClick={() => setIsSelectingTopic(!isSelectingTopic)}
          className="p-3 bg-[#1B1D22] rounded-2xl border border-white/[0.07] flex items-center justify-between cursor-pointer hover:border-white/[0.12] transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-[#252830] flex items-center justify-center text-[#8AB4F8] shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-[#8AB4F8] truncate uppercase">
                {currentSubj?.code} • {currentSubj?.name}
              </div>
              <div className="text-[13px] font-medium text-white truncate">
                {currentTopicTitle}
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#A5A8B0] shrink-0">Change</span>
        </div>

        {/* Topic Selector Accordion */}
        {isSelectingTopic && (
          <div className="p-3 bg-[#1B1D22] rounded-2xl border border-white/10 space-y-2 animate-in fade-in">
            <span className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Associate Pomodoro with Topic:
            </span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 no-scrollbar">
              {subjects.map(s => (
                <div key={s.id} className="space-y-1">
                  <div className="text-[11px] font-semibold text-[#8AB4F8] px-1">{s.name}</div>
                  {s.units.flatMap(u =>
                    u.topics.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setPomoSelectedSubjectId(s.id);
                          setPomoSelectedTopicId(t.id);
                          setIsSelectingTopic(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-[12px] flex items-center justify-between transition-colors ${
                          pomoSelectedTopicId === t.id
                            ? 'bg-[#8AB4F8]/20 text-[#8AB4F8] font-semibold'
                            : 'bg-[#252830] text-[#E3E2E6] hover:bg-[#2d313c]'
                        }`}
                      >
                        <span className="truncate">{t.title}</span>
                        {pomoSelectedTopicId === t.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Circular Countdown Ring */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#1B1D22"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={pomoMode === 'focus' ? '#8AB4F8' : '#A78BFA'}
              strokeWidth="4"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[44px] font-bold text-[#F5F5F5] tabular-nums tracking-tight leading-none">
              {timeFormatted}
            </div>

            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8AB4F8] mt-2">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>
                Sprint {pomoCycle} of 4
              </span>
            </div>

            <div className="text-[11px] text-[#A5A8B0] mt-1">
              Target: 100m total focus today
            </div>

            {/* Ambient Sound Pill */}
            <button
              type="button"
              onClick={cycleAmbientSound}
              className="mt-3 px-3 py-1 rounded-full bg-[#252830] border border-white/10 text-[11px] text-[#8AB4F8] font-medium flex items-center gap-1.5 hover:bg-[#2e323e]"
            >
              <Droplets className="w-3 h-3 text-[#8AB4F8]" />
              <span>{getAmbientLabel()}</span>
            </button>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-6 my-2">
          {/* Reset Button */}
          <button
            type="button"
            onClick={resetPomodoro}
            className="w-12 h-12 rounded-full bg-[#1B1D22] border border-white/10 flex items-center justify-center text-[#A5A8B0] hover:text-white transition-all active:scale-95 shadow-md"
            title="Reset interval"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={pomoIsRunning ? pausePomodoro : startPomodoro}
            className="w-16 h-16 rounded-full bg-[#8AB4F8] text-[#101114] flex items-center justify-center hover:bg-[#8AB4F8]/90 transition-all active:scale-95 shadow-xl shadow-[#8AB4F8]/20"
          >
            {pomoIsRunning ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={skipPomoPhase}
            className="w-12 h-12 rounded-full bg-[#1B1D22] border border-white/10 flex items-center justify-center text-[#A5A8B0] hover:text-white transition-all active:scale-95 shadow-md"
            title="Skip to next phase"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Extension +5 Mins */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={extendPomodoro5Mins}
            className="px-4 py-2 rounded-full bg-[#1B1D22] border border-white/10 text-[#E3E2E6] text-[12px] font-medium hover:bg-[#252830] transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#8AB4F8]" />
            <span>+5 Mins Extension</span>
          </button>
        </div>

        {/* Today's Focus Metrics Well */}
        <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg mt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#72C99A]" />
              <h4 className="text-[13px] font-semibold text-[#F5F5F5]">Today's Focus Metrics</h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#72C99A]/15 text-[#72C99A] text-[10px] font-semibold">
              On Schedule
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-[#252830] rounded-xl">
              <div className="text-[16px] font-bold text-white tabular-nums">{todaySprints}</div>
              <div className="text-[10px] text-[#A5A8B0]">Sprints</div>
            </div>
            <div className="p-2 bg-[#252830] rounded-xl">
              <div className="text-[16px] font-bold text-[#72C99A] tabular-nums">
                {todayFocusMins}m
              </div>
              <div className="text-[10px] text-[#A5A8B0]">Focus</div>
            </div>
            <div className="p-2 bg-[#252830] rounded-xl">
              <div className="text-[16px] font-bold text-[#A78BFA] tabular-nums">
                {todayRestMins}m
              </div>
              <div className="text-[10px] text-[#A5A8B0]">Rest</div>
            </div>
            <div className="p-2 bg-[#252830] rounded-xl">
              <div className="text-[16px] font-bold text-white tabular-nums">0</div>
              <div className="text-[10px] text-[#A5A8B0]">Distract</div>
            </div>
          </div>

          {/* Auto-sync to Syllabus Toggle */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.04]">
            <div>
              <div className="text-[12px] font-medium text-white">Auto-sync to Syllabus</div>
              <div className="text-[10px] text-[#A5A8B0]">
                Credits directly to Unit {currentUnitTitle} mastery
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPomoAutoSync(!pomoAutoSync)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                pomoAutoSync ? 'bg-[#72C99A]' : 'bg-[#252830]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  pomoAutoSync ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* End & Log Session Button */}
        <button
          type="button"
          onClick={endPomodoroSession}
          className="w-full py-3 rounded-xl bg-[#252830] border border-white/10 text-white text-[13px] font-semibold hover:bg-[#2d313c] transition-colors"
        >
          End & Save Pomodoro Sprint
        </button>
      </div>
    </div>
  );
};
