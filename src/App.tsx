import React from 'react';
import { useData } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StudentDetailModal } from './components/modals/StudentDetailModal';

// 4 Clean Views
import { OverviewView } from './views/OverviewView';
import { PerformanceView } from './views/PerformanceView';
import { FactorsView } from './views/FactorsView';
import { ExplorerView } from './views/ExplorerView';

export const App: React.FC = () => {
  const { activeTab } = useData();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#292D28] antialiased">
      {/* Minimal Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'performance' && <PerformanceView />}
        {activeTab === 'factors' && <FactorsView />}
        {activeTab === 'explorer' && <ExplorerView />}
      </main>

      {/* Individual Student Profile Modal */}
      <StudentDetailModal />

      {/* Clean Editorial Footer */}
      <Footer />
    </div>
  );
};

export default App;
