import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Landmark,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react"

import { ErrorState } from "@/components/common/error-state"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { MetricCard } from "@/components/common/metric-card"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import {
  AccountOverview,
  FinanceDetails,
} from "@/features/finance/components/finance-details"
import { FinanceCharts } from "@/features/finance/components/finance-charts"
import { TransactionDialog } from "@/features/finance/components/transaction-dialog"
import { TransactionTable } from "@/features/finance/components/transaction-table"
import { useFinanceDashboard } from "@/features/finance/hooks/use-finance-dashboard"
import { calculateFinanceSummary, useFinanceStore } from "@/store/finance-store"
import type { Transaction, TransactionType } from "@/types/finance"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const preciseCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

export function FinancePage() {
  const reduceMotion = useReducedMotion()
  const transactions = useFinanceStore((state) => state.transactions)
  const { data, error, reload } = useFinanceDashboard()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [defaultType, setDefaultType] = useState<TransactionType>("expense")
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)
  const summary = useMemo(
    () => calculateFinanceSummary(transactions),
    [transactions],
  )

  const openCreate = (type: TransactionType) => {
    setSelectedTransaction(null)
    setDefaultType(type)
    setDialogOpen(true)
  }

  const openEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDefaultType(transaction.type)
    setDialogOpen(true)
  }

  if (error) {
    return <ErrorState description={error} onRetry={() => void reload()} />
  }

  if (!data) return <LoadingSkeleton />

  const metrics = [
    {
      label: "Total balance",
      value: preciseCurrency.format(summary.totalBalance),
      detail: "Across four accounts",
      trend: `+${summary.balanceChangePercent}%`,
      trendDirection: "up" as const,
      icon: WalletCards,
      accent: "primary" as const,
    },
    {
      label: "Monthly income",
      value: currency.format(summary.monthlyIncome),
      detail: "Salary + freelance",
      trend: "+6.3%",
      trendDirection: "up" as const,
      icon: ArrowDownToLine,
      accent: "success" as const,
    },
    {
      label: "Monthly spending",
      value: currency.format(summary.monthlyExpenses),
      detail: `${Math.max(0, 100 - (summary.monthlyExpenses / summary.monthlyBudget) * 100).toFixed(0)}% budget left`,
      trend: "−4.1%",
      trendDirection: "down" as const,
      icon: ReceiptText,
      accent: "warning" as const,
    },
    {
      label: "Savings reserve",
      value: currency.format(summary.savings),
      detail: "4.3 months of expenses",
      trend: "+7.2%",
      trendDirection: "up" as const,
      icon: PiggyBank,
      accent: "success" as const,
    },
    {
      label: "Total debt",
      value: currency.format(summary.totalDebt),
      detail: "2 active balances",
      trend: "−8.1%",
      trendDirection: "down" as const,
      icon: Landmark,
      accent: "danger" as const,
    },
    {
      label: "Budget remaining",
      value: currency.format(summary.budgetRemaining),
      detail: `${summary.savingsRate.toFixed(1)}% savings rate`,
      trend: summary.budgetRemaining >= 0 ? "On track" : "Over budget",
      trendDirection:
        summary.budgetRemaining >= 0 ? ("up" as const) : ("down" as const),
      icon: ShieldCheck,
      accent:
        summary.budgetRemaining >= 0
          ? ("primary" as const)
          : ("danger" as const),
    },
  ]

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Financial command"
        title="Finance"
        description="A calm, complete view of cash flow, budgets, balances and upcoming commitments."
        actions={
          <>
            <Button variant="outline" onClick={() => openCreate("income")}>
              <ArrowDownToLine /> Add income
            </Button>
            <Button onClick={() => openCreate("expense")}>
              <ArrowUpFromLine /> Add expense
            </Button>
          </>
        }
      />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.045 },
          },
        }}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
        aria-label="Finance summary"
      >
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            variants={{
              hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <MetricCard {...metric} className="h-full" />
          </motion.div>
        ))}
      </motion.section>

      <AccountOverview accounts={data.accounts} />
      <FinanceCharts
        trend={data.spendingTrend}
        budgets={data.budgets}
        transactions={transactions}
      />
      <FinanceDetails
        bills={data.bills}
        budgets={data.budgets}
        debts={data.debts}
        transactions={transactions}
      />
      <TransactionTable
        transactions={transactions}
        onEdit={openEdit}
        onAdd={() => openCreate("expense")}
      />

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
        defaultType={defaultType}
      />
    </div>
  )
}

export default FinancePage
