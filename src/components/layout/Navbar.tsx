import React from 'react';
import { useData } from '../../context/DataContext';
import { ActiveTab, SubjectFilter } from '../../types/student';
import { 
  BarChart3, 
  Layers, 
  GitCompare, 
  Table, 
  FileCheck2, 
  BookOpen, 
  Activity, 
  Compass, 
  Download, 
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  onToggleFilters?: () => void;
  activeFilterCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleFilters, activeFilterCount = 0 }) => {
  const { activeTab, setActiveTab, filters, setFilters, exportFilteredCSV, filteredRecords } = useData();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'executive', label: 'Executive Analytics', icon: Activity },
    { id: 'performance', label: 'Performance Lab', icon: BarChart3 },
    { id: 'engagement', label: 'Engagement', icon: Layers },
    { id: 'relationships', label: 'Relationships', icon: Activity },
    { id: 'cohorts', label: 'Cohort Studio', icon: GitCompare },
    { id: 'explorer', label: 'Records Explorer', icon: Table },
    { id: 'quality', label: 'Data Quality', icon: FileCheck2 },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
  ];

  const handleSubjectChange = (subject: SubjectFilter) => {
    setFilters(prev => ({ ...prev, subject }));
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#E6E3D8] transition-all">
      {/* Top Banner / Studio Branding */}
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-[#EBE7DC]">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#17382B] flex items-center justify-center text-[#D9A441] shadow-sm">
              <GraduationCap className="w-5 h-5 text-[#F7F5EF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif-editorial text-lg font-bold text-[#17382B] tracking-tight">
                  Student Intelligence
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono-data bg-[#8FA58A]/20 text-[#17382B] font-medium border border-[#8FA58A]/30">
                  STUDIO v2.4
                </span>
              </div>
              <p className="text-[11px] text-[#68736B] tracking-wider uppercase font-medium">
                Research & Analytics Studio · UCI Secondary Education
              </p>
            </div>
          </div>

          {/* Quick Cohort Selectors & Actions */}
          <div className="flex items-center space-x-3">
            {/* Cohort Selector Pills */}
            <div className="hidden md:flex items-center bg-[#EAE7DC] p-1 rounded-lg border border-[#DBD6C8] text-xs font-medium">
              <button
                onClick={() => handleSubjectChange('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filters.subject === 'all'
                    ? 'bg-[#17382B] text-[#F7F5EF] shadow-sm'
                    : 'text-[#4A5851] hover:text-[#17382B]'
                }`}
              >
                All Subjects (1,044)
              </button>
              <button
                onClick={() => handleSubjectChange('Mathematics')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filters.subject === 'Mathematics'
                    ? 'bg-[#C55A38] text-white shadow-sm'
                    : 'text-[#4A5851] hover:text-[#C55A38]'
                }`}
              >
                Mathematics (395)
              </button>
              <button
                onClick={() => handleSubjectChange('Portuguese')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filters.subject === 'Portuguese'
                    ? 'bg-[#17382B] text-white shadow-sm'
                    : 'text-[#4A5851] hover:text-[#17382B]'
                }`}
              >
                Portuguese (649)
              </button>
            </div>

            {/* Filter Toggle Button */}
            {onToggleFilters && (
              <button
                onClick={onToggleFilters}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#D8D4C5] bg-[#FFFEFA] hover:bg-[#F3EFE6] text-xs font-medium text-[#17382B] transition-all shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C55A38]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#C55A38] text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {/* CSV Export Button */}
            <button
              onClick={exportFilteredCSV}
              title={`Download ${filteredRecords.length} filtered records as CSV`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#17382B] hover:bg-[#204939] text-[#F7F5EF] text-xs font-medium transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#D9A441]" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="font-mono-data text-[10px] opacity-80">({filteredRecords.length})</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#17382B] text-[#FFFDF7] shadow-sm font-semibold'
                    : 'text-[#4A5851] hover:text-[#17382B] hover:bg-[#EDE8DC]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D9A441]' : 'text-[#8FA58A]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
