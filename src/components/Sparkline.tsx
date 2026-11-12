import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

export default function Sparkline({ data, color, height = 40 }: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
