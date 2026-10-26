import React from 'react';
import { useData } from '../../context/DataContext';
import { ActiveTab } from '../../types/student';
import { GraduationCap, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useData();

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'factors', label: 'Factors' },
    { id: 'dataset', label: 'Dataset' },
  ];

  return (
    <header className="border-b border-[#E8E4DB] bg-[#FAF7F0] sticky top-0 z-30">
      <div className="w-full px-[5%] h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer flex items-center space-x-2.5 group"
        >
          <div className="w-8 h-8 rounded-md bg-[#D95D24]/10 flex items-center justify-center text-[#D95D24]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-heading text-lg sm:text-xl font-bold text-[#26342E] tracking-tight group-hover:text-[#D95D24] transition-colors">
            Student Performance
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="flex items-center space-x-6 sm:space-x-10 text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-1 relative transition-colors ${
                  isActive
                    ? 'text-[#D95D24] font-semibold'
                    : 'text-[#74766F] hover:text-[#26342E]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D95D24] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => setActiveTab('analysis')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#D95D24] hover:bg-[#C24F1D] text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
          >
            <span>Explore Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
