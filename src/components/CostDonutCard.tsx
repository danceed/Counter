import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function CostDonutCard() {
  const { costBreakdown, monthlyTotal } = useDashboardData();

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Monthly Expenses</h3>
          <p className="mt-0.5 text-xs text-gray-500">Cost breakdown</p>
        </div>
        <span className="rounded-lg bg-bg-hover px-2.5 py-1 text-[11px] font-medium text-gray-400">
          This month
        </span>
      </div>

      <div className="relative mt-3 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={costBreakdown}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={78}
              paddingAngle={3}
              stroke="none"
            >
              {costBreakdown.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Total
          </span>
          <span className="text-2xl font-bold text-white">${monthlyTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {costBreakdown.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium text-gray-300">{item.name}</span>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              ${item.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
