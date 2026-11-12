import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 10 } },
});

export interface MeterReading {
  id: string;
  electricity_kwh: number;
  water_m3: number;
  gas_m3: number;
  power_kw: number;
  device_name: string;
  firmware: string;
  ip: string | null;
  mac: string | null;
  rssi: number | null;
  wifi_ssid: string | null;
  uptime_seconds: number | null;
  created_at: string;
}
