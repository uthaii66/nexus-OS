import { ResponsiveContainer, Area, AreaChart } from "recharts";
interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
}
export function MiniChart({
  data,
  color = "hsl(var(--primary))",
  height = 36,
}: MiniChartProps) {
  const points = data.map((value, index) => ({ index, value }));
  return (
    <div style={{ height }} className="w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 3, right: 1, bottom: 0, left: 1 }}
        >
          <defs>
            <linearGradient
              id={`mini-${data.join("-")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.7}
            fill={`url(#mini-${data.join("-")})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
