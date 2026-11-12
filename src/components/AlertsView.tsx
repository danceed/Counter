import { ArrowLeft, TriangleAlert, Info, OctagonAlert, Zap, Droplets, Flame } from 'lucide-react';
import { alerts } from '@/data/mockReadings';
import type { AlertItem } from '@/data/mockReadings';

interface AlertsViewProps {
  onBack: () => void;
}

const severityConfig = {
  warning: {
    icon: TriangleAlert,
    color: 'amber',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-400',
    label: 'Warning',
  },
  info: {
    icon: Info,
    color: 'electric',
    bg: 'bg-electric-600/10',
    border: 'border-electric-600/25',
    text: 'text-electric-400',
    label: 'Info',
  },
  critical: {
    icon: OctagonAlert,
    color: 'red',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    text: 'text-red-400',
    label: 'Critical',
  },
};

const utilityIcon = {
  electricity: Zap,
  water: Droplets,
  gas: Flame,
};

export default function AlertsView({ onBack }: AlertsViewProps) {
  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div>
        <h2 className="text-xl font-semibold text-white">Alerts</h2>
        <p className="text-sm text-gray-500">Notifications & anomaly detection</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert: AlertItem) => {
          const config = severityConfig[alert.severity];
          const SeverityIcon = config.icon;
          const UtilityIcon = utilityIcon[alert.utility];

          return (
            <div
              key={alert.id}
              className={`flex items-start gap-4 rounded-xl border ${config.border} ${config.bg} p-4 transition-all duration-200 hover:border-border-DEFAULT`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text}`}>
                <SeverityIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.text} ${config.bg}`}>
                    {config.label}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">{alert.message}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <UtilityIcon className="h-3 w-3" />
                    <span className="capitalize">{alert.utility}</span>
                  </span>
                  <span>·</span>
                  <span>{alert.time}</span>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  alert.active
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-bg-hover text-gray-500'
                }`}
              >
                {alert.active ? 'Active' : 'Resolved'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
