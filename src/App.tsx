import React from 'react';
import { useData } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StudentDetailModal } from './components/modals/StudentDetailModal';

// Four Simple, Full-Width Sections
import { HomeView } from './views/HomeView';
import { AnalysisView } from './views/AnalysisView';
import { FactorsView } from './views/FactorsView';
import { ExplorerView } from './views/ExplorerView';

export const App: React.FC = () => {
  const { activeTab } = useData();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#26342E] antialiased">
      {/* Full-Width Top Navigation */}
      <Navbar />

      {/* Main Full-Width Content with ~5% horizontal padding */}
      <main className="flex-1 w-full px-[5%] py-8">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'analysis' && <AnalysisView />}
        {activeTab === 'factors' && <FactorsView />}
        {activeTab === 'dataset' && <ExplorerView />}
      </main>

      {/* Individual Student Detail Modal */}
      <StudentDetailModal />

      {/* Clean Full-Width Editorial Footer */}
      <Footer />
    </div>
  );
};

export default App;
