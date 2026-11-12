import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { MeterReading } from '@/lib/supabase';
import { buildBarChartData } from '@/lib/meterData';
import type { BarPoint } from '@/data/mockReadings';
import { useDashboardData } from '@/hooks/useDashboardData';

type Range = 'day' | 'week' | 'month';

const ranges: { id: Range; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

const colors = {
  electricity: '#2563EB',
  water: '#10B981',
  gas: '#F59E0B',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-DEFAULT bg-bg-base px-3 py-2 shadow-xl">
      <p className="mb-1.5 text-[11px] font-semibold text-gray-400">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-[11px]">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize text-gray-400">{entry.dataKey}</span>
          <span className="ml-auto font-semibold text-white">{entry.value} {entry.dataKey === 'electricity' ? 'kWh' : 'm³'}</span>
        </div>
      ))}
    </div>
  );
}

export default function ConsumptionBarChart() {
  const [range, setRange] = useState<Range>('week');
  const { readings } = useDashboardData();
  const [chartData, setChartData] = useState<BarPoint[]>([]);
  const [chartReadings, setChartReadings] = useState<MeterReading[]>([]);

  const windowHours = range === 'day' ? 24 : range === 'week' ? 168 : 672;

  useMemo(() => {
    const allReadings = [...readings].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const now = allReadings.length > 0
      ? new Date(allReadings[allReadings.length - 1].created_at)
      : new Date();
    const cutoff = new Date(now.getTime() - windowHours * 60 * 60 * 1000);
    const inWindow = allReadings.filter((r) => new Date(r.created_at) >= cutoff);

    const rows = inWindow.length >= 2 ? inWindow : allReadings;
    setChartReadings(rows);
    setChartData(buildBarChartData(rows, range));
  }, [readings, range, windowHours]);

  // If we don't have enough rows in the realtime buffer for the selected
  // range, fetch more from the database.
  useMemo(() => {
    if (chartReadings.length < 4) {
      supabase
        .from('meter_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
        .then(({ data }) => {
          if (data && data.length > 0) {
            const sorted = (data as MeterReading[]).sort(
              (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            const now = new Date(sorted[sorted.length - 1].created_at);
            const cutoff = new Date(now.getTime() - windowHours * 60 * 60 * 1000);
            const inWindow = sorted.filter((r) => new Date(r.created_at) >= cutoff);
            const rows = inWindow.length >= 2 ? inWindow : sorted;
            setChartReadings(rows);
            setChartData(buildBarChartData(rows, range));
          }
        });
    }
  }, [chartReadings.length, range, windowHours]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Consumption Analytics</h3>
          <p className="mt-0.5 text-xs text-gray-500">Daily breakdown across utilities</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-bg-base p-1">
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                range === r.id
                  ? 'bg-electric-600 text-white shadow-md shadow-electric-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#222228' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1C1C22' }} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => (
                <span className="capitalize text-gray-400">{value}</span>
              )}
            />
            <Bar dataKey="electricity" fill={colors.electricity} radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="water" fill={colors.water} radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="gas" fill={colors.gas} radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
