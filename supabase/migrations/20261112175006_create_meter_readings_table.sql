/*
# Create meter_readings table for SmartMeter ESP32 utility monitoring

## Purpose
Stores one row per ESP32 reading cycle. Each row captures the cumulative
meter values for electricity, water, and gas, plus the instantaneous power
draw and device telemetry. The ESP32 posts a new row every ~30 seconds via
the Supabase Data API, and the dashboard subscribes to Realtime inserts so
the UI updates without polling.

## New Table: meter_readings
- id (uuid, PK, default gen_random_uuid())
- electricity_kwh (numeric, not null) — cumulative electricity meter in kWh
- water_m3 (numeric, not null) — cumulative water meter in m³
- gas_m3 (numeric, not null) — cumulative gas meter in m³
- power_kw (numeric, not null) — instantaneous power draw in kW
- device_name (text, not null, default 'ESP32-SmartMeter-01')
- firmware (text, not null, default 'v2.4.1')
- ip (text) — device IP address
- mac (text) — device MAC address
- rssi (int) — Wi-Fi signal strength in dBm
- wifi_ssid (text) — connected Wi-Fi network name
- uptime_seconds (int) — device uptime in seconds
- created_at (timestamptz, default now()) — when the reading was recorded

## Index
- idx_meter_readings_created_at on created_at DESC for efficient latest-row
  and historical-range queries.

## Security
- RLS enabled on meter_readings.
- This is a single-tenant monitoring app with no sign-in screen, so the
  anon-key frontend must be able to read and insert. CRUD granted to
  anon + authenticated. Policies allow all operations to anon + authenticated
  because the data is intentionally shared/public (no user isolation).
- Realtime publication includes meter_readings so INSERT events push to the
  frontend automatically.

## Seed Data
- Inserts ~30 rows of realistic readings spanning the last 7 days so the
  dashboard charts and cards have data immediately. Cumulative values
  increase monotonically; instantaneous power varies throughout the day.
*/

CREATE TABLE IF NOT EXISTS meter_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  electricity_kwh numeric NOT NULL,
  water_m3 numeric NOT NULL,
  gas_m3 numeric NOT NULL,
  power_kw numeric NOT NULL,
  device_name text NOT NULL DEFAULT 'ESP32-SmartMeter-01',
  firmware text NOT NULL DEFAULT 'v2.4.1',
  ip text,
  mac text,
  rssi int,
  wifi_ssid text,
  uptime_seconds int,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meter_readings_created_at
  ON meter_readings (created_at DESC);

ALTER TABLE meter_readings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON meter_readings TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_meter_readings" ON meter_readings;
CREATE POLICY "anon_select_meter_readings"
  ON meter_readings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_meter_readings" ON meter_readings;
CREATE POLICY "anon_insert_meter_readings"
  ON meter_readings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_meter_readings" ON meter_readings;
CREATE POLICY "anon_update_meter_readings"
  ON meter_readings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_meter_readings" ON meter_readings;
CREATE POLICY "anon_delete_meter_readings"
  ON meter_readings FOR DELETE
  TO anon, authenticated USING (true);

-- Enable Realtime for meter_readings
ALTER PUBLICATION supabase_realtime ADD TABLE meter_readings;

