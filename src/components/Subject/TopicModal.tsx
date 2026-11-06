import React, { useState, useEffect } from 'react';
import { Topic, TopicStatus } from '../../types';
import { FileText, X } from 'lucide-react';

interface TopicModalProps {
  isOpen: boolean;
  topic?: Topic | null;
  onClose: () => void;
  onSave: (data: Partial<Topic>) => void;
}

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  topic,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [topicNumber, setTopicNumber] = useState('1.1');
  const [status, setStatus] = useState<TopicStatus>('not-started');
  const [estimatedWeight, setEstimatedWeight] = useState('8 Marks');
  const [overview, setOverview] = useState('');
  const [keywordsText, setKeywordsText] = useState('');

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
      setTopicNumber(topic.topicNumber);
      setStatus(topic.status);
      setEstimatedWeight(topic.estimatedWeight);
      setOverview(topic.overview);
      setKeywordsText(topic.keywords.join(', '));
    } else {
      setTitle('');
      setTopicNumber('1.1');
      setStatus('not-started');
      setEstimatedWeight('8 Marks');
      setOverview('');
      setKeywordsText('');
    }
  }, [topic, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const keywords = keywordsText
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    onSave({
      title: title.trim(),
      topicNumber: topicNumber.trim(),
      status,
      estimatedWeight: estimatedWeight.trim(),
      overview: overview.trim(),
      keywords
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#8AB4F8]" />
            <h3 className="text-[15px] font-semibold text-white">
              {topic ? 'Edit Topic' : 'Add New Topic'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#A5A8B0] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 3.4"
                value={topicNumber}
                onChange={e => setTopicNumber(e.target.value)}
                className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                Estimated Exam Weight
              </label>
              <input
                type="text"
                placeholder="e.g. 10 Marks (High Yield)"
                value={estimatedWeight}
                onChange={e => setEstimatedWeight(e.target.value)}
                className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Topic Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Banker's Algorithm & Resource Allocation"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Preparation Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as TopicStatus)}
              className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            >
              <option value="not-started">Not Started</option>
              <option value="learning">Learning</option>
              <option value="completed">Completed</option>
              <option value="revision">Revision Phase</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Core Concept Overview
            </label>
            <textarea
              rows={3}
              placeholder="Summary notes, explanations, or key principles..."
              value={overview}
              onChange={e => setOverview(e.target.value)}
              className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Key Terminology / Flashchips (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Safe State, Resource Request, Avoidance"
              value={keywordsText}
              onChange={e => setKeywordsText(e.target.value)}
              className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-[#A5A8B0] hover:text-white bg-[#252830]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold disabled:opacity-50"
            >
              Save Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
