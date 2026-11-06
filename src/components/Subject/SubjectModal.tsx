import React, { useState, useEffect } from 'react';
import { Subject } from '../../types';
import { BookOpen, Calendar, Clock, MapPin, X } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  subject?: Subject | null;
  onClose: () => void;
  onSave: (data: Omit<Subject, 'id' | 'units'>) => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  subject,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('CORE THEORY');
  const [examDate, setExamDate] = useState('2026-11-13');
  const [examTime, setExamTime] = useState('09:30 AM – 12:30 PM');
  const [hall, setHall] = useState('Hall 4B');
  const [accentColor, setAccentColor] = useState('#8AB4F8');

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setCode(subject.code);
      setCategory(subject.category);
      setExamDate(subject.examDate);
      setExamTime(subject.examTime);
      setHall(subject.hall);
      setAccentColor(subject.accentColor || '#8AB4F8');
    } else {
      setName('');
      setCode('');
      setCategory('CORE THEORY');
      setExamDate('2026-11-13');
      setExamTime('09:30 AM – 12:30 PM');
      setHall('Hall 4B');
      setAccentColor('#8AB4F8');
    }
  }, [subject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    onSave({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      category: category.trim().toUpperCase(),
      examDate,
      examTime,
      hall,
      accentColor
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#8AB4F8]" />
            <h3 className="text-[16px] font-semibold text-white">
              {subject ? 'Edit Subject' : 'Add New Subject'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A5A8B0] hover:text-white hover:bg-white/[0.05]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Subject Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Probability and Statistics"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                Subject Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MA301"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] uppercase focus:outline-none focus:border-[#8AB4F8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. CORE THEORY"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] uppercase focus:outline-none focus:border-[#8AB4F8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                Exam Date
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                Hall / Room
              </label>
              <input
                type="text"
                placeholder="e.g. Hall 4B"
                value={hall}
                onChange={e => setHall(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Exam Slot / Timing
            </label>
            <input
              type="text"
              placeholder="e.g. 09:30 AM – 12:30 PM"
              value={examTime}
              onChange={e => setExamTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-[#A5A8B0] hover:text-white bg-[#252830] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold hover:bg-[#8AB4F8]/90 transition-all active:scale-95"
            >
              {subject ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
