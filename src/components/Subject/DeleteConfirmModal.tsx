import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 text-[#F28B82] mb-3">
          <div className="w-10 h-10 rounded-full bg-[#F28B82]/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#F28B82]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white leading-tight">{title}</h3>
            <span className="text-[11px] text-[#A5A8B0]">Confirm deletion</span>
          </div>
        </div>

        <p className="text-[13px] text-[#C3C6D1] leading-relaxed mb-4">{message}</p>

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-[13px] font-medium text-[#A5A8B0] hover:text-white bg-[#252830] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#F28B82] text-[#101114] text-[13px] font-semibold hover:bg-[#F28B82]/90 transition-all active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
