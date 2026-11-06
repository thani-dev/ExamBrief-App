import React from 'react';
import { useApp } from '../../context/AppContext';
import { Hourglass, Play, Pause, Coffee, Zap } from 'lucide-react';

export const QuickPomodoroCard: React.FC = () => {
  const {
    pomoIsRunning,
    pomoRemainingSeconds,
    pomoCycle,
    pomoMode,
    startPomodoro,
    pausePomodoro,
    setPomoMode,
    setIsPomoModalOpen
  } = useApp();

  const mins = Math.floor(pomoRemainingSeconds / 60);
  const secs = pomoRemainingSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pomoIsRunning) {
      pausePomodoro();
    } else {
      startPomodoro();
    }
  };

  const handleQuickRest = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPomoMode('short_break');
    setIsPomoModalOpen(true);
  };

  return (
    <div
      onClick={() => setIsPomoModalOpen(true)}
      className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg cursor-pointer hover:border-white/[0.12] transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Hourglass className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span className="text-[14px] font-semibold text-[#F5F5F5]">Focus Pomodoro</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] text-[10px] font-semibold border border-[#A78BFA]/30">
          Cycle {pomoCycle} of 8
        </span>
      </div>

      <div className="flex items-center justify-between">
        {/* Left Timer Ring / Icon */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#252830] border-2 border-[#8AB4F8]/40 flex items-center justify-center text-[#8AB4F8] relative">
            <Zap className="w-4 h-4 fill-[#8AB4F8]" />
          </div>
          <div>
            <div className="text-[20px] font-bold text-[#F5F5F5] tabular-nums tracking-tight">
              {timeFormatted}
            </div>
            <div className="text-[11px] text-[#A5A8B0] font-medium">
              {pomoMode === 'focus' ? 'Default Focus Interval' : 'Rest Break Interval'}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full bg-[#8AB4F8] text-[#101114] flex items-center justify-center hover:bg-[#8AB4F8]/90 transition-all active:scale-95 shadow-md"
            title={pomoIsRunning ? 'Pause' : 'Start'}
          >
            {pomoIsRunning ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleQuickRest}
            className="flex items-center gap-1.5 py-2 px-3 rounded-full bg-[#252830] border border-white/[0.08] text-[#E3E2E6] text-[12px] font-medium hover:bg-[#2d313b] transition-all"
            title="5m Rest"
          >
            <Coffee className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>5m Rest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
