import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Clock,
  Flame,
  CheckCircle2,
  Moon,
  BookOpen,
  Coffee,
  TrendingUp,
  ArrowRight,
  FileText,
  Share2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TimeFilter } from '../../types';

export const AnalyticsView: React.FC = () => {
  const {
    sessions,
    subjects,
    tasks,
    dailyRhythm,
    timerElapsedDisplay,
    exportBackupJSON,
    setIsAuditLogModalOpen,
    getSubjectProgress
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');

  // Compute focus stats based on filter
  const todayStr = '2026-11-05';
  let focusSeconds = 0;
  let breakSeconds = 0;
  let pomodorosCount = 0;
  const subjectFocusMap: Record<string, number> = {};

  sessions.forEach(s => {
    let matches = false;
    if (timeFilter === 'today') {
      matches = s.startTime.startsWith(todayStr);
    } else if (timeFilter === 'yesterday') {
      matches = s.startTime.startsWith('2026-11-04');
    } else {
      matches = true;
    }

    if (matches) {
      focusSeconds += s.focusDurationSeconds;
      breakSeconds += s.breakDurationSeconds;
      if (s.sessionType === 'pomodoro' || (s.pomoCycles && s.pomoCycles > 0)) {
        pomodorosCount += s.pomoCycles || 1;
      }
      subjectFocusMap[s.subjectName] =
        (subjectFocusMap[s.subjectName] || 0) + s.focusDurationSeconds;
    }
  });

  // Include active timer if filter is today
  if (timeFilter === 'today') {
    focusSeconds += timerElapsedDisplay.focusSeconds;
    breakSeconds += timerElapsedDisplay.breakSeconds;
  }

  const focusHours = Math.floor(focusSeconds / 3600);
  const focusMins = Math.floor((focusSeconds % 3600) / 60);
  const breakMins = Math.round(breakSeconds / 60);

  // Targets completed
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Sleep info
  const sleepItem = dailyRhythm.find(r => r.category === 'sleep');
  const sleepDuration = sleepItem ? sleepItem.detail : '7h 15m';

  // Mastery topics
  let completedTopicsCount = 0;
  subjects.forEach(s => {
    s.units.forEach(u => {
      u.topics.forEach(t => {
        if (t.status === 'completed' || t.status === 'revision') completedTopicsCount++;
      });
    });
  });

  // Weekly Bar Chart Data (Mon to Sun)
  const weeklyData = [
    { day: 'Mon', hours: 4.0, isToday: false },
    { day: 'Tue', hours: 5.5, isToday: false },
    { day: 'Wed', hours: 3.5, isToday: false },
    { day: 'Thu', hours: 4.5, isToday: true }, // Current Applet Date: Thursday Nov 5
    { day: 'Fri', hours: 4.5, isToday: false },
    { day: 'Sat', hours: 7.0, isToday: false },
    { day: 'Sun', hours: 5.0, isToday: false }
  ];

  // Subject allocation array sorted by study time
  const subjectAllocations = Object.entries(subjectFocusMap).map(([name, sec]) => ({
    name,
    minutes: Math.round(sec / 60),
    percentage: focusSeconds > 0 ? Math.round((sec / focusSeconds) * 100) : 0
  }));

  // Fallback defaults if no sessions in current filter yet
  if (subjectAllocations.length === 0) {
    subjectAllocations.push(
      { name: 'Probability and Statistics', minutes: 90, percentage: 45 },
      { name: 'Embedded Systems (ESAI)', minutes: 60, percentage: 30 },
      { name: 'Automata & Compiler Design', minutes: 50, percentage: 25 }
    );
  }

  const handleDownloadReport = () => {
    const reportText = `EXAMBRIEF SEMESTER EXAMINATION PREPARATION REPORT
Period: November 2026
Generated: 2026-11-05
--------------------------------------------------
Total Focused Study Time: ${focusHours}h ${focusMins}m
Pomodoro Sprints: ${pomodorosCount}
Tasks Completed: ${completedTasks} / ${totalTasks} (${taskCompletionRate}%)
Active Subjects: ${subjects.length}

Subject Breakdown:
${subjects
  .map(s => {
    const p = getSubjectProgress(s);
    return `- ${s.code} ${s.name}: ${p.percentage}% completed (${p.completed}/${p.total} topics) | Exam: ${s.examDate}`;
  })
  .join('\n')}

Circadian & Rhythm:
- Sleep: ${sleepDuration}
- On-Time Regularity: 92%
--------------------------------------------------
ExamBrief Offline Academic Cockpit`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExamBrief_Summary_Report_${todayStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-start justify-between px-1">
        <div>
          <h2 className="text-[24px] font-semibold text-[#F5F5F5] tracking-tight">
            Preparation Analytics
          </h2>
          <p className="text-[12px] text-[#A5A8B0] mt-0.5">
            Consistent focus beats last-minute cramming
          </p>
        </div>

        <button
          type="button"
          onClick={exportBackupJSON}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#252830] border border-white/10 text-[#8AB4F8] hover:bg-[#2d313c] text-[11px] font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setTimeFilter('today')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
            timeFilter === 'today'
              ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
              : 'bg-[#252830] text-[#A5A8B0]'
          }`}
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => setTimeFilter('yesterday')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
            timeFilter === 'yesterday'
              ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
              : 'bg-[#252830] text-[#A5A8B0]'
          }`}
        >
          Yesterday
        </button>

        <button
          type="button"
          onClick={() => setTimeFilter('last7')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
            timeFilter === 'last7'
              ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
              : 'bg-[#252830] text-[#A5A8B0]'
          }`}
        >
          Last 7 Days
        </button>

        <button
          type="button"
          onClick={() => setTimeFilter('last30')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
            timeFilter === 'last30'
              ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
              : 'bg-[#252830] text-[#A5A8B0]'
          }`}
        >
          Last 30 Days
        </button>
      </div>

      {/* Top 6 Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Focus Time */}
        <div className="bg-[#1B1D22] p-3.5 rounded-2xl border border-white/[0.07] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] font-semibold uppercase">
            <span>Focus Time</span>
            <Clock className="w-3.5 h-3.5 text-[#8AB4F8]" />
          </div>
          <div className="my-1.5">
            <div className="text-[20px] font-bold text-white tabular-nums tracking-tight">
              {focusHours > 0 ? `${focusHours}h ` : ''}
              {focusMins}m
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#72C99A] font-medium mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+45m vs y'day</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pomodoros */}
        <div className="bg-[#1B1D22] p-3.5 rounded-2xl border border-white/[0.07] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] font-semibold uppercase">
            <span>Pomodoros</span>
            <Flame className="w-3.5 h-3.5 text-[#A78BFA]" />
          </div>
          <div className="my-1.5">
            <div className="text-[20px] font-bold text-white tabular-nums tracking-tight">
              {pomodorosCount || 4} Sprints
            </div>
            <div className="text-[11px] text-[#A5A8B0] mt-0.5">
              {focusMins}m focus • {breakMins}m brk
            </div>
          </div>
        </div>

        {/* Card 3: Targets */}
        <div className="bg-[#1B1D22] p-3.5 rounded-2xl border border-white/[0.07] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] font-semibold uppercase">
            <span>Targets</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#72C99A]" />
          </div>
          <div className="my-1.5">
            <div className="text-[20px] font-bold text-white tabular-nums tracking-tight">
              {completedTasks} / {totalTasks}
            </div>
            <div className="text-[11px] text-[#72C99A] font-medium mt-0.5">
              {taskCompletionRate}% Completion
            </div>
          </div>
        </div>

        {/* Card 4: Sleep */}
        <div className="bg-[#1B1D22] p-3.5 rounded-2xl border border-white/[0.07] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] font-semibold uppercase">
            <span>Sleep</span>
            <Moon className="w-3.5 h-3.5 text-[#8AB4F8]" />
          </div>
          <div className="my-1.5">
            <div className="text-[20px] font-bold text-white tabular-nums tracking-tight">
              {sleepDuration}
            </div>
            <div className="text-[11px] text-[#A5A8B0] mt-0.5">Bedtime: 11:30 PM</div>
          </div>
        </div>

        {/* Card 5: Mastery */}
        <div className="bg-[#1B1D22] p-3.5 rounded-2xl border border-white/[0.07] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] font-semibold uppercase">
            <span>Mastery</span>
            <BookOpen className="w-3.5 h-3.5 text-[#8AB4F8]" />
          </div>
          <div className="my-1.5">
            <div className="text-[20px] font-bold text-white tabular-nums tracking-tight">
              {completedTopicsCount} Topics
            </div>
            <div className="text-[11px] text-[#A5A8B0] mt-0.5">Reviewed & Ready</div>
          </div>
        </div>

        {/* Card 6: Rest Ratio */}
        <div className="bg-[#1B1D22] p-3.5 rounded-2xl border border-white/[0.07] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] font-semibold uppercase">
            <span>Rest Ratio</span>
            <Coffee className="w-3.5 h-3.5 text-[#A78BFA]" />
          </div>
          <div className="my-1.5">
            <div className="text-[20px] font-bold text-white tabular-nums tracking-tight">
              {breakMins || 25}m
            </div>
            <div className="text-[11px] text-[#72C99A] font-medium mt-0.5">
              Optimal (18% ratio)
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Study Log Bar Chart */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">Weekly Study Log</h4>
          </div>
          <span className="text-[11px] text-[#A5A8B0]">Target: 5.0h/day</span>
        </div>

        {/* Chart Canvas */}
        <div className="relative pt-6 pb-2">
          {/* Target Reference Line */}
          <div className="absolute left-0 right-0 top-12 border-b border-dashed border-white/20 flex justify-end">
            <span className="text-[9px] text-[#A5A8B0] pr-1 -mt-3.5 font-mono">5.0h</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4 px-1">
            {weeklyData.map((d, idx) => {
              const maxH = 8.0;
              const heightPercent = Math.min(100, (d.hours / maxH) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-semibold text-[#C3C6D1] tabular-nums">
                    {d.hours.toFixed(1)}
                  </span>
                  <div className="w-full max-w-[28px] bg-[#252830] rounded-lg overflow-hidden flex flex-col justify-end h-24">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ${
                        d.isToday
                          ? 'bg-[#72C99A]'
                          : 'bg-gradient-to-t from-[#8AB4F8]/70 to-[#8AB4F8]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span
                    className={`text-[11px] ${
                      d.isToday ? 'text-[#72C99A] font-bold' : 'text-[#A5A8B0]'
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-[11px] text-[#A5A8B0]">
          <span className="flex items-center gap-1.5 text-white">
            <span className="w-2 h-2 rounded-full bg-[#72C99A]" />
            Today: {focusHours}h {focusMins}m
          </span>
          <span>Weekly Avg: 5.0h</span>
        </div>
      </div>

      {/* Focus Allocation Breakdown */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">Focus Allocation</h4>
          </div>
          <span className="text-[11px] text-[#A5A8B0]">82% Focus • 18% Rest</span>
        </div>

        {/* Stacked bar */}
        <div className="w-full h-2 rounded-full bg-[#252830] overflow-hidden flex mb-3.5">
          <div className="h-full bg-[#8AB4F8]" style={{ width: '45%' }} />
          <div className="h-full bg-[#A78BFA]" style={{ width: '30%' }} />
          <div className="h-full bg-[#72C99A]" style={{ width: '25%' }} />
        </div>

        {/* Subject Items */}
        <div className="space-y-2.5">
          {subjectAllocations.map((item, idx) => {
            const colors = ['#8AB4F8', '#A78BFA', '#72C99A', '#F4C16B'];
            const color = colors[idx % colors.length];

            return (
              <div key={idx}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <div className="flex items-center gap-2 text-[#E3E2E6]">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate max-w-[200px]">{item.name}</span>
                  </div>
                  <div className="text-[11px] text-[#A5A8B0] tabular-nums">
                    {item.minutes} mins ({item.percentage}%)
                  </div>
                </div>
                <div className="w-full h-1 bg-[#252830] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Syllabus Completion List */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#72C99A]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">Syllabus Completion</h4>
          </div>
          <span className="text-[11px] text-[#A5A8B0]">Semester III</span>
        </div>

        <div className="space-y-2.5">
          {subjects.map(subj => {
            const prog = getSubjectProgress(subj);
            return (
              <div
                key={subj.id}
                className="p-3 rounded-xl bg-[#252830] border border-white/[0.04] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Mini Percentage Circle */}
                  <div className="w-10 h-10 rounded-full bg-[#1B1D22] border-2 border-[#8AB4F8]/40 flex items-center justify-center font-bold text-[11px] text-white tabular-nums">
                    {prog.percentage}%
                  </div>

                  <div>
                    <div className="text-[13px] font-medium text-white leading-tight">
                      {subj.name}
                    </div>
                    <div className="text-[11px] text-[#A5A8B0] mt-0.5">
                      {prog.completed}/{prog.total} topics • {prog.total - prog.completed} left
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {prog.percentage >= 70 ? (
                    <CheckCircle2 className="w-5 h-5 text-[#72C99A]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-[#A5A8B0]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit & Circadian Rhythm Card */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
              Habit &amp; Circadian Rhythm
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-[#72C99A]">92% On-Time</span>
        </div>

        <div className="p-3 bg-[#252830] rounded-xl border border-white/[0.04] flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#1B1D22] flex items-center justify-center text-[#8AB4F8]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#A5A8B0] uppercase font-semibold">
              Wake Up Window
            </div>
            <div className="text-[14px] font-semibold text-white">06:45 AM ± 15 mins</div>
          </div>
        </div>

        <div className="text-[11px] text-[#A5A8B0] font-semibold uppercase mb-2">
          Meal Regularity Timings
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-[#252830] rounded-xl">
            <div className="text-[10px] text-[#A5A8B0]">Breakfast</div>
            <div className="text-[12px] font-semibold text-white mt-0.5">07:30 AM</div>
          </div>
          <div className="p-2 bg-[#252830] rounded-xl">
            <div className="text-[10px] text-[#A5A8B0]">Lunch</div>
            <div className="text-[12px] font-semibold text-white mt-0.5">01:15 PM</div>
          </div>
          <div className="p-2 bg-[#252830] rounded-xl">
            <div className="text-[10px] text-[#A5A8B0]">Dinner</div>
            <div className="text-[12px] font-semibold text-white mt-0.5">08:30 PM</div>
          </div>
        </div>
      </div>

      {/* Daily Summary Report Card */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
          <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
            Nov 5 Daily Summary Report
          </h4>
        </div>

        <p className="text-[12px] text-[#C3C6D1] leading-relaxed mb-4">
          Peak productivity was recorded between <span className="text-white font-semibold">09:00 AM – 12:30 PM</span>.
          Probability & Statistics and Embedded Systems revisions progressed on track with zero
          missed pomodoro intervals.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="w-full py-2.5 px-3 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold hover:bg-[#8AB4F8]/90 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download Summary Report</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAuditLogModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#252830] border border-white/[0.08] text-[#E3E2E6] text-[13px] font-medium hover:bg-[#2d313c] transition-all flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4 text-[#8AB4F8]" />
            <span>Study &amp; Pomodoro Session Audit Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};
