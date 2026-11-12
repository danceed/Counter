import type { TabId } from './Sidebar';
import LivePowerCard from './LivePowerCard';
import CostDonutCard from './CostDonutCard';
import SmartInsightsCard from './SmartInsightsCard';
import UtilityCard from './UtilityCard';
import ConsumptionBarChart from './ConsumptionBarChart';
import AlertBanner from './AlertBanner';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Loader2, AlertCircle, TriangleAlert } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: TabId) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { utilities, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-electric-500" />
          <p className="text-sm text-gray-500">Loading meter readings…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-gray-400">Could not load meter data.</p>
          <p className="text-xs text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (utilities.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <TriangleAlert className="h-8 w-8 text-amber-400" />
          <p className="text-sm text-gray-400">No readings yet. Waiting for the ESP32 to send data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Good evening</h2>
        <p className="mt-0.5 text-sm text-gray-500">Here is how your home is doing today.</p>
      </div>

      <AlertBanner message="Electricity use is higher than usual" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <LivePowerCard />
        <CostDonutCard />
        <SmartInsightsCard />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {utilities.map((u) => (
          <UtilityCard
            key={u.type}
            utility={u}
            onClick={() => onNavigate(u.type as TabId)}
          />
        ))}
      </div>

      <ConsumptionBarChart />
    </div>
  );
}
