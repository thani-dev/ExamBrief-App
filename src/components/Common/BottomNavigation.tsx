import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, BookOpen, BarChart3 } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, selectedTopicDetails, closeTopicDetails } = useApp();

  const handleTabClick = (tab: 'home' | 'subject' | 'analytics') => {
    // If inside topic details, close it when switching to a different tab or tapping subject
    if (selectedTopicDetails) {
      closeTopicDetails();
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#14161B]/95 backdrop-blur-xl border-t border-white/[0.06] h-16 max-w-md mx-auto">
      <div className="grid grid-cols-3 h-full items-center px-4">
        {/* Tab 1: HOME */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${
            activeTab === 'home'
              ? 'text-[#8AB4F8]'
              : 'text-[#A5A8B0] hover:text-[#E3E2E6]'
          }`}
        >
          <Home
            className={`w-5 h-5 transition-transform ${
              activeTab === 'home' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.75]'
            }`}
          />
          <span
            className={`text-[11px] font-medium tracking-wide ${
              activeTab === 'home' ? 'font-semibold text-[#8AB4F8]' : ''
            }`}
          >
            Home
          </span>
        </button>

        {/* Tab 2: SUBJECT */}
        <button
          type="button"
          onClick={() => handleTabClick('subject')}
          className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${
            activeTab === 'subject'
              ? 'text-[#8AB4F8]'
              : 'text-[#A5A8B0] hover:text-[#E3E2E6]'
          }`}
        >
          <BookOpen
            className={`w-5 h-5 transition-transform ${
              activeTab === 'subject' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.75]'
            }`}
          />
          <span
            className={`text-[11px] font-medium tracking-wide ${
              activeTab === 'subject' ? 'font-semibold text-[#8AB4F8]' : ''
            }`}
          >
            Subject
          </span>
        </button>

        {/* Tab 3: ANALYTICS */}
        <button
          type="button"
          onClick={() => handleTabClick('analytics')}
          className={`flex flex-col items-center justify-center gap-1 transition-all py-1 ${
            activeTab === 'analytics'
              ? 'text-[#8AB4F8]'
              : 'text-[#A5A8B0] hover:text-[#E3E2E6]'
          }`}
        >
          <BarChart3
            className={`w-5 h-5 transition-transform ${
              activeTab === 'analytics' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.75]'
            }`}
          />
          <span
            className={`text-[11px] font-medium tracking-wide ${
              activeTab === 'analytics' ? 'font-semibold text-[#8AB4F8]' : ''
            }`}
          >
            Analytics
          </span>
        </button>
      </div>
    </nav>
  );
};
