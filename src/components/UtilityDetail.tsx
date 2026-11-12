import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowLeft, Zap, Droplets, Flame } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import type { UtilitySummary, UtilityType } from '@/data/mockReadings';
import { supabase } from '@/lib/supabase';
import type { MeterReading } from '@/lib/supabase';
import { buildBarChartData } from '@/lib/meterData';
import Sparkline from './Sparkline';

interface UtilityDetailProps {
  utility: UtilitySummary;
  onBack: () => void;
}

const iconMap = {
  electricity: Zap,
  water: Droplets,
  gas: Flame,
};

const utilityField: Record<UtilityType, (r: MeterReading) => number> = {
  electricity: (r) => Number(r.electricity_kwh),
  water: (r) => Number(r.water_m3),
  gas: (r) => Number(r.gas_m3),
};

function AreaTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-DEFAULT bg-bg-base px-3 py-2 shadow-xl">
      <p className="text-[11px] font-semibold text-gray-400">{label}</p>
      <p className="text-sm font-bold text-white">{payload[0].value} {unit}</p>
    </div>
  );
}

export default function UtilityDetail({ utility, onBack }: UtilityDetailProps) {
  const Icon = iconMap[utility.type];
  const [history, setHistory] = useState<MeterReading[]>([]);

  useEffect(() => {
    supabase
      .from('meter_readings')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(200)
      .then(({ data, error }) => {
        if (!error && data) {
          setHistory(data as MeterReading[]);
        }
      });
  }, []);

  const weeklyChart = useMemo(() => {
    if (history.length < 2) return [];
    return buildBarChartData(history, 'week');
  }, [history]);

  const areaData = weeklyChart.map((d) => ({
    day: d.day,
    value: utility.type === 'electricity' ? d.electricity : utility.type === 'water' ? d.water : d.gas,
  }));

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${utility.colorHex}1A` }}
        >
          <Icon className="h-7 w-7" style={{ color: utility.colorHex }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">{utility.label}</h2>
          <p className="text-sm text-gray-500">Detailed monitoring & history</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border-subtle bg-bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Current Reading</p>
          <p className="mt-1 text-xl font-bold text-white">
            {utility.current.toLocaleString('en-US', { maximumFractionDigits: 1 })}
          </p>
          <p className="text-xs text-gray-500">{utility.unit}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Today</p>
          <p className="mt-1 text-xl font-bold text-white">{utility.dailyUsage}</p>
          <p className="text-xs text-gray-500">{utility.dailyUnit}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Monthly Cost</p>
          <p className="mt-1 text-xl font-bold text-white">${utility.cost.toFixed(2)}</p>
          <p className="text-xs text-gray-500">est. this month</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Status</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-500" />
            </span>
            <span className="text-sm font-semibold text-neon-400">Connected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white">Weekly Consumption</h3>
          <p className="mt-0.5 text-xs text-gray-500">Last 7 days</p>
          <div className="mt-4 h-[240px]">
            {areaData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`grad-${utility.type}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={utility.colorHex} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={utility.colorHex} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#222228' }} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<AreaTooltip unit={utility.dailyUnit} />} cursor={{ stroke: '#2A2A33' }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={utility.colorHex}
                    strokeWidth={2.5}
                    fill={`url(#grad-${utility.type})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-600">
                Loading history…
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-white">7-Day Sparkline</h3>
          <p className="mt-0.5 text-xs text-gray-500">Trend overview</p>
          <div className="mt-6">
            <Sparkline data={utility.sparkline} color={utility.colorHex} height={80} />
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Peak</span>
              <span className="font-semibold text-white">{Math.max(...utility.sparkline, 0).toFixed(2)} {utility.dailyUnit}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Average</span>
              <span className="font-semibold text-white">
                {(utility.sparkline.length > 0
                  ? utility.sparkline.reduce((a, b) => a + b, 0) / utility.sparkline.length
                  : 0
                ).toFixed(2)} {utility.dailyUnit}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Lowest</span>
              <span className="font-semibold text-white">{Math.min(...utility.sparkline, 0).toFixed(2)} {utility.dailyUnit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
