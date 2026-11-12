import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';

const maxPower = 5;

export default function LivePowerCard() {
  const { livePower } = useDashboardData();

  const percentage = Math.min((livePower.power / maxPower) * 100, 100);
  const data = [
    { name: 'used', value: percentage },
    { name: 'remaining', value: 100 - percentage },
  ];
  const color = percentage > 80 ? '#EF4444' : percentage > 60 ? '#F59E0B' : '#10B981';

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Live Power</h3>
          <p className="mt-0.5 text-xs text-gray-500">Real-time consumption</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-neon-500/10 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-500" />
          </span>
          <span className="text-[11px] font-medium text-neon-400">Live</span>
        </span>
      </div>

      <div className="relative mt-2 h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={72}
              outerRadius={92}
              paddingAngle={0}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#1C1C22" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <p className="text-3xl font-bold text-white">{livePower.power}</p>
          <p className="text-xs font-medium text-gray-500">{livePower.unit}</p>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-border-subtle pt-3">
        <span className="text-[11px] text-gray-500">vs previous reading</span>
        <span className={`text-xs font-semibold ${livePower.trend > 0 ? 'text-amber-400' : 'text-neon-400'}`}>
          {livePower.trend > 0 ? '+' : ''}{livePower.trend}%
        </span>
      </div>
    </div>
  );
}
