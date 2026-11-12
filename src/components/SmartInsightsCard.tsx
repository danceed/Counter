import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { insights } from '@/data/mockReadings';

export default function SmartInsightsCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-electric-600/30 bg-bg-card p-5 glow-blue">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-electric-600/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-600/15">
            <Sparkles className="h-[18px] w-[18px] text-electric-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Smart Insights</h3>
        </div>

        <div className="mt-4 space-y-2.5">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start gap-3 rounded-xl border border-border-subtle bg-bg-base/50 p-3 transition-colors hover:border-border-DEFAULT"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-bg-hover">
                {insight.positive ? (
                  <TrendingDown className="h-3.5 w-3.5 text-neon-500" />
                ) : insight.delta === 0 ? (
                  <Minus className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                )}
              </div>
              <p className="text-xs leading-relaxed text-gray-300">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
