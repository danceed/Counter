import { Zap, Droplets, Flame } from 'lucide-react';
import type { UtilitySummary } from '@/data/mockReadings';
import Sparkline from './Sparkline';

const iconMap = {
  electricity: Zap,
  water: Droplets,
  gas: Flame,
};

interface UtilityCardProps {
  utility: UtilitySummary;
  onClick?: () => void;
}

export default function UtilityCard({ utility, onClick }: UtilityCardProps) {
  const Icon = iconMap[utility.type];

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl border border-border-subtle bg-bg-card p-5 text-left transition-all duration-200 hover:border-border-DEFAULT hover:bg-bg-hover"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${utility.colorHex}1A` }}
          >
            <Icon className="h-5 w-5" style={{ color: utility.colorHex }} />
          </div>
          <span className="text-sm font-semibold text-white">{utility.label}</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-neon-500/10 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-500" />
          </span>
          <span className="text-[11px] font-medium text-neon-400">Connected</span>
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">
            {utility.current.toLocaleString('en-US', { maximumFractionDigits: 1 })}
          </p>
          <p className="text-xs font-medium text-gray-500">{utility.unit} total</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-300">
            {utility.dailyUsage} {utility.dailyUnit}
          </p>
          <p className="text-[11px] font-medium text-gray-500">today</p>
        </div>
      </div>

      <div className="mt-3 -mx-1">
        <Sparkline data={utility.sparkline} color={utility.colorHex} />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="text-gray-500">7-day trend</span>
        <span className="font-medium text-gray-400">${utility.cost.toFixed(2)}/mo</span>
      </div>
    </button>
  );
}
