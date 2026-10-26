import React, { useState, useMemo } from 'react';
import { useData } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FilterDrawer } from './components/common/FilterDrawer';
import { StudentDetailModal } from './components/modals/StudentDetailModal';

// Views
import { LandingView } from './views/LandingView';
import { ExecutiveAnalyticsView } from './views/ExecutiveAnalyticsView';
import { PerformanceLabView } from './views/PerformanceLabView';
import { EngagementPatternsView } from './views/EngagementPatternsView';
import { RelationshipExplorerView } from './views/RelationshipExplorerView';
import { CohortComparisonView } from './views/CohortComparisonView';
import { StudentRecordExplorerView } from './views/StudentRecordExplorerView';
import { DataQualityView } from './views/DataQualityView';
import { MethodologyView } from './views/MethodologyView';

export const App: React.FC = () => {
  const { activeTab, filters } = useData();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.school !== 'all') count++;
    if (filters.sex !== 'all') count++;
    if (filters.gradeRange[0] > 0 || filters.gradeRange[1] < 20) count++;
    if (filters.absencesRange[1] < 93) count++;
    if (filters.studytime.length < 4) count++;
    if (filters.failures.length < 4) count++;
    if (filters.schoolsup !== 'all') count++;
    if (filters.internet !== 'all') count++;
    if (filters.higher !== 'all') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#1C2923]">
      {/* Top Navigation */}
      <Navbar 
        onToggleFilters={() => setIsFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-[1540px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <LandingView />}
        {activeTab === 'executive' && <ExecutiveAnalyticsView />}
        {activeTab === 'performance' && <PerformanceLabView />}
        {activeTab === 'engagement' && <EngagementPatternsView />}
        {activeTab === 'relationships' && <RelationshipExplorerView />}
        {activeTab === 'cohorts' && <CohortComparisonView />}
        {activeTab === 'explorer' && <StudentRecordExplorerView />}
        {activeTab === 'quality' && <DataQualityView />}
        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Slide-over Filter Drawer */}
      <FilterDrawer 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Individual Student Profile Modal */}
      <StudentDetailModal />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};

export default App;
