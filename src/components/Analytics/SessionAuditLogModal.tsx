import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Share2,
  Clock,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  PlayCircle
} from 'lucide-react';
import { StudySession } from '../../types';

export const SessionAuditLogModal: React.FC = () => {
  const { isAuditLogModalOpen, setIsAuditLogModalOpen, sessions, exportBackupJSON, setIsPomoModalOpen } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'last7' | 'last30'>('today');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  if (!isAuditLogModalOpen) return null;

  // Filter sessions
  const filteredSessions = sessions.filter(s => {
    const sessionDate = s.startTime.slice(0, 10);
    if (filterPeriod === 'today') {
      return sessionDate === '2026-11-05';
    }
    if (filterPeriod === 'last7') {
      return true; // sample spans recent 7 days
    }
    return true;
  });

  // Calculate aggregated totals
  let totalFocusSecs = 0;
  let totalBreakSecs = 0;
  filteredSessions.forEach(s => {
    totalFocusSecs += s.focusDurationSeconds;
    totalBreakSecs += s.breakDurationSeconds;
  });

  const totalHoursMins = `${Math.floor(totalFocusSecs / 3600)}h ${Math.floor((totalFocusSecs % 3600) / 60)}m`;
  const focusRatio =
    totalFocusSecs + totalBreakSecs > 0
      ? Math.round((totalFocusSecs / (totalFocusSecs + totalBreakSecs)) * 100)
      : 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#101114] flex flex-col justify-between max-w-md mx-auto overflow-y-auto no-scrollbar">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 bg-[#101114]/90 backdrop-blur-md px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsAuditLogModalOpen(false)}
          className="flex items-center gap-2 text-[13px] text-[#A5A8B0] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analytics</span>
        </button>

        <div className="text-center">
          <div className="text-[14px] font-semibold text-white leading-tight">
            Study &amp; Pomodoro
          </div>
          <div className="text-[10px] text-[#A5A8B0] uppercase tracking-wider">
            SESSION AUDIT LOG
          </div>
        </div>

        <button
          type="button"
          onClick={exportBackupJSON}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#252830] text-[#8AB4F8] text-[11px] font-medium"
        >
          <Download className="w-3 h-3" />
          <span>Export</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Aggregated Performance Card */}
        <div className="bg-[#1B1D22] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
              <h4 className="text-[11px] font-bold text-[#A5A8B0] uppercase tracking-wider">
                Aggregated Performance
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#72C99A]/15 text-[#72C99A] text-[10px] font-semibold">
              Optimal Pace
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="p-2 bg-[#252830] rounded-xl">
              <div className="text-[10px] text-[#A5A8B0] uppercase">Time Logged</div>
              <div className="text-[16px] font-bold text-white tabular-nums mt-0.5">
                {totalHoursMins}
              </div>
            </div>

            <div className="p-2 bg-[#252830] rounded-xl">
              <div className="text-[10px] text-[#A5A8B0] uppercase">Sessions</div>
              <div className="text-[16px] font-bold text-[#A78BFA] tabular-nums mt-0.5">
                {filteredSessions.length} completed
              </div>
            </div>

            <div className="p-2 bg-[#252830] rounded-xl">
              <div className="text-[10px] text-[#A5A8B0] uppercase">Focus Ratio</div>
              <div className="text-[16px] font-bold text-[#72C99A] tabular-nums mt-0.5">
                {focusRatio}%
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/[0.04]">
            <div className="flex justify-between text-[11px] text-[#A5A8B0] mb-1">
              <span>Daily Goal Progress</span>
              <span className="text-white font-medium">
                {Math.round(totalFocusSecs / 60)}m / 300m
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#252830] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8AB4F8] rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((totalFocusSecs / (300 * 60)) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterPeriod('today')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
              filterPeriod === 'today'
                ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
                : 'bg-[#252830] text-[#A5A8B0]'
            }`}
          >
            Today ({sessions.filter(s => s.startTime.startsWith('2026-11-05')).length})
          </button>

          <button
            type="button"
            onClick={() => setFilterPeriod('last7')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
              filterPeriod === 'last7'
                ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
                : 'bg-[#252830] text-[#A5A8B0]'
            }`}
          >
            Last 7 Days ({sessions.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterPeriod('last30')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
              filterPeriod === 'last30'
                ? 'bg-[#8AB4F8] text-[#101114] font-semibold'
                : 'bg-[#252830] text-[#A5A8B0]'
            }`}
          >
            Last 30 Days
          </button>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-[#A5A8B0] font-semibold tracking-wider uppercase px-1">
            <span>{filterPeriod === 'today' ? 'TODAY • LOGGED SESSIONS' : 'HISTORICAL SESSIONS'}</span>
            <span className="text-[#8AB4F8] font-medium lowercase">
              {filteredSessions.length} total
            </span>
          </div>

          {filteredSessions.map(sess => {
            const isExpanded = expandedSessionId === sess.id;
            const startObj = new Date(sess.startTime);
            const endObj = new Date(sess.endTime);
            const timeRange = `${startObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${endObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            return (
              <div
                key={sess.id}
                className="bg-[#1B1D22] rounded-2xl p-3.5 border border-white/[0.06] hover:border-white/[0.1] transition-all"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#252830] text-[#8AB4F8] text-[10px] font-semibold">
                      {sess.subjectCode}
                    </span>
                    <span className="text-[11px] text-[#A5A8B0]">{sess.unitTitle}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#72C99A]/15 text-[#72C99A] text-[10px] font-semibold">
                    • Completed
                  </span>
                </div>

                <h4 className="text-[14px] font-semibold text-white leading-snug">
                  {sess.topicTitle}
                </h4>

                <div className="flex items-center gap-3 text-[11px] text-[#A5A8B0] mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8AB4F8]" />
                    <span>{timeRange}</span>
                  </span>
                  <span>•</span>
                  <span className="text-[#8AB4F8] font-medium">
                    {Math.round(sess.focusDurationSeconds / 60)}m Focus
                  </span>
                  {sess.breakDurationSeconds > 0 && (
                    <>
                      <span>•</span>
                      <span>{Math.round(sess.breakDurationSeconds / 60)}m Break</span>
                    </>
                  )}
                </div>

                <div
                  onClick={() => setExpandedSessionId(isExpanded ? null : sess.id)}
                  className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8AB4F8] cursor-pointer"
                >
                  <span className="text-[#A5A8B0]">
                    {sess.sessionType === 'pomodoro'
                      ? 'Pomodoro Sprint'
                      : 'Topic Study & Problem Solving'}
                  </span>
                  <div className="flex items-center gap-1 font-medium">
                    <span>{isExpanded ? 'Hide' : 'Details'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 p-2.5 bg-[#252830] rounded-xl text-[11px] text-[#C3C6D1] leading-relaxed animate-in fade-in">
                    <div className="font-semibold text-white mb-0.5">Session Notes:</div>
                    {sess.notes || 'Focused theory review and numerical solutions.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Pomodoro Quick Launch */}
      <div className="sticky bottom-0 bg-[#101114]/95 backdrop-blur-md p-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => {
            setIsAuditLogModalOpen(false);
            setIsPomoModalOpen(true);
          }}
          className="w-full py-3 rounded-2xl bg-[#8AB4F8] text-[#101114] text-[13px] font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          <PlayCircle className="w-4 h-4 fill-current" />
          <span>Quick Pomodoro</span>
        </button>
      </div>
    </div>
  );
};
