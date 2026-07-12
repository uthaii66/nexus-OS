import { useMemo } from "react"
import { useReducedMotion } from "framer-motion"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { ChartCard } from "@/components/common/chart-card"
import type {
  BudgetCategory,
  SpendingTrendPoint,
  Transaction,
  TransactionCategory,
} from "@/types/finance"

interface FinanceChartsProps {
  trend: SpendingTrendPoint[]
  budgets: BudgetCategory[]
  transactions: Transaction[]
}

const compactCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
})

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function FinanceCharts({
  trend,
  budgets,
  transactions,
}: FinanceChartsProps) {
  const reduceMotion = useReducedMotion()
  const spendingByCategory = useMemo(() => {
    const colors = new Map(
      budgets.map((budget) => [budget.category, budget.color]),
    )
    const grouped = new Map<TransactionCategory, number>()
    transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category !== "Transfer" &&
          transaction.date.startsWith("2026-07"),
      )
      .forEach((transaction) => {
        grouped.set(
          transaction.category,
          (grouped.get(transaction.category) ?? 0) + transaction.amount,
        )
      })

    return [...grouped.entries()]
      .map(([name, value]) => ({
        name,
        value,
        color: colors.get(name) ?? "#64748b",
      }))
      .sort((left, right) => right.value - left.value)
      .slice(0, 7)
  }, [budgets, transactions])

  const julySpending = spendingByCategory.reduce(
    (total, category) => total + category.value,
    0,
  )

  return (
    <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
      <ChartCard
        title="Cash-flow rhythm"
        description="Income, spending and budget across the last seven months"
        height={300}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trend}
            margin={{ top: 8, right: 4, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="finance-spend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="finance-income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.10)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value: number) => compactCurrency.format(value)}
            />
            <Tooltip
              cursor={{
                stroke: "rgba(129,140,248,.35)",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                background: "hsl(224 22% 12%)",
                border: "1px solid rgba(255,255,255,.09)",
                borderRadius: 12,
                color: "#f8fafc",
                boxShadow: "0 16px 40px rgba(0,0,0,.3)",
              }}
              formatter={(value, name) => [
                currency.format(Number(value)),
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
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#34d399"
              fill="url(#finance-income)"
              strokeWidth={2}
              isAnimationActive={!reduceMotion}
              animationDuration={650}
            />
            <Area
              type="monotone"
              dataKey="spending"
              name="Spending"
              stroke="#818cf8"
              fill="url(#finance-spend)"
              strokeWidth={2}
              isAnimationActive={!reduceMotion}
              animationDuration={650}
            />
            <Area
              type="monotone"
              dataKey="budget"
              name="Budget"
              stroke="#f59e0b"
              fill="transparent"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              isAnimationActive={!reduceMotion}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Spending by category"
        description="July 2026 session data"
        height={300}
        contentClassName="relative"
      >
        <div className="pointer-events-none absolute left-1/2 top-[53%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Spent
          </p>
          <p className="mt-1 font-display text-xl font-semibold text-foreground">
            {compactCurrency.format(julySpending)}
          </p>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spendingByCategory}
              dataKey="value"
              nameKey="name"
              innerRadius="57%"
              outerRadius="78%"
              paddingAngle={2}
              stroke="transparent"
              isAnimationActive={!reduceMotion}
              animationDuration={700}
            >
              {spendingByCategory.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(224 22% 12%)",
                border: "1px solid rgba(255,255,255,.09)",
                borderRadius: 12,
                color: "#f8fafc",
              }}
              formatter={(value) => currency.format(Number(value))}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: 11, lineHeight: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
