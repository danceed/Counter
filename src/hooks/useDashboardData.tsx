import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useMeterReadings } from '@/hooks/useMeterReadings';
import {
  buildUtilitySummaries,
  buildCostBreakdown,
  getMonthlyTotal,
  buildLivePower,
  buildDeviceInfo,
} from '@/lib/meterData';
import type {
  UtilitySummary,
  CostBreakdown,
  LiveReading,
  DeviceInfo,
} from '@/data/mockReadings';

interface DashboardDataValue {
  loading: boolean;
  error: string | null;
  refresh: () => void;
  utilities: UtilitySummary[];
  costBreakdown: CostBreakdown[];
  monthlyTotal: number;
  livePower: LiveReading;
  deviceInfo: DeviceInfo;
}

const DashboardDataContext = createContext<DashboardDataValue | null>(null);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const { readings, loading, error, refresh } = useMeterReadings();

  const value = useMemo<DashboardDataValue>(() => {
    if (readings.length === 0) {
      return {
        loading,
        error,
        refresh,
        utilities: [],
        costBreakdown: [],
        monthlyTotal: 0,
        livePower: { power: 0, unit: 'kWh', trend: 0 },
        deviceInfo: {
          name: '—',
          firmware: '—',
          ip: '—',
          mac: '—',
          rssi: -100,
          uptime: '—',
          wifiSsid: '—',
          lastSync: '—',
          status: 'offline',
        },
      };
    }

    return {
      loading,
      error,
      refresh,
      utilities: buildUtilitySummaries(readings),
      costBreakdown: buildCostBreakdown(readings),
      monthlyTotal: getMonthlyTotal(readings),
      livePower: buildLivePower(readings),
      deviceInfo: buildDeviceInfo(readings),
    };
  }, [readings, loading, error, refresh]);

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData(): DashboardDataValue {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) {
    throw new Error('useDashboardData must be used within DashboardDataProvider');
  }
  return ctx;
}
