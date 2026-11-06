import React from 'react';
import { useApp } from '../../context/AppContext';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { NextExamCard } from './NextExamCard';
import { QuickMetricsGrid } from './QuickMetricsGrid';
import { ActiveSessionCard } from './ActiveSessionCard';
import { QuickPomodoroCard } from './QuickPomodoroCard';
import { DailyRhythmCard } from './DailyRhythmCard';
import { TodayQueueSection } from './TodayQueueSection';
import { SemesterScheduleSection } from './SemesterScheduleSection';

export const HomeView: React.FC = () => {
  const { profile, getNextExamination, setActiveTab, setIsSettingsOpen } = useApp();
  const nextExam = getNextExamination();

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* User Greeting & Header Info */}
      <div className="flex items-start justify-between px-1">
        <div>
          <h2 className="text-[26px] font-semibold text-[#F5F5F5] tracking-tight leading-tight">
            {getGreeting()},{' '}
            <span className="text-[#8AB4F8]">{profile.name || 'Scholar'}</span>
          </h2>
          <p className="text-[12px] text-[#A5A8B0] font-medium mt-1">
            Thursday, Nov 5 • {profile.semester}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 rounded-full bg-[#1B1D22] border border-white/10 flex items-center justify-center text-[#A5A8B0] hover:text-white hover:bg-[#252830] transition-colors"
          title="Daily Study Target & Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Top Banner Alert */}
      {nextExam && (
        <button
          type="button"
          onClick={() => {
            setActiveTab('subject');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-full bg-[#1B1D22] border border-white/[0.06] text-left hover:border-white/[0.12] transition-colors group"
        >
          <div className="flex items-center gap-2 text-[11px] text-[#C3C6D1] truncate">
            <span className="w-2 h-2 rounded-full bg-[#8AB4F8] shrink-0" />
            <span className="truncate">
              {nextExam.daysLeft} days until {nextExam.subject.name} block starts
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8AB4F8] shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
            <span>Review Schedule</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </button>
      )}

      {/* 1. Priority Now Widget: Next Examination */}
      <NextExamCard />

      {/* 2. 4 Quick Stat Cards */}
      <QuickMetricsGrid />

      {/* 3. Active Session Tracker */}
      <ActiveSessionCard />

      {/* 4. Quick Focus Pomodoro */}
      <QuickPomodoroCard />

      {/* 5. Daily Academic Rhythm */}
      <DailyRhythmCard />

      {/* 6. Today's Study Queue */}
      <TodayQueueSection />

      {/* 7. Semester Schedule */}
      <SemesterScheduleSection />
    </div>
  );
};
