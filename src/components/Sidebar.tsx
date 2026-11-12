import {
  Home,
  Zap,
  Droplets,
  Flame,
  Cpu,
  Bell,
  Settings as SettingsIcon,
  Gauge,
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export type TabId =
  | 'home'
  | 'electricity'
  | 'water'
  | 'gas'
  | 'device'
  | 'alerts'
  | 'settings';

interface NavItem {
  id: TabId;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'electricity', label: 'Electricity', icon: Zap },
  { id: 'water', label: 'Water', icon: Droplets },
  { id: 'gas', label: 'Gas', icon: Flame },
  { id: 'device', label: 'Device', icon: Cpu },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface SidebarProps {
  active: TabId;
  onNavigate: (tab: TabId) => void;
}

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  const { deviceInfo, loading } = useDashboardData();
  const isOnline = deviceInfo.status === 'online';

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border-subtle bg-bg-card">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-600/15">
          <Gauge className="h-6 w-6 text-electric-500" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-white">
            SmartMeter
          </h1>
          <p className="text-[11px] font-medium text-gray-500">
            Utility Monitoring
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-electric-600 text-white shadow-lg shadow-electric-600/25'
                  : 'text-gray-400 hover:bg-bg-hover hover:text-white'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] transition-transform duration-200 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <div className="rounded-xl border border-border-subtle bg-bg-base/60 p-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-500" />
            </span>
            <span className="text-xs font-medium text-gray-300">ESP32 Online</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500">
            Syncing every 30s · RSSI -52 dBm
          </p>
        </div>
      </div>
    </aside>
  );
}
