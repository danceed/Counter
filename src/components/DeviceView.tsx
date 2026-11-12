import { ArrowLeft, Cpu, Wifi, RefreshCw, HardDrive, Signal, Clock, CheckCircle2 } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

interface DeviceViewProps {
  onBack: () => void;
}

function StatRow({ icon: Icon, label, value }: { icon: typeof Cpu; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle py-3.5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-hover">
          <Icon className="h-[16px] w-[16px] text-gray-400" />
        </div>
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

export default function DeviceView({ onBack }: DeviceViewProps) {
  const { deviceInfo } = useDashboardData();
  const rssiQuality = deviceInfo.rssi > -60 ? 'Excellent' : deviceInfo.rssi > -70 ? 'Good' : 'Fair';
  const isOnline = deviceInfo.status === 'online';

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
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-600/15">
          <Cpu className="h-7 w-7 text-electric-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">ESP32 Device</h2>
          <p className="text-sm text-gray-500">Hardware & connection status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isOnline && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-500 opacity-75" />
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-neon-500' : 'bg-gray-600'}`} />
            </span>
            <span className={`text-sm font-semibold ${isOnline ? 'text-neon-400' : 'text-gray-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="mt-3 text-lg font-bold text-white">{deviceInfo.name}</p>
          <p className="text-xs text-gray-500">Firmware {deviceInfo.firmware}</p>
          <div className="mt-4 rounded-xl bg-bg-base p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Signal Strength</span>
              <span className="font-semibold text-white">{rssiQuality}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-hover">
              <div
                className="h-full rounded-full bg-neon-500"
                style={{ width: `${Math.max(0, Math.min(100, deviceInfo.rssi + 100))}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-gray-500">RSSI: {deviceInfo.rssi} dBm</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white">Device Information</h3>
          <div className="mt-2">
            <StatRow icon={Cpu} label="Device Name" value={deviceInfo.name} />
            <StatRow icon={HardDrive} label="Firmware" value={deviceInfo.firmware} />
            <StatRow icon={Wifi} label="Wi-Fi Network" value={deviceInfo.wifiSsid} />
            <StatRow icon={Signal} label="IP Address" value={deviceInfo.ip} />
            <StatRow icon={Cpu} label="MAC Address" value={deviceInfo.mac} />
            <StatRow icon={Clock} label="Uptime" value={deviceInfo.uptime} />
            <StatRow icon={RefreshCw} label="Last Sync" value={deviceInfo.lastSync} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
        <h3 className="text-sm font-semibold text-white">Connected Sensors</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { label: 'Electricity Meter', port: 'GPIO 34', status: 'Active' },
            { label: 'Water Flow Sensor', port: 'GPIO 35', status: 'Active' },
            { label: 'Gas Flow Sensor', port: 'GPIO 32', status: 'Active' },
          ].map((sensor) => (
            <div key={sensor.label} className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-base p-3.5">
              <CheckCircle2 className="h-5 w-5 text-neon-500" />
              <div>
                <p className="text-sm font-medium text-white">{sensor.label}</p>
                <p className="text-[11px] text-gray-500">{sensor.port} · {sensor.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
