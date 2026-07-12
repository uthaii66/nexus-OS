import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, CircleDollarSign, Home, PiggyBank } from "lucide-react";

import { ChartCard } from "@/components/common/chart-card";
import { SectionCard } from "@/components/common/section-card";
import { StatusBadge } from "@/components/common/status-badge";
import { Progress } from "@/components/ui/progress";
import type {
  DebtTrackerItem,
  HomeContribution,
  SavingsAllocation,
} from "@/types/finance";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function DebtTracker({ debts }: { debts: DebtTrackerItem[] }) {
  const totals = useMemo(
    () =>
      debts.reduce(
        (acc, debt) => ({
          total: acc.total + debt.totalAmount,
          paid: acc.paid + debt.paidAmount,
          remaining: acc.remaining + debt.remainingAmount,
        }),
        { total: 0, paid: 0, remaining: 0 },
      ),
    [debts],
  );
  const paidPercent = totals.total ? (totals.paid / totals.total) * 100 : 0;
  const pie = [
    { name: "Paid", value: totals.paid },
    { name: "Remaining", value: totals.remaining },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Summary
          title="Total debt"
          value={currency.format(totals.total)}
          icon={CircleDollarSign}
        />
        <Summary
          title="Paid so far"
          value={currency.format(totals.paid)}
          icon={CheckCircle2}
        />
        <Summary
          title="Remaining"
          value={currency.format(totals.remaining)}
          icon={CircleDollarSign}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[.75fr_1.25fr]">
        <ChartCard
          title="Overall debt progress"
          description={`${paidPercent.toFixed(1)}% repaid`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pie}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={3}
              >
                {pie.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={index === 0 ? "#22c55e" : "#f59e0b"}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => currency.format(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <SectionCard
          title="Debt accounts"
          description="Sheet-based repayment progress"
          contentClassName="space-y-4"
        >
          {debts.map((debt) => (
            <article
              key={debt.id}
              className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{debt.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currency.format(debt.paidAmount)} paid of{" "}
                    {currency.format(debt.totalAmount)}
                  </p>
                </div>
                <StatusBadge
                  tone={
                    debt.status === "completed"
                      ? "success"
                      : debt.completionPercent < 20
                        ? "warning"
                        : "info"
                  }
                >
                  {debt.status === "completed"
                    ? "Completed"
                    : `${debt.completionPercent.toFixed(1)}%`}
                </StatusBadge>
              </div>
              <Progress
                value={debt.completionPercent}
                aria-label={`${debt.name} ${debt.completionPercent} percent paid`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Remaining {currency.format(debt.remainingAmount)}</span>
                {debt.note ? <span>{debt.note}</span> : null}
              </div>
            </article>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

export function HomeContributionTracker({
  rows,
}: {
  rows: HomeContribution[];
}) {
  const totals = rows.reduce(
    (acc, row) => ({
      emi: acc.emi + row.emi,
      given: acc.given + row.amountGiven,
      actual: acc.actual + row.actualHomeAmount,
    }),
    { emi: 0, given: 0, actual: 0 },
  );
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Summary
          title="Total EMI"
          value={currency.format(totals.emi)}
          icon={Home}
        />
        <Summary
          title="Amount given"
          value={currency.format(totals.given)}
          icon={Home}
        />
        <Summary
          title="Net home amount"
          value={currency.format(totals.actual)}
          icon={Home}
        />
      </div>
      <ChartCard
        title="Monthly home contribution"
        description="Amount given minus EMI"
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={rows}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.2}
            />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tickFormatter={(value) => compactCurrency.format(Number(value))}
              tick={{ fontSize: 11 }}
            />
            <Tooltip formatter={(value: number) => currency.format(value)} />
            <Legend />
            <Bar
              dataKey="emi"
              name="EMI"
              fill="#f59e0b"
              radius={[5, 5, 0, 0]}
            />
            <Bar
              dataKey="amountGiven"
              name="Amount given"
              fill="#6366f1"
              radius={[5, 5, 0, 0]}
            />
            <Bar
              dataKey="actualHomeAmount"
              name="Actual home amount"
              fill="#22c55e"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <SectionCard
        title="Home contribution ledger"
        description="Actual home amount = amount given − EMI"
        contentClassName="overflow-x-auto"
      >
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2">Period</th>
              <th>EMI</th>
              <th>Amount given</th>
              <th>Actual home amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/50">
                <td className="py-3 font-medium">
                  {row.month} {row.year}
                </td>
                <td>{currency.format(row.emi)}</td>
                <td>{currency.format(row.amountGiven)}</td>
                <td
                  className={
                    row.actualHomeAmount >= 0
                      ? "text-emerald-300"
                      : "text-red-300"
                  }
                >
                  {currency.format(row.actualHomeAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

export function SavingsTracker({ rows }: { rows: SavingsAllocation[] }) {
  const totals = rows.reduce(
    (acc, row) => ({
      auraGold: acc.auraGold + row.auraGold,
      tanishqGold: acc.tanishqGold + row.tanishqGold,
      chitFund: acc.chitFund + row.chitFund,
      mutualFund: acc.mutualFund + row.mutualFund,
      rdIcici: acc.rdIcici + row.rdIcici,
      total: acc.total + row.totalSavings,
    }),
    {
      auraGold: 0,
      tanishqGold: 0,
      chitFund: 0,
      mutualFund: 0,
      rdIcici: 0,
      total: 0,
    },
  );
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Summary
          title="Total savings"
          value={currency.format(totals.total)}
          icon={PiggyBank}
        />
        <Summary
          title="Aura Gold"
          value={currency.format(totals.auraGold)}
          icon={PiggyBank}
        />
        <Summary
          title="Tanishq Gold"
          value={currency.format(totals.tanishqGold)}
          icon={PiggyBank}
        />
        <Summary
          title="Chit Fund"
          value={currency.format(totals.chitFund)}
          icon={PiggyBank}
        />
        <Summary
          title="Mutual Fund"
          value={currency.format(totals.mutualFund)}
          icon={PiggyBank}
        />
        <Summary
          title="RD – ICICI"
          value={currency.format(totals.rdIcici)}
          icon={PiggyBank}
        />
      </div>
      <ChartCard
        title="Savings allocation by month"
        description="Gold, chit fund, mutual fund and recurring deposit"
      >
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={rows}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.2}
            />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tickFormatter={(value) => compactCurrency.format(Number(value))}
              tick={{ fontSize: 11 }}
            />
            <Tooltip formatter={(value: number) => currency.format(value)} />
            <Legend />
            <Bar
              dataKey="tanishqGold"
              name="Tanishq Gold"
              stackId="s"
              fill="#3b82f6"
            />
            <Bar
              dataKey="chitFund"
              name="Chit Fund"
              stackId="s"
              fill="#ef4444"
            />
            <Bar
              dataKey="mutualFund"
              name="Mutual Fund"
              stackId="s"
              fill="#84cc16"
            />
            <Bar
              dataKey="rdIcici"
              name="RD – ICICI"
              stackId="s"
              fill="#8b5cf6"
            />
            <Bar
              dataKey="auraGold"
              name="Aura Gold"
              stackId="s"
              fill="#06b6d4"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <SectionCard
        title="Savings ledger"
        description="Monthly allocations and redemption notes"
        contentClassName="overflow-x-auto"
      >
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2">Month</th>
              <th>Aura Gold</th>
              <th>Tanishq Gold</th>
              <th>Chit Fund</th>
              <th>Mutual Fund</th>
              <th>RD – ICICI</th>
              <th>Total</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/50 align-top">
                <td className="py-3 font-medium">{row.month}</td>
                <td>{currency.format(row.auraGold)}</td>
                <td>{currency.format(row.tanishqGold)}</td>
                <td>{currency.format(row.chitFund)}</td>
                <td>{currency.format(row.mutualFund)}</td>
                <td>{currency.format(row.rdIcici)}</td>
                <td className="font-medium">
                  {currency.format(row.totalSavings)}
                </td>
                <td className="max-w-[280px] text-xs text-muted-foreground">
                  {row.remarks ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

function Summary({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof PiggyBank;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-4 text-indigo-300" aria-hidden="true" />
        {title}
      </div>
      <p className="mt-3 font-display text-xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}
