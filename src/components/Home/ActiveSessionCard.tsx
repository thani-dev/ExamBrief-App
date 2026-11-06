import React from 'react';
import { useApp } from '../../context/AppContext';
import { Pause, Play, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export const ActiveSessionCard: React.FC = () => {
  const {
    activeTimer,
    timerElapsedDisplay,
    pauseStudyTimer,
    resumeStudyTimer,
    endStudyTimer,
    subjects,
    startStudyTimer,
    openTopicDetails
  } = useApp();

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  // If no timer active, offer quick start on first pending topic
  if (!activeTimer.isActive) {
    const firstSubj = subjects[0];
    const firstUnit = firstSubj?.units[0];
    const pendingTopic =
      firstUnit?.topics.find(t => t.status === 'learning' || t.status === 'revision') ||
      firstUnit?.topics[0];

    const handleQuickStart = () => {
      if (firstSubj && firstUnit && pendingTopic) {
        startStudyTimer(firstSubj.id, firstUnit.id, pendingTopic.id, 'topic_study');
      }
    };

    return (
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A5A8B0]" />
            <span className="text-[11px] font-semibold tracking-wider text-[#A5A8B0] uppercase">
              Study Session Tracker
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-[#A5A8B0] text-[10px] font-medium">
            Standby
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <h4 className="text-[15px] font-medium text-[#E3E2E6]">
              {pendingTopic ? pendingTopic.title : 'Ready to start deep work'}
            </h4>
            <p className="text-[12px] text-[#A5A8B0] mt-0.5">
              {firstSubj ? `${firstSubj.code} • ${firstUnit?.title}` : 'Pick a subject and begin'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickStart}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#8AB4F8] text-[#101114] text-[12px] font-semibold hover:bg-[#8AB4F8]/90 transition-all active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Focus</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-[#72C99A]/30 shadow-lg relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#72C99A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#72C99A]"></span>
          </span>
          <span className="text-[11px] font-semibold tracking-wider text-[#72C99A] uppercase">
            Active Session Tracker
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#72C99A]/15 text-[#72C99A] text-[10px] font-semibold border border-[#72C99A]/20">
          <Sparkles className="w-3 h-3" />
          <span>{activeTimer.isOnBreak ? 'Rest Break' : 'Deep Work'}</span>
        </div>
      </div>

      {/* Subject & Topic Info */}
      <div className="flex items-baseline justify-between">
        <div className="max-w-[70%]">
          <h4
            onClick={() =>
              openTopicDetails(activeTimer.subjectId, activeTimer.unitId, activeTimer.topicId)
            }
            className="text-[16px] font-semibold text-[#F5F5F5] tracking-tight leading-snug cursor-pointer hover:text-[#8AB4F8] transition-colors"
          >
            {activeTimer.subjectName} — {activeTimer.unitTitle}
          </h4>
          <div className="flex items-center gap-1.5 text-[12px] text-[#A5A8B0] mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#72C99A] shrink-0" />
            <span className="truncate">Subtopic: {activeTimer.topicTitle}</span>
          </div>
        </div>

        {/* Live Elapsed Focus Time */}
        <div className="text-right">
          <div className="text-[20px] font-semibold text-[#F5F5F5] tabular-nums tracking-tight">
            {formatElapsed(timerElapsedDisplay.focusSeconds)}
          </div>
          <div className="text-[10px] text-[#A5A8B0] font-medium">Logged today</div>
        </div>
      </div>

      {/* Session Controls */}
      <div className="grid grid-cols-2 gap-2.5 mt-3.5">
        {activeTimer.isPaused ? (
          <button
            type="button"
            onClick={resumeStudyTimer}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold hover:bg-[#8AB4F8]/90 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Block</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={pauseStudyTimer}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold hover:bg-[#8AB4F8]/90 transition-all active:scale-[0.98]"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause Study Block</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => endStudyTimer()}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#252830] border border-white/[0.08] text-[#E3E2E6] text-[13px] font-medium hover:bg-[#2e323c] transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4 text-[#A5A8B0]" />
          <span>Log & End</span>
        </button>
      </div>
    </div>
  );
};
