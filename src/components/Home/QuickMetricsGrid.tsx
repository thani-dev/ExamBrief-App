import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Flame, CheckCircle, PieChart } from 'lucide-react';

export const QuickMetricsGrid: React.FC = () => {
  const { profile, tasks, sessions, subjects, timerElapsedDisplay, getOverallProgress } = useApp();

  // Calculate today's focus hours
  const todayStr = '2026-11-05';
  let todayFocusSeconds = 0;
  let todayPomoCycles = 0;

  sessions.forEach(sess => {
    if (sess.startTime.startsWith(todayStr)) {
      todayFocusSeconds += sess.focusDurationSeconds;
      if (sess.sessionType === 'pomodoro' || (sess.pomoCycles && sess.pomoCycles > 0)) {
        todayPomoCycles += sess.pomoCycles || 1;
      }
    }
  });

  // Include current active focus seconds
  todayFocusSeconds += timerElapsedDisplay.focusSeconds;

  const todayHours = (todayFocusSeconds / 3600).toFixed(1);
  const targetHours = profile.dailyTargetHours || 5.0;

  // Task calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Overall syllabus
  const overallProgress = getOverallProgress();

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* 1: Focused Study Time */}
      <div className="bg-[#1B1D22] p-2.5 rounded-2xl border border-white/[0.06] flex flex-col justify-between min-h-[78px]">
        <Clock className="w-3.5 h-3.5 text-[#8AB4F8]" />
        <div>
          <div className="text-[15px] font-semibold text-[#F5F5F5] tabular-nums leading-tight">
            {todayHours}h
          </div>
          <div className="text-[10px] text-[#A5A8B0] font-medium truncate">
            Target {targetHours}h
          </div>
        </div>
      </div>

      {/* 2: Pomodoro Cycles */}
      <div className="bg-[#1B1D22] p-2.5 rounded-2xl border border-white/[0.06] flex flex-col justify-between min-h-[78px]">
        <Flame className="w-3.5 h-3.5 text-[#A78BFA]" />
        <div>
          <div className="text-[15px] font-semibold text-[#F5F5F5] tabular-nums leading-tight">
            {todayPomoCycles}/8
          </div>
          <div className="text-[10px] text-[#A5A8B0] font-medium truncate">
            Pomo cycles
          </div>
        </div>
      </div>

      {/* 3: Tasks */}
      <div className="bg-[#1B1D22] p-2.5 rounded-2xl border border-white/[0.06] flex flex-col justify-between min-h-[78px]">
        <CheckCircle className="w-3.5 h-3.5 text-[#72C99A]" />
        <div>
          <div className="text-[15px] font-semibold text-[#F5F5F5] tabular-nums leading-tight">
            {completedTasks}/{totalTasks}
          </div>
          <div className="text-[10px] text-[#A5A8B0] font-medium truncate">
            Tasks ({taskPercentage}%)
          </div>
        </div>
      </div>

      {/* 4: Overall Syllabus */}
      <div className="bg-[#1B1D22] p-2.5 rounded-2xl border border-white/[0.06] flex flex-col justify-between min-h-[78px]">
        <PieChart className="w-3.5 h-3.5 text-[#8AB4F8]" />
        <div>
          <div className="text-[15px] font-semibold text-[#F5F5F5] tabular-nums leading-tight">
            {overallProgress.percentage}%
          </div>
          <div className="text-[10px] text-[#A5A8B0] font-medium truncate">
            {subjects.length} Subjects
          </div>
        </div>
      </div>
    </div>
  );
};
