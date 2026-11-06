import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Utensils, Coffee, Bed, Edit3, Check, Clock } from 'lucide-react';
import { DailyRhythmItem } from '../../types';

export const DailyRhythmCard: React.FC = () => {
  const { dailyRhythm, updateRhythmItem } = useApp();
  const [editingItem, setEditingItem] = useState<DailyRhythmItem | null>(null);

  const getIcon = (category: string) => {
    switch (category) {
      case 'sleep':
        return <Moon className="w-4 h-4 text-[#72C99A]" />;
      case 'nutrition':
        return <Utensils className="w-4 h-4 text-[#8AB4F8]" />;
      case 'break':
        return <Coffee className="w-4 h-4 text-[#A78BFA]" />;
      case 'winddown':
      default:
        return <Bed className="w-4 h-4 text-[#A5A8B0]" />;
    }
  };

  const getStatusBadge = (item: DailyRhythmItem) => {
    switch (item.status) {
      case 'logged':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#72C99A]/15 text-[#72C99A] text-[11px] font-semibold border border-[#72C99A]/20">
            Logged
          </span>
        );
      case 'complete':
        return (
          <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[#E3E2E6] text-[11px] font-medium">
            Complete
          </span>
        );
      case 'log_now':
        return (
          <button
            type="button"
            onClick={() =>
              updateRhythmItem(item.id, {
                status: 'logged',
                actualTime: 'Logged just now'
              })
            }
            className="px-2.5 py-1 rounded-full bg-[#8AB4F8]/15 border border-[#8AB4F8]/30 text-[#8AB4F8] text-[11px] font-semibold hover:bg-[#8AB4F8]/25 transition-all active:scale-95"
          >
            Log Now
          </button>
        );
      case 'upcoming':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] text-[#A5A8B0] text-[11px] font-medium">
            Upcoming
          </span>
        );
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateRhythmItem(editingItem.id, editingItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A5A8B0]" />
          <h4 className="text-[14px] font-semibold text-[#F5F5F5]">Daily Academic Rhythm</h4>
        </div>
        <button
          type="button"
          onClick={() => setEditingItem(dailyRhythm[0] || null)}
          className="flex items-center gap-1 text-[11px] text-[#8AB4F8] hover:text-[#8AB4F8]/80 transition-colors font-medium"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit Plan</span>
        </button>
      </div>

      <div className="space-y-2">
        {dailyRhythm.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#252830] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1B1D22] flex items-center justify-center shrink-0">
                {getIcon(item.category)}
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#F5F5F5] leading-tight">
                  {item.title}
                </div>
                <div className="text-[11px] text-[#A5A8B0] mt-0.5">
                  {item.plannedTime} {item.detail ? `(${item.detail})` : ''}
                </div>
              </div>
            </div>

            <div>{getStatusBadge(item)}</div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-4 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-[15px] font-semibold text-white mb-3">
              Edit Rhythm: {editingItem.title}
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  Planned Window
                </label>
                <input
                  type="text"
                  value={editingItem.plannedTime}
                  onChange={e =>
                    setEditingItem({ ...editingItem, plannedTime: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#A5A8B0] uppercase block mb-1">
                  Status
                </label>
                <select
                  value={editingItem.status}
                  onChange={e =>
                    setEditingItem({
                      ...editingItem,
                      status: e.target.value as DailyRhythmItem['status']
                    })
                  }
                  className="w-full px-3 py-2 bg-[#252830] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:border-[#8AB4F8]"
                >
                  <option value="logged">Logged</option>
                  <option value="complete">Complete</option>
                  <option value="log_now">Log Now</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded-lg text-[12px] text-[#A5A8B0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#8AB4F8] text-[#101114] text-[12px] font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
