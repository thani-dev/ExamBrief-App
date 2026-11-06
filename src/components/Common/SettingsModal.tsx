import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Target
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    profile,
    updateProfile,
    exportBackupJSON,
    importBackupJSON,
    resetToDefaults,
    subjects,
    sessions,
    tasks
  } = useApp();

  const [name, setName] = useState(profile.name);
  const [semester, setSemester] = useState(profile.semester);
  const [dailyTargetHours, setDailyTargetHours] = useState(profile.dailyTargetHours || 5.0);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(
    null
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSettingsOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      semester: semester.trim(),
      dailyTargetHours: Number(dailyTargetHours)
    });
    setIsSettingsOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = importBackupJSON(content);
      if (res.success) {
        setImportStatus({
          success: true,
          message: 'Backup restored successfully! All subjects and logs are synchronized.'
        });
        setTimeout(() => {
          setIsSettingsOpen(false);
        }, 1200);
      } else {
        setImportStatus({
          success: false,
          message: res.error || 'Failed to restore backup.'
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#8AB4F8]" />
            <h3 className="text-[16px] font-semibold text-white">Profile &amp; Settings</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A5A8B0] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Your Name / Alias
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Semester &amp; Branch
            </label>
            <input
              type="text"
              required
              value={semester}
              onChange={e => setSemester(e.target.value)}
              className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
              Daily Study Target (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="16"
              required
              value={dailyTargetHours}
              onChange={e => setDailyTargetHours(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold hover:bg-[#8AB4F8]/90 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

        {/* Offline Storage Status & Backup section */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#72C99A]">
            <ShieldCheck className="w-4 h-4" />
            <span>Offline-First Persistent Storage Active</span>
          </div>

          <p className="text-[11px] text-[#A5A8B0] leading-relaxed">
            All data persists locally in your browser storage ({subjects.length} subjects,{' '}
            {tasks.length} tasks, {sessions.length} study logs). You can export and import JSON
            backups at any time.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={exportBackupJSON}
              className="py-2.5 px-3 rounded-xl bg-[#252830] border border-white/10 hover:border-white/20 text-[#8AB4F8] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 rounded-xl bg-[#252830] border border-white/10 hover:border-white/20 text-[#72C99A] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {importStatus && (
            <div
              className={`p-2.5 rounded-xl text-[11px] flex items-center gap-2 ${
                importStatus.success
                  ? 'bg-[#72C99A]/15 text-[#72C99A] border border-[#72C99A]/30'
                  : 'bg-[#F28B82]/15 text-[#F28B82] border border-[#F28B82]/30'
              }`}
            >
              {importStatus.success ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Reset to Default */}
          <div className="pt-2">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 text-[11px] text-[#A5A8B0] hover:text-[#F28B82] transition-colors"
              >
                Reset to Default Nov 2026 Examination Data
              </button>
            ) : (
              <div className="p-3 bg-[#F28B82]/10 border border-[#F28B82]/30 rounded-xl space-y-2">
                <div className="text-[11px] text-[#F28B82] font-semibold">
                  Reset everything back to default 3rd semester exam syllabus?
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetToDefaults();
                      setConfirmReset(false);
                      setIsSettingsOpen(false);
                    }}
                    className="flex-1 py-1.5 bg-[#F28B82] text-[#101114] text-[11px] font-bold rounded-lg"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 bg-[#252830] text-[#A5A8B0] text-[11px] rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
