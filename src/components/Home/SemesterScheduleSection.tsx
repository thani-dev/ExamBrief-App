import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export const SemesterScheduleSection: React.FC = () => {
  const { subjects, getSubjectProgress, setActiveTab, setSelectedSubjectId } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sort subjects by exam date
  const sorted = [...subjects].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  const calculateDaysAway = (examDateStr: string) => {
    const now = new Date('2026-11-05T00:00:00Z').getTime();
    const examTime = new Date(examDateStr + 'T00:00:00Z').getTime();
    return Math.max(0, Math.ceil((examTime - now) / (1000 * 60 * 60 * 24)));
  };

  const handleOpenSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveTab('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
      <div className="flex items-center justify-between">
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <Calendar className="w-4 h-4 text-[#8AB4F8]" />
          <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
            Semester Schedule
          </h4>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-[#A5A8B0]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#A5A8B0]" />
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveTab('subject');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1 text-[11px] text-[#8AB4F8] hover:text-[#8AB4F8]/80 font-medium transition-colors"
        >
          <span>All Exams ({subjects.length})</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-3 space-y-2.5">
          {sorted.map(subj => {
            const daysAway = calculateDaysAway(subj.examDate);
            const progress = getSubjectProgress(subj);
            const examDateObj = new Date(subj.examDate + 'T00:00:00');
            const dateFormatted = examDateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={subj.id}
                onClick={() => handleOpenSubject(subj.id)}
                className="p-3 rounded-xl bg-[#252830] border border-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[13px] font-medium text-[#F5F5F5] group-hover:text-[#8AB4F8] transition-colors truncate max-w-[70%]">
                    {subj.code} — {subj.name}
                  </div>
                  <span
                    className={`text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full ${
                      progress.percentage >= 70
                        ? 'bg-[#72C99A]/15 text-[#72C99A]'
                        : progress.percentage >= 40
                        ? 'bg-[#8AB4F8]/15 text-[#8AB4F8]'
                        : 'bg-white/[0.05] text-[#A5A8B0]'
                    }`}
                  >
                    {progress.percentage}% Ready
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] mb-2">
                  <span>
                    {dateFormatted} • {daysAway === 0 ? 'Today' : `${daysAway} days away`}
                  </span>
                  <span>
                    {progress.completed}/{progress.total} topics
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-[#1B1D22] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, progress.percentage))}%`,
                      backgroundColor:
                        progress.percentage >= 70
                          ? '#72C99A'
                          : progress.percentage >= 40
                          ? '#8AB4F8'
                          : '#A78BFA'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
