export type UtilityType = 'electricity' | 'water' | 'gas';

export interface LiveReading {
  power: number;
  unit: string;
  trend: number;
}

export interface UtilitySummary {
  type: UtilityType;
  label: string;
  current: number;
  unit: string;
  dailyUsage: number;
  dailyUnit: string;
  cost: number;
  connected: boolean;
  sparkline: number[];
  color: string;
  colorHex: string;
}

export interface CostBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface Insight {
  id: string;
  text: string;
  delta: number;
  positive: boolean;
}

export interface BarPoint {
  day: string;
  electricity: number;
  water: number;
  gas: number;
}

export interface AlertItem {
  id: string;
  utility: UtilityType;
  severity: 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  time: string;
  active: boolean;
}

export interface DeviceInfo {
  name: string;
  firmware: string;
  ip: string;
  mac: string;
  rssi: number;
  uptime: string;
  wifiSsid: string;
  lastSync: string;
  status: 'online' | 'offline';
}

export interface SettingsItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export const livePower: LiveReading = {
  power: 2.4,
  unit: 'kWh',
  trend: 8.3,
};

export const monthlyTotal = 240.82;

export const costBreakdown: CostBreakdown[] = [
  { name: 'Electricity', value: 142.5, color: '#2563EB' },
  { name: 'Water', value: 48.32, color: '#10B981' },
  { name: 'Gas', value: 50.0, color: '#F59E0B' },
];

export const insights: Insight[] = [
  { id: '1', text: 'Water usage is 12% lower than last week', delta: -12, positive: true },
  { id: '2', text: 'Electricity peak detected between 7–9 PM', delta: 0, positive: false },
  { id: '3', text: 'Gas consumption steady — no anomalies', delta: 2, positive: true },
];

export const utilities: UtilitySummary[] = [
  {
    type: 'electricity',
    label: 'Electricity',
    current: 12483.6,
    unit: 'kWh',
    dailyUsage: 18.4,
    dailyUnit: 'kWh',
    cost: 142.5,
    connected: true,
    sparkline: [14, 16, 15, 18, 17, 20, 18, 19, 22, 18, 16, 18],
    color: 'electric',
    colorHex: '#2563EB',
  },
  {
    type: 'water',
    label: 'Water',
    current: 847.2,
    unit: 'm³',
    dailyUsage: 0.42,
    dailyUnit: 'm³',
    cost: 48.32,
    connected: true,
    sparkline: [0.3, 0.4, 0.5, 0.35, 0.45, 0.38, 0.42, 0.5, 0.3, 0.4, 0.45, 0.42],
    color: 'neon',
    colorHex: '#10B981',
  },
  {
    type: 'gas',
    label: 'Gas',
    current: 3129.8,
    unit: 'm³',
    dailyUsage: 2.1,
    dailyUnit: 'm³',
    cost: 50.0,
    connected: true,
    sparkline: [1.8, 2.0, 2.2, 1.9, 2.1, 2.3, 2.1, 2.0, 1.9, 2.2, 2.1, 2.1],
    color: 'amber',
    colorHex: '#F59E0B',
  },
];

export const weeklyData: BarPoint[] = [
  { day: 'Mon', electricity: 16.2, water: 0.38, gas: 1.9 },
  { day: 'Tue', electricity: 18.1, water: 0.42, gas: 2.1 },
  { day: 'Wed', electricity: 17.5, water: 0.35, gas: 2.0 },
  { day: 'Thu', electricity: 19.4, water: 0.48, gas: 2.3 },
  { day: 'Fri', electricity: 22.1, water: 0.52, gas: 2.4 },
  { day: 'Sat', electricity: 20.8, water: 0.45, gas: 2.2 },
  { day: 'Sun', electricity: 18.9, water: 0.40, gas: 2.1 },
];

export const dailyData: BarPoint[] = [
  { day: '00', electricity: 0.4, water: 0.01, gas: 0.05 },
  { day: '03', electricity: 0.5, water: 0.01, gas: 0.06 },
  { day: '06', electricity: 1.2, water: 0.05, gas: 0.1 },
  { day: '09', electricity: 2.1, water: 0.08, gas: 0.15 },
  { day: '12', electricity: 2.8, water: 0.12, gas: 0.18 },
  { day: '15', electricity: 2.4, water: 0.10, gas: 0.14 },
  { day: '18', electricity: 3.6, water: 0.15, gas: 0.25 },
  { day: '21', electricity: 2.9, water: 0.09, gas: 0.2 },
];

export const monthlyData: BarPoint[] = [
  { day: 'W1', electricity: 118, water: 2.8, gas: 14.2 },
  { day: 'W2', electricity: 124, water: 3.1, gas: 15.0 },
  { day: 'W3', electricity: 131, water: 2.9, gas: 14.8 },
  { day: 'W4', electricity: 127, water: 3.0, gas: 15.1 },
];

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    utility: 'electricity',
    severity: 'warning',
    title: 'Electricity use is higher than usual',
    message: 'Today’s consumption is 23% above your 30-day average. Consider shifting heavy loads to off-peak hours.',
    time: '2 min ago',
    active: true,
  },
  {
    id: 'a2',
    utility: 'water',
    severity: 'info',
    title: 'Water usage down 12%',
    message: 'Great job — your water consumption dropped compared to last week.',
    time: '1 hour ago',
    active: true,
  },
  {
    id: 'a3',
    utility: 'gas',
    severity: 'critical',
    title: 'Possible gas leak detected',
    message: 'An abnormal flow spike was recorded on the gas line. Please verify and contact your provider if needed.',
    time: '3 hours ago',
    active: false,
  },
];

export const deviceInfo: DeviceInfo = {
  name: 'ESP32-SmartMeter-01',
  firmware: 'v2.4.1',
  ip: '192.168.1.42',
  mac: 'A4:CF:12:9B:3E:F0',
  rssi: -52,
  uptime: '14d 6h 22m',
  wifiSsid: 'HomeNet_5G',
  lastSync: 'just now',
  status: 'online',
};

export const settingsItems: SettingsItem[] = [
  { id: 's1', label: 'Push notifications', description: 'Receive alerts on your devices', enabled: true },
  { id: 's2', label: 'Email reports', description: 'Weekly summary delivered to your inbox', enabled: true },
  { id: 's3', label: 'Anomaly detection', description: 'AI-powered consumption analysis', enabled: true },
  { id: 's4', label: 'Peak-hour alerts', description: 'Notify when usage spikes during peak hours', enabled: false },
  { id: 's5', label: 'Auto-sync to cloud', description: 'Sync readings every 30 seconds', enabled: true },
];
