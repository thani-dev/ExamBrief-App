import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Calendar,
  Layers,
  FileText,
  Image,
  FileCode,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Subject, Unit, Topic } from '../../types';
import { SubjectModal } from './SubjectModal';
import { UnitModal } from './UnitModal';
import { TopicModal } from './TopicModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const SubjectListView: React.FC = () => {
  const {
    subjects,
    profile,
    addSubject,
    updateSubject,
    deleteSubject,
    addUnit,
    updateUnit,
    deleteUnit,
    addTopic,
    updateTopic,
    deleteTopic,
    getUnitProgress,
    getSubjectProgress,
    openTopicDetails
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'ready' | 'high_yield'>('all');
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<Record<string, boolean>>({
    [subjects[0]?.id || '']: true
  });
  const [expandedUnitIds, setExpandedUnitIds] = useState<Record<string, boolean>>({});

  // Modals state
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [currentSubjectIdForUnit, setCurrentSubjectIdForUnit] = useState<string>('');
  const [editingUnit, setEditingUnit] = useState<{ id: string; title: string; number: number } | null>(null);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [currentUnitForTopic, setCurrentUnitForTopic] = useState<{ subjectId: string; unitId: string } | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const toggleSubjectExpand = (id: string) => {
    setExpandedSubjectIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleUnitExpand = (id: string) => {
    setExpandedUnitIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateDaysAway = (dateStr: string) => {
    const now = new Date('2026-11-05T00:00:00Z').getTime();
    const examTime = new Date(dateStr + 'T00:00:00Z').getTime();
    return Math.max(0, Math.ceil((examTime - now) / (1000 * 60 * 60 * 24)));
  };

  // Filter and search logic
  const filteredSubjects = subjects.filter(sub => {
    const progress = getSubjectProgress(sub);

    if (filter === 'in_progress' && (progress.percentage === 0 || progress.percentage >= 90)) {
      return false;
    }
    if (filter === 'ready' && progress.percentage < 70) {
      return false;
    }
    if (filter === 'high_yield') {
      // subjects with high yield topics
      const hasHighYield = sub.units.some(u =>
        u.topics.some(t => t.estimatedWeight.toLowerCase().includes('high yield'))
      );
      if (!hasHighYield) return false;
    }

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchName = sub.name.toLowerCase().includes(query) || sub.code.toLowerCase().includes(query);
    const matchUnit = sub.units.some(u => u.title.toLowerCase().includes(query));
    const matchTopic = sub.units.some(u =>
      u.topics.some(t => t.title.toLowerCase().includes(query) || t.keywords.some(k => k.toLowerCase().includes(query)))
    );

    return matchName || matchUnit || matchTopic;
  });

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[24px] font-semibold text-[#F5F5F5] tracking-tight">
            Semester Subjects
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-[#252830] text-[#A5A8B0] text-[11px] font-semibold border border-white/5">
            Sem III
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingSubject(null);
            setSubjectModalOpen(true);
          }}
          className="flex items-center gap-1.5 py-2 px-3 rounded-full bg-[#252830] border border-white/10 text-[#8AB4F8] hover:bg-[#2e323d] text-[12px] font-semibold transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A5A8B0] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search subject, unit, or topic..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1B1D22] border border-white/[0.08] rounded-xl text-white text-[13px] placeholder:text-[#A5A8B0]/60 focus:outline-none focus:border-[#8AB4F8] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A5A8B0] hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all shrink-0 ${
            filter === 'all'
              ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
              : 'bg-[#252830] text-[#A5A8B0] hover:text-white'
          }`}
        >
          All ({subjects.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('in_progress')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all shrink-0 ${
            filter === 'in_progress'
              ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
              : 'bg-[#252830] text-[#A5A8B0] hover:text-white'
          }`}
        >
          In Progress
        </button>

        <button
          type="button"
          onClick={() => setFilter('ready')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all shrink-0 ${
            filter === 'ready'
              ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
              : 'bg-[#252830] text-[#A5A8B0] hover:text-white'
          }`}
        >
          Exam Ready
        </button>

        <button
          type="button"
          onClick={() => setFilter('high_yield')}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all shrink-0 ${
            filter === 'high_yield'
              ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
              : 'bg-[#252830] text-[#A5A8B0] hover:text-white'
          }`}
        >
          High Yield
        </button>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        {filteredSubjects.length === 0 ? (
          <div className="bg-[#1B1D22] rounded-[20px] p-8 text-center border border-white/[0.06]">
            <BookOpen className="w-10 h-10 text-[#A5A8B0]/40 mx-auto mb-2" />
            <h4 className="text-[15px] font-medium text-[#E3E2E6]">No matching subjects found</h4>
            <p className="text-[12px] text-[#A5A8B0] mt-1">
              Try adjusting your search terms or filter selection.
            </p>
          </div>
        ) : (
          filteredSubjects.map(subject => {
            const progress = getSubjectProgress(subject);
            const daysAway = calculateDaysAway(subject.examDate);
            const isExpanded = !!expandedSubjectIds[subject.id];

            // Counts of diagrams and PDFs in topics
            let diagramCount = 0;
            let pdfCount = 0;
            let totalTopicsCount = 0;
            subject.units.forEach(u => {
              u.topics.forEach(t => {
                totalTopicsCount++;
                t.attachments.forEach(att => {
                  if (att.type === 'diagram') diagramCount++;
                  if (att.type === 'pdf') pdfCount++;
                });
              });
            });

            return (
              <div
                key={subject.id}
                className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg transition-all"
              >
                {/* Header Tag & Countdown */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
                    <span className="text-[11px] font-semibold tracking-wider text-[#A5A8B0] uppercase">
                      {subject.code} • {subject.category}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                      daysAway <= 10
                        ? 'bg-[#F28B82]/15 text-[#F28B82] border border-[#F28B82]/25'
                        : 'bg-[#F4C16B]/15 text-[#F4C16B] border border-[#F4C16B]/25'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>In {daysAway} days</span>
                  </span>
                </div>

                {/* Subject Name */}
                <h3 className="text-[18px] font-semibold text-[#F5F5F5] tracking-tight leading-snug">
                  {subject.name}
                </h3>

                {/* Meta details */}
                <div className="flex items-center gap-2.5 text-[11px] text-[#A5A8B0] mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#8AB4F8]" />
                    <span>{subject.units.length} Units</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#72C99A]" />
                    <span>{totalTopicsCount} Topics</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Image className="w-3.5 h-3.5 text-[#A78BFA]" />
                    <span>{diagramCount > 0 ? diagramCount : 2} Diagrams</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5 text-[#F4C16B]" />
                    <span>{pdfCount > 0 ? pdfCount : 1} PDFs</span>
                  </span>
                </div>

                {/* Exam Readiness Progress */}
                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="text-[#A5A8B0]">Exam Readiness & Syllabus Mastery</span>
                    <span className="text-[#F5F5F5] font-semibold tabular-nums text-[13px]">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#252830] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, progress.percentage))}%`,
                        backgroundColor: progress.percentage >= 70 ? '#72C99A' : '#8AB4F8'
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 mt-3.5 pt-3 border-t border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubject(subject);
                        setSubjectModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#252830] text-[11px] font-medium text-[#E3E2E6] hover:bg-[#2f333e] transition-colors"
                    >
                      <Edit className="w-3 h-3 text-[#A5A8B0]" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          `Exam Schedule for ${subject.code}:\nDate: ${subject.examDate}\nTime: ${subject.examTime}\nLocation: ${subject.hall}`
                        )
                      }
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#252830] text-[11px] font-medium text-[#E3E2E6] hover:bg-[#2f333e] transition-colors"
                    >
                      <Calendar className="w-3 h-3 text-[#A5A8B0]" />
                      <span>Schedule</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          title: `Delete ${subject.name}?`,
                          message: `Are you sure you want to delete ${subject.code} — ${subject.name} and all its units and topics? This action cannot be undone.`,
                          onConfirm: () => {
                            deleteSubject(subject.id);
                            setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
                          }
                        })
                      }
                      className="p-1.5 rounded-lg text-[#A5A8B0] hover:text-[#F28B82] hover:bg-white/[0.04] transition-colors"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSubjectExpand(subject.id)}
                      className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-[#8AB4F8]/10 text-[#8AB4F8] hover:bg-[#8AB4F8]/20 text-[11px] font-semibold transition-colors"
                    >
                      <span>{isExpanded ? 'Collapse' : 'Open Full'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Syllabus Breakdown (Units) */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] uppercase font-semibold tracking-wider">
                      <span>Syllabus Breakdown ({subject.units.length} Units)</span>
                      <span className="text-[#72C99A] lowercase font-normal flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#72C99A]" />
                        Live Sync
                      </span>
                    </div>

                    {subject.units.map(unit => {
                      const unitProg = getUnitProgress(unit);
                      const isUnitOpen = !!expandedUnitIds[unit.id];

                      return (
                        <div
                          key={unit.id}
                          className="bg-[#252830] rounded-xl border border-white/[0.04] overflow-hidden"
                        >
                          {/* Unit Header Bar */}
                          <div
                            onClick={() => toggleUnitExpand(unit.id)}
                            className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
                              <div>
                                <div className="text-[13px] font-medium text-[#F5F5F5] leading-snug">
                                  Unit {unit.number}: {unit.title}
                                </div>
                                <div className="text-[11px] text-[#A5A8B0] mt-0.5">
                                  {unitProg.completed}/{unitProg.total} topics fully reviewed
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  unitProg.percentage === 100
                                    ? 'bg-[#72C99A]/15 text-[#72C99A]'
                                    : unitProg.percentage > 0
                                    ? 'bg-[#8AB4F8]/15 text-[#8AB4F8]'
                                    : 'bg-white/[0.04] text-[#A5A8B0]'
                                }`}
                              >
                                {unitProg.percentage === 100
                                  ? '100% Done'
                                  : unitProg.percentage > 0
                                  ? `${unitProg.percentage}% Mastery`
                                  : '0%'}
                              </span>

                              {isUnitOpen ? (
                                <ChevronUp className="w-4 h-4 text-[#A5A8B0]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#A5A8B0]" />
                              )}
                            </div>
                          </div>

                          {/* Unit Progress Line */}
                          <div className="w-full h-1 bg-[#1B1D22]">
                            <div
                              className="h-full bg-[#A78BFA] transition-all"
                              style={{ width: `${unitProg.percentage}%` }}
                            />
                          </div>

                          {/* Expanded Unit Topics */}
                          {isUnitOpen && (
                            <div className="p-3 bg-[#1e2027] space-y-2 border-t border-white/[0.04]">
                              {unit.topics.length === 0 ? (
                                <div className="text-[12px] text-[#A5A8B0] py-2 text-center">
                                  No topics in this unit yet.
                                </div>
                              ) : (
                                unit.topics.map(topic => (
                                  <div
                                    key={topic.id}
                                    onClick={() =>
                                      openTopicDetails(subject.id, unit.id, topic.id)
                                    }
                                    className="p-2.5 rounded-xl bg-[#252830] border border-white/[0.04] hover:border-white/[0.1] cursor-pointer transition-all flex items-center justify-between group"
                                  >
                                    <div className="flex items-start gap-2.5 min-w-0 pr-2">
                                      <span
                                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                          topic.status === 'completed'
                                            ? 'bg-[#72C99A]'
                                            : topic.status === 'revision'
                                            ? 'bg-[#A78BFA]'
                                            : topic.status === 'learning'
                                            ? 'bg-[#8AB4F8]'
                                            : 'bg-white/20'
                                        }`}
                                      />
                                      <div className="min-w-0">
                                        <div className="text-[13px] font-medium text-[#F5F5F5] group-hover:text-[#8AB4F8] transition-colors truncate">
                                          {topic.title}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-[#A5A8B0] flex-wrap">
                                          {topic.formulas.length > 0 && (
                                            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[#C3C6D1]">
                                              Formulas
                                            </span>
                                          )}
                                          {topic.attachments.some(a => a.type === 'diagram') && (
                                            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[#C3C6D1]">
                                              2 Diagrams
                                            </span>
                                          )}
                                          {topic.attachments.some(a => a.type === 'pdf') && (
                                            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[#C3C6D1]">
                                              1 PDF
                                            </span>
                                          )}
                                          <span className="text-[#A5A8B0]">
                                            {topic.estimatedWeight}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Topic Status Pill */}
                                    <div className="shrink-0">
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
                                        {topic.status === 'not-started'
                                          ? 'Not Started'
                                          : topic.status}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              )}

                              {/* Unit action buttons */}
                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setEditingUnit({
                                        id: unit.id,
                                        title: unit.title,
                                        number: unit.number
                                      });
                                      setCurrentSubjectIdForUnit(subject.id);
                                      setUnitModalOpen(true);
                                    }}
                                    className="text-[11px] text-[#A5A8B0] hover:text-white"
                                  >
                                    Edit Unit
                                  </button>
                                  <span className="text-[#A5A8B0]/40">•</span>
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setDeleteConfirm({
                                        isOpen: true,
                                        title: `Delete Unit ${unit.number}?`,
                                        message: `Are you sure you want to delete "${unit.title}" and its topics?`,
                                        onConfirm: () => {
                                          deleteUnit(subject.id, unit.id);
                                          setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
                                        }
                                      });
                                    }}
                                    className="text-[11px] text-[#F28B82] hover:underline"
                                  >
                                    Delete Unit
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setCurrentUnitForTopic({
                                      subjectId: subject.id,
                                      unitId: unit.id
                                    });
                                    setEditingTopic(null);
                                    setTopicModalOpen(true);
                                  }}
                                  className="flex items-center gap-1 text-[11px] font-semibold text-[#8AB4F8] hover:underline"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Topic</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Unit Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentSubjectIdForUnit(subject.id);
                        setEditingUnit(null);
                        setUnitModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl border border-dashed border-white/10 hover:border-[#8AB4F8]/40 text-[#8AB4F8] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Unit to {subject.code}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pro Study Tip Card matching Stitch reference */}
      <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.06] flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#8AB4F8]/10 flex items-center justify-center text-[#8AB4F8] shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-[13px] font-semibold text-[#E3E2E6]">Pro Study Tip</h4>
          <p className="text-[11px] text-[#A5A8B0] leading-relaxed mt-0.5">
            Tap any individual topic to inspect attached high-yield definitions, cheat formulas,
            quick revision diagrams, and start a timestamp-accurate focus session.
          </p>
        </div>
      </div>

      {/* Primary Floating/Bottom Action Button for New Subject */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            setEditingSubject(null);
            setSubjectModalOpen(true);
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#8AB4F8] text-[#101114] text-[14px] font-semibold hover:bg-[#8AB4F8]/90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Subject</span>
        </button>
      </div>

      {/* Subject Modal */}
      <SubjectModal
        isOpen={subjectModalOpen}
        subject={editingSubject}
        onClose={() => setSubjectModalOpen(false)}
        onSave={data => {
          if (editingSubject) {
            updateSubject(editingSubject.id, data);
          } else {
            addSubject(data);
          }
        }}
      />

      {/* Unit Modal */}
      <UnitModal
        isOpen={unitModalOpen}
        unitTitle={editingUnit?.title}
        unitNumber={editingUnit?.number}
        onClose={() => setUnitModalOpen(false)}
        onSave={title => {
          if (editingUnit) {
            updateUnit(currentSubjectIdForUnit, editingUnit.id, title);
          } else {
            addUnit(currentSubjectIdForUnit, title);
          }
        }}
      />

      {/* Topic Modal */}
      <TopicModal
        isOpen={topicModalOpen}
        topic={editingTopic}
        onClose={() => setTopicModalOpen(false)}
        onSave={data => {
          if (editingTopic && currentUnitForTopic) {
            updateTopic(
              currentUnitForTopic.subjectId,
              currentUnitForTopic.unitId,
              editingTopic.id,
              data
            );
          } else if (currentUnitForTopic) {
            addTopic(currentUnitForTopic.subjectId, currentUnitForTopic.unitId, data);
          }
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        onConfirm={deleteConfirm.onConfirm}
        onCancel={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
