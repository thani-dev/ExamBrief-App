import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Common/Header';
import { BottomNavigation } from './components/Common/BottomNavigation';
import { HomeView } from './components/Home/HomeView';
import { SubjectListView } from './components/Subject/SubjectListView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { TopicDetailView } from './components/TopicDetails/TopicDetailView';
import { PomodoroModal } from './components/Pomodoro/PomodoroModal';
import { SessionAuditLogModal } from './components/Analytics/SessionAuditLogModal';
import { SettingsModal } from './components/Common/SettingsModal';

const AppContent: React.FC = () => {
  const { activeTab, selectedTopicDetails } = useApp();

  return (
    <div className="min-h-screen bg-[#0d0e11] text-[#E3E2E6] flex justify-center">
      {/* Mobile-first Android Cockpit Shell */}
      <div className="w-full max-w-md min-h-screen bg-[#101114] flex flex-col shadow-2xl relative border-x border-white/[0.04]">
        {/* Top Header */}
        <Header
          subtitle={
            selectedTopicDetails
              ? 'Topic Details'
              : activeTab === 'home'
              ? 'Daily Briefing'
              : activeTab === 'subject'
              ? 'Syllabus Management'
              : 'Preparation Analytics'
          }
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 px-4 overflow-y-auto no-scrollbar">
          {selectedTopicDetails ? (
            <TopicDetailView />
          ) : activeTab === 'home' ? (
            <HomeView />
          ) : activeTab === 'subject' ? (
            <SubjectListView />
          ) : (
            <AnalyticsView />
          )}
        </main>

        {/* Exact 3-Tab Bottom Navigation Bar */}
        <BottomNavigation />

        {/* Floating Modals and Sheets */}
        <PomodoroModal />
        <SessionAuditLogModal />
        <SettingsModal />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
