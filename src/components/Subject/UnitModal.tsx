import React, { useState, useEffect } from 'react';
import { Layers, X } from 'lucide-react';

interface UnitModalProps {
  isOpen: boolean;
  unitTitle?: string;
  unitNumber?: number;
  onClose: () => void;
  onSave: (title: string) => void;
}

export const UnitModal: React.FC<UnitModalProps> = ({
  isOpen,
  unitTitle = '',
  unitNumber,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(unitTitle || '');
  }, [unitTitle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8AB4F8]" />
            <h3 className="text-[15px] font-semibold text-white">
              {unitTitle ? 'Edit Unit' : `Add Unit ${unitNumber ? unitNumber : ''}`}
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
          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Unit Name / Topic Theme
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Memory & Virtual Management"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
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
              Save Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
