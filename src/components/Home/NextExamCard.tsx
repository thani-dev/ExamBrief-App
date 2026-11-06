import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, PlayCircle, BookOpen, Clock } from 'lucide-react';

export const NextExamCard: React.FC = () => {
  const { getNextExamination, getSubjectProgress, setActiveTab, setSelectedSubjectId, openTopicDetails, startStudyTimer } = useApp();
  const nextExam = getNextExamination();

  if (!nextExam) return null;

  const { subject, daysLeft } = nextExam;
  const progress = getSubjectProgress(subject);

  // Find a topic to revise in this subject
  const firstUnit = subject.units[0];
  const firstTopic = firstUnit?.topics[0];

  const handleJumpToRevision = () => {
    if (firstTopic && firstUnit) {
      openTopicDetails(subject.id, firstUnit.id, firstTopic.id);
      startStudyTimer(subject.id, firstUnit.id, firstTopic.id, 'revision');
    } else {
      setSelectedSubjectId(subject.id);
      setActiveTab('subject');
    }
  };

  const handleViewSyllabus = () => {
    setSelectedSubjectId(subject.id);
    setActiveTab('subject');
  };

  // Completed units calculation
  const completedUnits = subject.units.filter(u => {
    const total = u.topics.length;
    if (total === 0) return false;
    const comp = u.topics.filter(t => t.status === 'completed' || t.status === 'revision').length;
    return comp === total;
  });

  const remainingTopics = progress.total - progress.completed;

  return (
    <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg relative overflow-hidden transition-all hover:border-white/[0.12]">
      {/* Top Header Tag & Countdown */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
          <span className="text-[11px] font-semibold tracking-wider text-[#A5A8B0] uppercase">
            Next Examination
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8AB4F8]/15 border border-[#8AB4F8]/30 text-[#8AB4F8] text-[11px] font-semibold">
          <Clock className="w-3 h-3" />
          <span>{daysLeft === 0 ? 'Today' : `${daysLeft} Days Left`}</span>
        </div>
      </div>

      {/* Exam Title & Timing */}
      <h3 className="text-[18px] font-semibold text-[#F5F5F5] tracking-tight leading-snug">
        {subject.code} — {subject.name}
      </h3>
      <div className="flex items-center gap-2 text-[12px] text-[#A5A8B0] mt-1">
        <Calendar className="w-3.5 h-3.5 text-[#8AB4F8] shrink-0" />
        <span>
          {nextExam.formattedDate} • {subject.examTime} ({subject.hall})
        </span>
      </div>

      {/* Syllabus Preparedness Well */}
      <div className="mt-3.5 p-3 rounded-xl bg-[#252830] border border-white/[0.06]">
        <div className="flex items-center justify-between text-[12px] mb-2">
          <span className="text-[#C3C6D1] font-medium">Syllabus Preparedness</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#72C99A] font-semibold tabular-nums text-[13px]">
              {progress.percentage}%
            </span>
            <span className="text-[#A5A8B0] text-[11px]">
              ({progress.completed}/{progress.total} topics)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#1B1D22] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#72C99A] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress.percentage))}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#A5A8B0]">
          <span>
            {completedUnits.length > 0
              ? `Unit ${completedUnits.map(u => u.number).join(', ')} Completed`
              : 'Preparations in progress'}
          </span>
          <span className="text-[#8AB4F8] font-medium">
            {remainingTopics > 0 ? `${remainingTopics} topics left` : 'All topics covered'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 mt-3.5">
        <button
          type="button"
          onClick={handleJumpToRevision}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold hover:bg-[#8AB4F8]/90 transition-all active:scale-[0.98]"
        >
          <PlayCircle className="w-4 h-4 fill-current text-[#101114]" />
          <span>Jump to Revision</span>
        </button>

        <button
          type="button"
          onClick={handleViewSyllabus}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#252830] border border-white/[0.08] text-[#E3E2E6] text-[13px] font-medium hover:bg-[#2e323c] transition-all active:scale-[0.98]"
        >
          <BookOpen className="w-4 h-4 text-[#A5A8B0]" />
          <span>View Syllabus</span>
        </button>
      </div>
    </div>
  );
};
