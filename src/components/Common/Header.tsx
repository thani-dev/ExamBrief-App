import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Moon, Bell, User, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ subtitle }) => {
  const { activeTab, profile, getNextExamination, setIsSettingsOpen } = useApp();
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const nextExam = getNextExamination();

  const getSubtitle = () => {
    if (subtitle) return subtitle;
    switch (activeTab) {
      case 'home':
        return 'Home';
      case 'subject':
        return 'Subject';
      case 'analytics':
        return 'Analytics';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#121316]/90 backdrop-blur-md px-4 py-3 border-b border-white/[0.06]">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B1D22] border border-white/10 flex items-center justify-center text-[#8AB4F8] shadow-sm">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-[#E3E2E6] leading-none">
              ExamBrief
            </div>
            <div className="text-[11px] font-medium text-[#A5A8B0] tracking-wide uppercase mt-0.5">
              {getSubtitle()}
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#A5A8B0] hover:text-[#E3E2E6] hover:bg-white/[0.04] transition-colors"
            title="Dark OLED Theme Active"
          >
            <Moon className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationBadge(!showNotificationBadge)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#A5A8B0] hover:text-[#E3E2E6] hover:bg-white/[0.04] transition-colors relative"
              title="Exam Alerts"
            >
              <Bell className="w-4 h-4" />
              {nextExam && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8AB4F8] ring-2 ring-[#121316]" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationBadge && nextExam && (
              <div className="absolute right-0 mt-2 w-72 p-3 bg-[#1B1D22] border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8AB4F8]">
                    Upcoming Milestone
                  </span>
                  <span className="text-[10px] text-[#A5A8B0]">3rd Semester</span>
                </div>
                <div className="p-2.5 bg-[#252830] rounded-xl border border-white/5">
                  <div className="text-[13px] font-medium text-white leading-snug">
                    {nextExam.subject.name}
                  </div>
                  <div className="text-[11px] text-[#A5A8B0] mt-1 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#72C99A]" />
                    {nextExam.daysLeft} days remaining ({nextExam.formattedDate})
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="w-9 h-9 rounded-full bg-[#1B1D22] border border-white/10 flex items-center justify-center text-[#8AB4F8] hover:bg-[#252830] transition-colors ml-0.5"
            title="Profile & Backup Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