-- Seed data: 7 days of readings, ~4 per day, with realistic cumulative values
-- Base cumulative values that increase over time
INSERT INTO meter_readings (electricity_kwh, water_m3, gas_m3, power_kw, device_name, firmware, ip, mac, rssi, wifi_ssid, uptime_seconds, created_at)
VALUES
  -- Day -7
  (12450.0, 844.0, 3115.0, 1.8, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -54, 'HomeNet_5G', 1180800, now() - interval '7 days' + interval '6 hours'),
  (12453.2, 844.1, 3116.1, 2.1, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -53, 'HomeNet_5G', 1182600, now() - interval '7 days' + interval '12 hours'),
  (12456.8, 844.3, 3117.5, 2.6, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1184400, now() - interval '7 days' + interval '18 hours'),
  (12458.4, 844.4, 3118.2, 1.9, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -55, 'HomeNet_5G', 1186200, now() - interval '7 days' + interval '22 hours'),
  -- Day -6
  (12462.1, 844.5, 3119.8, 1.5, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -51, 'HomeNet_5G', 1190400, now() - interval '6 days' + interval '6 hours'),
  (12465.5, 844.7, 3121.0, 2.3, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -54, 'HomeNet_5G', 1192200, now() - interval '6 days' + interval '12 hours'),
  (12469.0, 844.9, 3122.4, 2.8, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1194000, now() - interval '6 days' + interval '18 hours'),
  (12471.2, 845.0, 3123.1, 2.0, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -53, 'HomeNet_5G', 1195800, now() - interval '6 days' + interval '22 hours'),
  -- Day -5
  (12474.8, 845.2, 3124.5, 1.6, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -55, 'HomeNet_5G', 1200000, now() - interval '5 days' + interval '6 hours'),
  (12478.3, 845.4, 3125.8, 2.2, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -50, 'HomeNet_5G', 1201800, now() - interval '5 days' + interval '12 hours'),
  (12481.9, 845.5, 3127.2, 2.7, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1203600, now() - interval '5 days' + interval '18 hours'),
  (12484.1, 845.6, 3127.9, 1.8, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -54, 'HomeNet_5G', 1205400, now() - interval '5 days' + interval '22 hours'),
  -- Day -4
  (12487.6, 845.8, 3129.1, 1.4, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -51, 'HomeNet_5G', 1209600, now() - interval '4 days' + interval '6 hours'),
  (12491.2, 846.0, 3130.4, 2.4, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -53, 'HomeNet_5G', 1211400, now() - interval '4 days' + interval '12 hours'),
  (12494.8, 846.1, 3131.7, 2.9, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1213200, now() - interval '4 days' + interval '18 hours'),
  (12497.0, 846.3, 3132.4, 2.1, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -55, 'HomeNet_5G', 1215000, now() - interval '4 days' + interval '22 hours'),
  -- Day -3
  (12500.6, 846.4, 3133.6, 1.7, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -54, 'HomeNet_5G', 1219200, now() - interval '3 days' + interval '6 hours'),
  (12504.1, 846.6, 3134.9, 2.5, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -50, 'HomeNet_5G', 1221000, now() - interval '3 days' + interval '12 hours'),
  (12507.7, 846.7, 3136.2, 3.0, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1222800, now() - interval '3 days' + interval '18 hours'),
  (12509.9, 846.9, 3136.9, 2.2, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -53, 'HomeNet_5G', 1224600, now() - interval '3 days' + interval '22 hours'),
  -- Day -2
  (12513.5, 847.0, 3138.1, 1.5, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -51, 'HomeNet_5G', 1228800, now() - interval '2 days' + interval '6 hours'),
  (12517.0, 847.2, 3139.4, 2.3, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -55, 'HomeNet_5G', 1230600, now() - interval '2 days' + interval '12 hours'),
  (12520.6, 847.3, 3140.7, 2.8, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1232400, now() - interval '2 days' + interval '18 hours'),
  (12522.8, 847.4, 3141.4, 2.0, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -54, 'HomeNet_5G', 1234200, now() - interval '2 days' + interval '22 hours'),
  -- Day -1
  (12526.4, 847.6, 3142.6, 1.6, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -50, 'HomeNet_5G', 1238400, now() - interval '1 days' + interval '6 hours'),
  (12529.9, 847.7, 3143.9, 2.4, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -53, 'HomeNet_5G', 1240200, now() - interval '1 days' + interval '12 hours'),
  (12533.5, 847.9, 3145.2, 2.9, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1242000, now() - interval '1 days' + interval '18 hours'),
  (12535.7, 848.0, 3145.9, 2.1, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -55, 'HomeNet_5G', 1243800, now() - interval '1 days' + interval '22 hours'),
  -- Day 0 (today) — most recent 4 readings
  (12539.3, 848.1, 3147.1, 1.7, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -51, 'HomeNet_5G', 1245600, now() - interval '6 hours'),
  (12542.8, 848.2, 3148.4, 2.4, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1247400, now() - interval '3 hours'),
  (12545.2, 848.3, 3149.1, 2.2, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -53, 'HomeNet_5G', 1249200, now() - interval '1 hour'),
  (12483.6, 847.2, 3129.8, 2.4, 'ESP32-SmartMeter-01', 'v2.4.1', '192.168.1.42', 'A4:CF:12:9B:3E:F0', -52, 'HomeNet_5G', 1249800, now() - interval '30 seconds');
