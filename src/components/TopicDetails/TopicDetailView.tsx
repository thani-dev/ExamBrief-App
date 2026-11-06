import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MoreVertical,
  Play,
  Pause,
  Coffee,
  RotateCcw,
  CheckCircle,
  FileText,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Plus,
  Eye,
  Download,
  Trash2,
  Edit2,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { Topic, FormulaItem, QuestionItem, AttachmentItem, TopicStatus } from '../../types';

export const TopicDetailView: React.FC = () => {
  const {
    selectedTopicDetails,
    closeTopicDetails,
    subjects,
    activeTimer,
    timerElapsedDisplay,
    startStudyTimer,
    pauseStudyTimer,
    resumeStudyTimer,
    startStudyBreak,
    endStudyTimer,
    resetStudyTimer,
    setTopicStatus,
    updateTopic,
    getTopicStudyStats,
    sessions
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'notes' | 'formulas' | 'questions'>('notes');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [overviewDraft, setOverviewDraft] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentItem | null>(null);

  // New item modals
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [formulaTitle, setFormulaTitle] = useState('');
  const [formulaEquation, setFormulaEquation] = useState('');

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionMarks, setQuestionMarks] = useState('10M Priority');
  const [questionPaper, setQuestionPaper] = useState('Dec 2024 End-Sem Exam');

  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [attachmentTitle, setAttachmentTitle] = useState('');
  const [attachmentType, setAttachmentType] = useState<'diagram' | 'pdf' | 'notes'>('diagram');

  if (!selectedTopicDetails) return null;

  const { subjectId, unitId, topicId } = selectedTopicDetails;
  const subject = subjects.find(s => s.id === subjectId);
  const unit = subject?.units.find(u => u.id === unitId);
  const topic = unit?.topics.find(t => t.id === topicId);

  if (!subject || !unit || !topic) {
    return (
      <div className="p-6 text-center text-[#A5A8B0]">
        Topic details not found.
        <button
          onClick={closeTopicDetails}
          className="block mx-auto mt-3 px-4 py-2 bg-[#8AB4F8] text-[#101114] rounded-xl text-sm font-semibold"
        >
          Return
        </button>
      </div>
    );
  }

  // Active Timer checks
  const isThisTopicActive = activeTimer.isActive && activeTimer.topicId === topic.id;
  const currentFocusSeconds = isThisTopicActive ? timerElapsedDisplay.focusSeconds : 0;
  const isPaused = isThisTopicActive && activeTimer.isPaused;
  const isOnBreak = isThisTopicActive && activeTimer.isOnBreak;

  // Formatting helpers
  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const formatHoursMins = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const { todaySeconds, totalSeconds } = getTopicStudyStats(topic.id);

  // Target ring calculation (50 mins target = 3000s)
  const targetSecs = activeTimer.targetSeconds || 3000;
  const progressRatio = Math.min(1, currentFocusSeconds / targetSecs);
  const strokeDashoffset = 283 - 283 * progressRatio;

  // Handle Complete Topic
  const handleCompleteTopic = () => {
    const nextStatus: TopicStatus = topic.status === 'completed' ? 'revision' : 'completed';
    setTopicStatus(subject.id, unit.id, topic.id, nextStatus);
  };

  // Add Formula
  const handleAddFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulaEquation.trim()) return;
    const newFormula: FormulaItem = {
      id: 'f-' + Date.now(),
      title: formulaTitle.trim() || 'Key Formula',
      equation: formulaEquation.trim()
    };
    updateTopic(subject.id, unit.id, topic.id, {
      formulas: [...topic.formulas, newFormula]
    });
    setFormulaTitle('');
    setFormulaEquation('');
    setIsFormulaModalOpen(false);
  };

  // Add Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim()) return;
    const newQ: QuestionItem = {
      id: 'q-' + Date.now(),
      title: questionTitle.trim(),
      marks: questionMarks,
      examPaper: questionPaper
    };
    updateTopic(subject.id, unit.id, topic.id, {
      questions: [...topic.questions, newQ]
    });
    setQuestionTitle('');
    setIsQuestionModalOpen(false);
  };

  // Add Attachment / Diagram
  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachmentTitle.trim()) return;
    const newAtt: AttachmentItem = {
      id: 'att-' + Date.now(),
      title: attachmentTitle.trim(),
      type: attachmentType,
      size: '650 KB',
      date: 'Today',
      summary: 'Attached study reference note'
    };
    updateTopic(subject.id, unit.id, topic.id, {
      attachments: [...topic.attachments, newAtt]
    });
    setAttachmentTitle('');
    setIsAttachmentModalOpen(false);
  };

  // Save Overview
  const handleSaveOverview = () => {
    updateTopic(subject.id, unit.id, topic.id, { overview: overviewDraft });
    setIsEditingOverview(false);
  };

  return (
    <div className="space-y-4 pb-28 pt-1">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={closeTopicDetails}
          className="flex items-center gap-1.5 text-[13px] text-[#A5A8B0] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Syllabus</span>
        </button>

        <div className="flex items-center gap-2">
          {isThisTopicActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#72C99A]/15 text-[#72C99A] text-[11px] font-semibold border border-[#72C99A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72C99A] animate-pulse" />
              <span>Active Session</span>
            </div>
          )}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A5A8B0] hover:text-white hover:bg-white/[0.05]"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breadcrumb Path Pill */}
      <div className="flex items-center gap-2 text-[11px] font-medium overflow-x-auto no-scrollbar">
        <span className="px-2.5 py-1 rounded-full bg-[#252830] text-[#8AB4F8] shrink-0 border border-white/5">
          {subject.code} • {subject.name}
        </span>
        <span className="text-[#A5A8B0] shrink-0">&gt;</span>
        <span className="px-2.5 py-1 rounded-full bg-[#252830] text-[#A78BFA] shrink-0 border border-white/5">
          Unit {unit.number}: {unit.title}
        </span>
      </div>

      {/* Topic Title Card */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#A5A8B0] tracking-wider uppercase">
              Topic {topic.topicNumber}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                topic.status === 'completed'
                  ? 'bg-[#72C99A]/15 text-[#72C99A]'
                  : topic.status === 'revision'
                  ? 'bg-[#A78BFA]/20 text-[#A78BFA]'
                  : topic.status === 'learning'
                  ? 'bg-[#8AB4F8]/15 text-[#8AB4F8]'
                  : 'bg-white/[0.05] text-[#A5A8B0]'
              }`}
            >
              {topic.status === 'not-started' ? 'Not Started' : topic.status}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#252830] flex items-center justify-center text-[#8AB4F8]">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h2 className="text-[20px] font-semibold text-[#F5F5F5] tracking-tight leading-snug">
          {topic.title}
        </h2>
        <div className="text-[12px] text-[#A5A8B0] mt-1 font-medium">
          Estimated weight: {topic.estimatedWeight}
        </div>
      </div>

      {/* PROMINENT STUDY TIMER CARD */}
      <div className="bg-[#1B1D22] rounded-[20px] p-5 border border-white/[0.07] shadow-xl text-center relative overflow-hidden">
        {/* Header Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isThisTopicActive
                  ? isOnBreak
                    ? 'bg-[#A78BFA]'
                    : isPaused
                    ? 'bg-[#F4C16B]'
                    : 'bg-[#72C99A] animate-ping'
                  : 'bg-[#8AB4F8]'
              }`}
            />
            <span className="text-[11px] font-semibold tracking-wider text-[#A5A8B0] uppercase">
              {isThisTopicActive
                ? isOnBreak
                  ? 'Rest Break Active'
                  : isPaused
                  ? 'Session Paused'
                  : 'Focus Session Active'
                : 'Study Timer'}
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#A5A8B0] px-2 py-0.5 bg-[#252830] rounded-full">
            50m Target
          </span>
        </div>

        {/* Circular Radial Timer Ring */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#252830"
              strokeWidth="5"
            />
            {/* Progress Stroke */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={isOnBreak ? '#A78BFA' : '#8AB4F8'}
              strokeWidth="5"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[36px] font-bold text-[#F5F5F5] tabular-nums tracking-tight leading-none">
              {formatSeconds(currentFocusSeconds)}
            </div>
            <div className="text-[11px] font-semibold text-[#8AB4F8] uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>{isOnBreak ? 'Resting' : isPaused ? 'Paused' : 'Deep Focus'}</span>
            </div>
            <div className="text-[10px] text-[#A5A8B0] mt-1">
              Streak x{sessions.length > 0 ? Math.min(sessions.length, 5) : 1}
            </div>
          </div>
        </div>

        {/* Study Timer Controls */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {!isThisTopicActive ? (
            <button
              type="button"
              onClick={() => startStudyTimer(subject.id, unit.id, topic.id, 'topic_study')}
              className="col-span-3 py-3 px-4 rounded-xl bg-[#8AB4F8] text-[#101114] text-[14px] font-semibold hover:bg-[#8AB4F8]/90 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Studying Topic</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  type="button"
                  onClick={resumeStudyTimer}
                  className="py-2.5 px-3 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold hover:bg-[#8AB4F8]/90 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pauseStudyTimer}
                  className="py-2.5 px-3 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold hover:bg-[#8AB4F8]/90 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              <button
                type="button"
                onClick={startStudyBreak}
                className="py-2.5 px-3 rounded-xl bg-[#252830] border border-white/[0.08] text-[#E3E2E6] text-[13px] font-medium hover:bg-[#2e323e] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                title="Break time does not count toward focused study time"
              >
                <Coffee className="w-4 h-4 text-[#A78BFA]" />
                <span>+5m Rest</span>
              </button>

              <button
                type="button"
                onClick={() => endStudyTimer()}
                className="py-2.5 px-3 rounded-xl bg-[#252830] border border-white/[0.08] text-[#E3E2E6] text-[13px] font-medium hover:bg-[#2e323e] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-[#A5A8B0]" />
                <span>End</span>
              </button>
            </>
          )}
        </div>

        {/* TOPIC COMPLETE & EXAM READY BUTTON */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleCompleteTopic}
            className={`w-full py-3 px-4 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              topic.status === 'completed'
                ? 'bg-[#72C99A] text-[#101114]'
                : 'bg-[#72C99A]/20 border border-[#72C99A]/40 text-[#72C99A] hover:bg-[#72C99A]/30'
            }`}
          >
            <CheckCircle className="w-4 h-4 stroke-[2.5]" />
            <span>
              {topic.status === 'completed'
                ? 'Topic Completed & Exam Ready (Tap to Revise)'
                : 'Topic Complete & Exam Ready'}
            </span>
          </button>
          <p className="text-[10px] text-[#A5A8B0] mt-2">
            Session automatically syncs to Pomodoro & Semester Log.
          </p>
        </div>
      </div>

      {/* TOPIC TIME STATS WELL */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#1B1D22] p-3 rounded-xl border border-white/[0.06]">
          <div className="text-[10px] text-[#A5A8B0] font-semibold uppercase">
            Today's Topic Time
          </div>
          <div className="text-[16px] font-bold text-[#8AB4F8] tabular-nums mt-0.5">
            {formatHoursMins(todaySeconds)}
          </div>
        </div>

        <div className="bg-[#1B1D22] p-3 rounded-xl border border-white/[0.06]">
          <div className="text-[10px] text-[#A5A8B0] font-semibold uppercase">
            Total Topic Study Time
          </div>
          <div className="text-[16px] font-bold text-[#72C99A] tabular-nums mt-0.5">
            {formatHoursMins(totalSeconds)}
          </div>
        </div>
      </div>

      {/* CORE CONCEPT OVERVIEW */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
              Core Concept Overview
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#8AB4F8]/15 text-[#8AB4F8] text-[10px] font-semibold">
              High Yield
            </span>
            <button
              type="button"
              onClick={() => {
                setOverviewDraft(topic.overview);
                setIsEditingOverview(!isEditingOverview);
              }}
              className="p-1 text-[#A5A8B0] hover:text-white"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isEditingOverview ? (
          <div className="space-y-2 mt-2">
            <textarea
              rows={4}
              value={overviewDraft}
              onChange={e => setOverviewDraft(e.target.value)}
              className="w-full p-2.5 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingOverview(false)}
                className="px-3 py-1 rounded-lg text-[11px] text-[#A5A8B0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOverview}
                className="px-3 py-1 rounded-lg bg-[#8AB4F8] text-[#101114] text-[11px] font-semibold"
              >
                Save Notes
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-[#C3C6D1] leading-relaxed">
            {topic.overview || 'No concept summary added yet. Tap edit to write key explanations.'}
          </p>
        )}
      </div>

      {/* FORMULAS & SAFETY CRITERIA */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
              Formulas & Safety Criteria
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setIsFormulaModalOpen(true)}
            className="flex items-center gap-1 text-[11px] text-[#8AB4F8] hover:underline font-medium"
          >
            <Plus className="w-3 h-3" />
            <span>Add Formula</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {topic.formulas.length === 0 ? (
            <div className="p-3 bg-[#252830] rounded-xl text-[12px] text-[#A5A8B0] text-center">
              No formulas stored yet for this topic.
            </div>
          ) : (
            topic.formulas.map(formula => (
              <div
                key={formula.id}
                className="p-3 rounded-xl bg-[#252830] border border-white/[0.04]"
              >
                <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] uppercase font-semibold mb-1.5">
                  <span>{formula.title}</span>
                  {formula.note && (
                    <span className="text-[10px] text-[#8AB4F8] font-normal lowercase">
                      {formula.note}
                    </span>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-[#14161B] text-[#8AB4F8] font-mono text-[13px] tracking-wide overflow-x-auto text-center font-medium border border-white/5">
                  {formula.equation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* KEY TERMINOLOGY FLASHCHIPS */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#72C99A]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
              Key Terminology Flashchips
            </h4>
          </div>
          <span className="text-[10px] text-[#A5A8B0]">Tap to inspect</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.keywords.map((kw, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedTerm(kw)}
              className="px-3 py-1.5 rounded-full bg-[#252830] border border-white/10 text-[#E3E2E6] text-[12px] font-medium hover:border-[#8AB4F8] hover:text-[#8AB4F8] transition-colors"
            >
              • {kw}
            </button>
          ))}
        </div>

        {/* Selected Term Inspector */}
        {selectedTerm && (
          <div className="mt-3 p-3 rounded-xl bg-[#252830] border border-[#8AB4F8]/30 animate-in fade-in">
            <div className="flex items-center justify-between text-[12px] font-semibold text-[#8AB4F8] mb-1">
              <span>Term: {selectedTerm}</span>
              <button
                type="button"
                onClick={() => setSelectedTerm(null)}
                className="text-xs text-[#A5A8B0] hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-[11px] text-[#C3C6D1] leading-relaxed">
              High-yield examination keyword. Be prepared to define this explicitly in 2-mark and
              5-mark theory prompts.
            </p>
          </div>
        )}
      </div>

      {/* STUDY ATTACHMENTS & NOTES */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-[#8AB4F8]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
              Study Attachments & Notes ({topic.attachments.length} files)
            </h4>
          </div>
        </div>

        <div className="space-y-2">
          {topic.attachments.map(att => (
            <div
              key={att.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#252830] border border-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1B1D22] flex items-center justify-center text-[#8AB4F8] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#F5F5F5] leading-tight">
                    {att.title}
                  </div>
                  <div className="text-[11px] text-[#A5A8B0] mt-0.5">
                    {att.size} • {att.summary || 'Summary note'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewAttachment(att)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[#E3E2E6] text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3 h-3 text-[#8AB4F8]" />
                <span>View</span>
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setIsAttachmentModalOpen(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-white/10 hover:border-[#8AB4F8]/40 text-[#8AB4F8] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Attach Diagram, Screenshot, or PDF</span>
          </button>
        </div>
      </div>

      {/* PREDICTED END-SEM QUESTIONS */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F28B82]" />
            <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
              Predicted End-Sem Questions
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setIsQuestionModalOpen(true)}
            className="flex items-center gap-1 text-[11px] text-[#8AB4F8] hover:underline font-medium"
          >
            <Plus className="w-3 h-3" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-2">
          {topic.questions.map(q => {
            const isOpen = expandedQuestionId === q.id;
            return (
              <div
                key={q.id}
                className="p-3 rounded-xl bg-[#252830] border border-white/[0.04]"
              >
                <div
                  onClick={() => setExpandedQuestionId(isOpen ? null : q.id)}
                  className="flex items-start justify-between cursor-pointer select-none gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-[#A5A8B0] mb-1">
                      <span className="text-[#8AB4F8] font-semibold">{q.examPaper}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#F28B82]/20 text-[#F28B82] font-semibold">
                        {q.marks}
                      </span>
                    </div>
                    <div className="text-[13px] font-medium text-[#F5F5F5] leading-snug">
                      {q.title}
                    </div>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#A5A8B0] shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#A5A8B0] shrink-0 mt-1" />
                  )}
                </div>

                {isOpen && (
                  <div className="mt-2.5 pt-2 border-t border-white/[0.05] text-[12px] text-[#C3C6D1] leading-relaxed">
                    <div className="text-[11px] font-semibold text-[#72C99A] mb-1">
                      Key Exam Approach:
                    </div>
                    {q.answer ||
                      'State definitions, state matrices (Allocation, Max, Available, Need), trace each step, and conclude with the safe sequence and resource state.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TOPIC STUDY SESSIONS HISTORY */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
        <h4 className="text-[14px] font-semibold text-[#F5F5F5] mb-2.5">
          Topic Study Session Logs
        </h4>
        {sessions.filter(s => s.topicId === topic.id).length === 0 ? (
          <div className="text-[12px] text-[#A5A8B0] py-3 text-center">
            No study sessions logged yet for this topic. Use the timer above to log your hours.
          </div>
        ) : (
          <div className="space-y-2">
            {sessions
              .filter(s => s.topicId === topic.id)
              .map(sess => (
                <div
                  key={sess.id}
                  className="p-2.5 rounded-xl bg-[#252830] border border-white/[0.04] flex items-center justify-between text-[12px]"
                >
                  <div>
                    <div className="text-white font-medium">
                      {sess.notes || `${Math.round(sess.focusDurationSeconds / 60)}m Focus Block`}
                    </div>
                    <div className="text-[10px] text-[#A5A8B0] mt-0.5">
                      {new Date(sess.startTime).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}{' '}
                      •{' '}
                      {new Date(sess.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#8AB4F8] font-semibold">
                      {Math.round(sess.focusDurationSeconds / 60)}m Focus
                    </span>
                    {sess.breakDurationSeconds > 0 && (
                      <span className="text-[10px] text-[#A5A8B0] block">
                        {Math.round(sess.breakDurationSeconds / 60)}m Break
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Formula Add Modal */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-4 w-full max-w-sm shadow-2xl animate-in fade-in">
            <h3 className="text-[15px] font-semibold text-white mb-3">Add Formula / Theorem</h3>
            <form onSubmit={handleAddFormula} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  Formula Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Need Matrix Equation"
                  value={formulaTitle}
                  onChange={e => setFormulaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  Equation (Text / Monospace)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Need[i][j] = Max[i][j] - Allocation[i][j]"
                  value={formulaEquation}
                  onChange={e => setFormulaEquation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] font-mono focus:outline-none focus:border-[#8AB4F8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-[12px] text-[#A5A8B0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#8AB4F8] text-[#101114] text-[12px] font-semibold"
                >
                  Add Formula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Add Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-4 w-full max-w-sm shadow-2xl animate-in fade-in">
            <h3 className="text-[15px] font-semibold text-white mb-3">Add Predicted Question</h3>
            <form onSubmit={handleAddQuestion} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  Question Prompt
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Explain Banker's Algorithm with a 5-process scenario."
                  value={questionTitle}
                  onChange={e => setQuestionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                    Marks Weight
                  </label>
                  <input
                    type="text"
                    value={questionMarks}
                    onChange={e => setQuestionMarks(e.target.value)}
                    className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                    Exam Tag
                  </label>
                  <input
                    type="text"
                    value={questionPaper}
                    onChange={e => setQuestionPaper(e.target.value)}
                    className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-[12px] text-[#A5A8B0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#8AB4F8] text-[#101114] text-[12px] font-semibold"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attachment Modal */}
      {isAttachmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-4 w-full max-w-sm shadow-2xl animate-in fade-in">
            <h3 className="text-[15px] font-semibold text-white mb-3">Attach File / Reference</h3>
            <form onSubmit={handleAddAttachment} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  File Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State_Transition_Diagram.png"
                  value={attachmentTitle}
                  onChange={e => setAttachmentTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  Type
                </label>
                <select
                  value={attachmentType}
                  onChange={e => setAttachmentType(e.target.value as 'diagram' | 'pdf' | 'notes')}
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                >
                  <option value="diagram">Diagram / Flowchart</option>
                  <option value="pdf">PDF Cheat Sheet</option>
                  <option value="notes">Summary Notes</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAttachmentModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-[12px] text-[#A5A8B0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#8AB4F8] text-[#101114] text-[12px] font-semibold"
                >
                  Attach File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 w-full max-w-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#8AB4F8]/10 text-[#8AB4F8] flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-semibold text-white">{previewAttachment.title}</h3>
            <p className="text-[12px] text-[#A5A8B0] mt-1 mb-4">
              {previewAttachment.summary || 'Study attachment file'} • {previewAttachment.size}
            </p>
            <div className="p-4 bg-[#252830] rounded-xl text-left text-[12px] text-[#C3C6D1] mb-4 border border-white/5 font-mono">
              [Document Preview Ready: High-yield reference diagram content verified for Semester 3
              examinations.]
            </div>
            <button
              type="button"
              onClick={() => setPreviewAttachment(null)}
              className="w-full py-2.5 rounded-xl bg-[#8AB4F8] text-[#101114] font-semibold text-[13px]"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
