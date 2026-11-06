import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Check, Clock, AlertCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Task } from '../../types';

export const TodayQueueSection: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, subjects } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newTopicId, setNewTopicId] = useState('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('normal');
  const [newDueTime, setNewDueTime] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;
  const remainingCount = tasks.length - completedCount;
  const executionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Selected subject's topics for the dropdown
  const selectedSubj = subjects.find(s => s.id === newSubjectId);
  const allSubjTopics: { id: string; title: string; unitTitle: string }[] = [];
  if (selectedSubj) {
    selectedSubj.units.forEach(u => {
      u.topics.forEach(t => {
        allSubjTopics.push({ id: t.id, title: t.title, unitTitle: u.title });
      });
    });
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let subName = '';
    let unitName = '';
    if (selectedSubj) {
      subName = selectedSubj.name;
      for (const u of selectedSubj.units) {
        const top = u.topics.find(t => t.id === newTopicId);
        if (top) {
          unitName = `${u.title} • ${top.title}`;
          break;
        }
      }
    }

    addTask({
      title: newTitle.trim(),
      subjectId: newSubjectId,
      topicId: newTopicId || undefined,
      subjectName: subName || undefined,
      unitName: unitName || undefined,
      priority: newPriority,
      dueDate: '2026-11-05',
      dueTime: newDueTime || undefined,
      completed: false
    });

    setNewTitle('');
    setNewDueTime('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
          <h4 className="text-[14px] font-semibold text-[#F5F5F5]">
            Today's Study Queue{' '}
            <span className="text-[#A5A8B0] font-normal text-[12px]">
              ({remainingCount} left)
            </span>
          </h4>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-[#A5A8B0]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#A5A8B0]" />
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 text-[12px] text-[#8AB4F8] hover:text-[#8AB4F8]/80 font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-3">
          {/* Day Execution Rate Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[#A5A8B0]">Day Execution Rate</span>
              <span className="text-[#F5F5F5] font-semibold tabular-nums">{executionRate}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#252830] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8AB4F8] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, executionRate))}%` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-[12px] text-[#A5A8B0]">
                No tasks queued. Add your first study goal for today!
              </div>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  className={`group p-3 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-[#1e2026]/60 border-white/[0.03] opacity-65'
                      : 'bg-[#252830] border-white/[0.05] hover:border-white/[0.1]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-[#72C99A] text-[#101114]'
                          : 'border-2 border-white/20 hover:border-[#8AB4F8]'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[13px] font-medium leading-snug truncate ${
                            task.completed
                              ? 'line-through text-[#A5A8B0]'
                              : 'text-[#F5F5F5]'
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Priority / Time Tags */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {task.priority === 'urgent' && !task.completed && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F28B82]/20 text-[#F28B82] border border-[#F28B82]/30">
                              Urgent
                            </span>
                          )}
                          {task.priority === 'high' && !task.completed && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F4C16B]/20 text-[#F4C16B]">
                              High
                            </span>
                          )}
                          {task.dueTime && !task.completed && (
                            <span className="text-[10px] text-[#A5A8B0]">
                              {task.dueTime}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtitle / Unit info */}
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-[#A5A8B0] truncate">
                          {task.completed
                            ? task.completedAt
                              ? `Completed at ${new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                              : 'Completed'
                            : task.isCarryForward
                            ? "From yesterday's queue"
                            : task.unitName || task.subjectName || 'Study Target'}
                        </span>

                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#A5A8B0] hover:text-[#F28B82] p-0.5 transition-opacity"
                          title="Delete task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-4 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-[15px] font-semibold text-white mb-3">Add Study Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solve 5 problems on Bayes theorem"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] placeholder:text-[#A5A8B0]/50 focus:outline-none focus:border-[#8AB4F8]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  Subject
                </label>
                <select
                  value={newSubjectId}
                  onChange={e => {
                    setNewSubjectId(e.target.value);
                    setNewTopicId('');
                  }}
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {allSubjTopics.length > 0 && (
                <div>
                  <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                    Related Topic (Optional)
                  </label>
                  <select
                    value={newTopicId}
                    onChange={e => setNewTopicId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                  >
                    <option value="">General Subject Practice</option>
                    {allSubjTopics.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as Task['priority'])}
                    className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                    Due Time (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6:00 PM"
                    value={newDueTime}
                    onChange={e => setNewDueTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] placeholder:text-[#A5A8B0]/50 focus:outline-none focus:border-[#8AB4F8]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-[12px] text-[#A5A8B0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#8AB4F8] text-[#101114] text-[12px] font-semibold disabled:opacity-50"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
