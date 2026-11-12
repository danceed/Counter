import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import type { TabId } from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import UtilityDetail from '@/components/UtilityDetail';
import DeviceView from '@/components/DeviceView';
import AlertsView from '@/components/AlertsView';
import SettingsView from '@/components/SettingsView';
import { DashboardDataProvider, useDashboardData } from '@/hooks/useDashboardData';
import type { UtilityType } from '@/data/mockReadings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const { utilities } = useDashboardData();

  const goHome = () => setActiveTab('home');

  const getUtility = (type: UtilityType) =>
    utilities.find((u) => u.type === type) ?? utilities[0];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'electricity':
        return <UtilityDetail utility={getUtility('electricity')} onBack={goHome} />;
      case 'water':
        return <UtilityDetail utility={getUtility('water')} onBack={goHome} />;
      case 'gas':
        return <UtilityDetail utility={getUtility('gas')} onBack={goHome} />;
      case 'device':
        return <DeviceView onBack={goHome} />;
      case 'alerts':
        return <AlertsView onBack={goHome} />;
      case 'settings':
        return <SettingsView onBack={goHome} />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar active={activeTab} onNavigate={setActiveTab} />
      <main className="ml-64 min-h-screen p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-fade-in">{renderContent()}</div>
      </main>
    </div>
  );
}

function App() {
  return (
    <DashboardDataProvider>
      <AppContent />
    </DashboardDataProvider>
  );
}

export default App;
