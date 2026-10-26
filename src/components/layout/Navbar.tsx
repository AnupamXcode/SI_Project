import React from 'react';
import { useData } from '../../context/DataContext';
import { ActiveTab } from '../../types/student';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useData();

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance Analysis' },
    { id: 'factors', label: 'Factors & Relationships' },
    { id: 'explorer', label: 'Dataset Explorer' },
  ];

  return (
    <header className="border-b border-[#E8E4DB] bg-[#FAF8F3]/90 sticky top-0 z-30 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Site Branding */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="cursor-pointer group"
        >
          <div className="font-heading text-lg font-bold text-[#292D28] tracking-tight group-hover:text-[#456B52] transition-colors">
            Student Performance Analysis
          </div>
          <p className="text-[11px] text-[#77776F] tracking-wide">
            UCI Secondary Education Dataset Research
          </p>
        </div>

        {/* Clean, Simple Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-6 text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-1 px-2.5 sm:px-1 relative transition-colors ${
                  isActive
                    ? 'text-[#456B52] font-semibold'
                    : 'text-[#77776F] hover:text-[#292D28]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#456B52] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
