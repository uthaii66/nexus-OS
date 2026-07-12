import { useMemo } from "react"
import { format, parseISO } from "date-fns"
import { useReducedMotion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { ChartCard } from "@/components/common/chart-card"
import type {
  HealthLog,
  NutritionTrendPoint,
  WeightLog,
  WeightTrendPoint,
} from "@/types/health"

interface HealthChartsProps {
  weightTrend: WeightTrendPoint[]
  nutritionTrend: NutritionTrendPoint[]
  logs: HealthLog[]
  targetWeightKg: number
}

const tooltipStyle = {
  background: "hsl(224 22% 12%)",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 12,
  color: "#f8fafc",
  boxShadow: "0 16px 40px rgba(0,0,0,.3)",
}

export function HealthCharts({
  weightTrend,
  nutritionTrend,
  logs,
  targetWeightKg,
}: HealthChartsProps) {
  const reduceMotion = useReducedMotion()
  const mergedWeightTrend = useMemo(() => {
    const byDate = new Map(
      weightTrend.map((point) => [point.date, { ...point }]),
    )
    const weightLogs = logs.filter(
      (log): log is WeightLog => log.type === "weight",
    )
    weightLogs.forEach((log) => {
      const existing = byDate.get(log.date)
      byDate.set(log.date, {
        date: log.date,
        weightKg: log.weightKg,
        movingAverageKg: existing?.movingAverageKg ?? log.weightKg,
      })
    })
    return [...byDate.values()].sort((left, right) =>
      left.date.localeCompare(right.date),
    )
  }, [logs, weightTrend])

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard
        title="Weight trajectory"
        description="Four-week trend with seven-day smoothing"
        height={310}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mergedWeightTrend}
            margin={{ top: 12, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="health-weight-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.10)" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              minTickGap={28}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value: string) =>
                format(parseISO(value), "MMM d")
              }
              dy={8}
            />
            <YAxis
              domain={[75, 85]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value: number) => `${value} kg`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(label) =>
                format(parseISO(String(label)), "MMM d, yyyy")
              }
              formatter={(value, name) => [
                `${Number(value).toFixed(1)} kg`,
                name === "weightKg" ? "Weight" : "7-day average",
              ]}
            />
            <ReferenceLine
              y={targetWeightKg}
              stroke="#34d399"
              strokeDasharray="5 5"
              label={{
                value: "Target",
                fill: "#6ee7b7",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />
            <Area
              type="monotone"
              dataKey="weightKg"
              name="Weight"
              stroke="#818cf8"
              fill="url(#health-weight-fill)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#818cf8",
                stroke: "#181b29",
                strokeWidth: 2,
              }}
              isAnimationActive={!reduceMotion}
              animationDuration={700}
            />
            <Line
              type="monotone"
              dataKey="movingAverageKg"
              name="7-day average"
              stroke="#c4b5fd"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={!reduceMotion}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Calories versus target"
        description="Daily intake and protein over the last two weeks"
        height={310}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={nutritionTrend}
            margin={{ top: 12, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(148,163,184,0.10)" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              minTickGap={22}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value: string) =>
                format(parseISO(value), "MMM d")
              }
              dy={8}
            />
            <YAxis
              yAxisId="calories"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            />
            <YAxis
              yAxisId="protein"
              orientation="right"
              hide
              domain={[0, 200]}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(label) =>
                format(parseISO(String(label)), "MMM d, yyyy")
              }
              formatter={(value, name) => [
                name === "Protein"
                  ? `${Number(value)} g`
                  : `${Number(value).toLocaleString()} kcal`,
                String(name),
              ]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ paddingBottom: 16, fontSize: 12 }}
            />
            <Bar
              yAxisId="calories"
              dataKey="calories"
              name="Calories"
              fill="#6366f1"
              opacity={0.78}
              radius={[5, 5, 0, 0]}
              maxBarSize={24}
              isAnimationActive={!reduceMotion}
              animationDuration={650}
            />
            <Line
              yAxisId="calories"
              type="monotone"
              dataKey="calorieTarget"
              name="Calorie target"
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={!reduceMotion}
            />
            <Line
              yAxisId="protein"
              type="monotone"
              dataKey="proteinGrams"
              name="Protein"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduceMotion}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
