import { useState } from 'react';
import { ArrowLeft, Bell, Mail, Brain, Clock, RefreshCw } from 'lucide-react';
import { settingsItems as initialSettings } from '@/data/mockReadings';
import type { SettingsItem } from '@/data/mockReadings';

interface SettingsViewProps {
  onBack: () => void;
}

const iconMap: Record<string, typeof Bell> = {
  s1: Bell,
  s2: Mail,
  s3: Brain,
  s4: Clock,
  s5: RefreshCw,
};

export default function SettingsView({ onBack }: SettingsViewProps) {
  const [settings, setSettings] = useState<SettingsItem[]>(initialSettings);

  const toggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

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
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="text-sm text-gray-500">Manage notifications & preferences</p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        <p className="mt-0.5 text-xs text-gray-500">Choose how and when you get alerted</p>

        <div className="mt-4 space-y-2">
          {settings.map((item) => {
            const Icon = iconMap[item.id] ?? Bell;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-base/50 p-4 transition-colors hover:border-border-DEFAULT"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-hover">
                    <Icon className="h-[16px] w-[16px] text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-[11px] text-gray-500">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(item.id)}
                  className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                    item.enabled ? 'bg-electric-600' : 'bg-bg-hover'
                  }`}
                  aria-label={`Toggle ${item.label}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      item.enabled ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
        <h3 className="text-sm font-semibold text-white">ESP32 Connection</h3>
        <p className="mt-0.5 text-xs text-gray-500">Data sync & API endpoint configuration</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-400">ESP32 REST API Endpoint</label>
            <input
              type="text"
              defaultValue="http://192.168.1.42/api/readings"
              className="mt-1.5 w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-electric-600"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400">Sync Interval (seconds)</label>
            <input
              type="number"
              defaultValue={30}
              className="mt-1.5 w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-electric-600"
            />
          </div>
          <button className="mt-2 rounded-xl bg-electric-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-electric-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
