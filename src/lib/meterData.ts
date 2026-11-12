import type { MeterReading } from './supabase';
import type {
  UtilitySummary,
  UtilityType,
  CostBreakdown,
  BarPoint,
  LiveReading,
  DeviceInfo,
} from '@/data/mockReadings';

const UTILITY_CONFIG: Record<
  UtilityType,
  { label: string; unit: string; dailyUnit: string; color: string; colorHex: string; ratePerUnit: number }
> = {
  electricity: {
    label: 'Electricity',
    unit: 'kWh',
    dailyUnit: 'kWh',
    color: 'electric',
    colorHex: '#2563EB',
    ratePerUnit: 0.18,
  },
  water: {
    label: 'Water',
    unit: 'm³',
    dailyUnit: 'm³',
    color: 'neon',
    colorHex: '#10B981',
    ratePerUnit: 15.0,
  },
  gas: {
    label: 'Gas',
    unit: 'm³',
    dailyUnit: 'm³',
    color: 'amber',
    colorHex: '#F59E0B',
    ratePerUnit: 7.5,
  },
};

function getField(row: MeterReading, type: UtilityType): number {
  if (type === 'electricity') return Number(row.electricity_kwh);
  if (type === 'water') return Number(row.water_m3);
  return Number(row.gas_m3);
}

function buildSparkline(rows: MeterReading[], type: UtilityType, count = 12): number[] {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  if (sorted.length < 2) return [];
  const deltas: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    deltas.push(Math.max(0, getField(sorted[i], type) - getField(sorted[i - 1], type)));
  }
  if (deltas.length <= count) return deltas;
  const step = Math.floor(deltas.length / count) || 1;
  const sampled: number[] = [];
  for (let i = 0; i < deltas.length; i += step) {
    const chunk = deltas.slice(i, i + step);
    sampled.push(chunk.reduce((a, b) => a + b, 0));
  }
  return sampled.slice(-count);
}

function computeDailyUsage(rows: MeterReading[], type: UtilityType): number {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  if (sorted.length < 2) return 0;
  const now = new Date(sorted[sorted.length - 1].created_at);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const firstInWindow = sorted.find(
    (r) => new Date(r.created_at) >= dayAgo
  );
  if (!firstInWindow) return 0;
  const latest = sorted[sorted.length - 1];
  return Math.max(0, getField(latest, type) - getField(firstInWindow, type));
}

export function buildUtilitySummaries(rows: MeterReading[]): UtilitySummary[] {
  const types: UtilityType[] = ['electricity', 'water', 'gas'];
  return types.map((type) => {
    const config = UTILITY_CONFIG[type];
    const latest = rows[0];
    const current = getField(latest, type);
    const dailyUsage = computeDailyUsage(rows, type);
    const monthlyCost = dailyUsage * 30 * config.ratePerUnit;

    return {
      type,
      label: config.label,
      current,
      unit: config.unit,
      dailyUsage: Number(dailyUsage.toFixed(2)),
      dailyUnit: config.dailyUnit,
      cost: Number(monthlyCost.toFixed(2)),
      connected: true,
      sparkline: buildSparkline(rows, type),
      color: config.color,
      colorHex: config.colorHex,
    };
  });
}

export function buildCostBreakdown(rows: MeterReading[]): CostBreakdown[] {
  const summaries = buildUtilitySummaries(rows);
  return summaries.map((s) => ({
    name: s.label,
    value: s.cost,
    color: s.colorHex,
  }));
}

export function getMonthlyTotal(rows: MeterReading[]): number {
  return buildCostBreakdown(rows).reduce((sum, c) => sum + c.value, 0);
}

export function buildLivePower(rows: MeterReading[]): LiveReading {
  const latest = rows[0];
  const power = Number(latest.power_kw);
  let trend = 0;
  if (rows.length > 1) {
    const prev = rows[1];
    const prevPower = Number(prev.power_kw);
    if (prevPower > 0) {
      trend = Number((((power - prevPower) / prevPower) * 100).toFixed(1));
    }
  }
  return { power, unit: 'kWh', trend };
}

function formatDayLabel(date: Date, range: 'day' | 'week' | 'month'): string {
  if (range === 'day') {
    return `${date.getHours().toString().padStart(2, '0')}h`;
  }
  if (range === 'month') {
    return `W${Math.ceil(date.getDate() / 7)}`;
  }
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function buildBarChartData(
  rows: MeterReading[],
  range: 'day' | 'week' | 'month'
): BarPoint[] {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  if (sorted.length < 2) return [];

  const now = new Date(sorted[sorted.length - 1].created_at);
  let windowMs: number;
  let bucketMs: number;
  let bucketCount: number;

  if (range === 'day') {
    windowMs = 24 * 60 * 60 * 1000;
    bucketMs = 3 * 60 * 60 * 1000;
    bucketCount = 8;
  } else if (range === 'week') {
    windowMs = 7 * 24 * 60 * 60 * 1000;
    bucketMs = 24 * 60 * 60 * 1000;
    bucketCount = 7;
  } else {
    windowMs = 28 * 24 * 60 * 60 * 1000;
    bucketMs = 7 * 24 * 60 * 60 * 1000;
    bucketCount = 4;
  }

  const windowStart = new Date(now.getTime() - windowMs);
  const buckets: { start: Date; end: Date; label: string; rows: MeterReading[] }[] = [];
  for (let i = 0; i < bucketCount; i++) {
    const start = new Date(windowStart.getTime() + i * bucketMs);
    const end = new Date(start.getTime() + bucketMs);
    buckets.push({
      start,
      end,
      label: formatDayLabel(start, range),
      rows: [],
    });
  }

  for (const row of sorted) {
    const t = new Date(row.created_at);
    for (const b of buckets) {
      if (t >= b.start && t < b.end) {
        b.rows.push(row);
        break;
      }
    }
  }

  return buckets.map((b) => {
    if (b.rows.length < 2) {
      return { day: b.label, electricity: 0, water: 0, gas: 0 };
    }
    const first = b.rows[0];
    const last = b.rows[b.rows.length - 1];
    return {
      day: b.label,
      electricity: Number((Number(last.electricity_kwh) - Number(first.electricity_kwh)).toFixed(2)),
      water: Number((Number(last.water_m3) - Number(first.water_m3)).toFixed(3)),
      gas: Number((Number(last.gas_m3) - Number(first.gas_m3)).toFixed(2)),
    };
  });
}

export function buildDeviceInfo(rows: MeterReading[]): DeviceInfo {
  const latest = rows[0];

  function formatUptime(seconds: number | null): string {
    if (seconds == null) return '—';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  }

  return {
    name: latest.device_name,
    firmware: latest.firmware,
    ip: latest.ip ?? '—',
    mac: latest.mac ?? '—',
    rssi: latest.rssi ?? -100,
    uptime: formatUptime(latest.uptime_seconds),
    wifiSsid: latest.wifi_ssid ?? '—',
    lastSync: 'just now',
    status: 'online',
  };
}
