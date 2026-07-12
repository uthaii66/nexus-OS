import { differenceInCalendarDays, format, parseISO } from "date-fns"
import {
  Building2,
  CalendarClock,
  CreditCard,
  Landmark,
  LineChart,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
} from "lucide-react"

import { SectionCard } from "@/components/common/section-card"
import { StatusBadge } from "@/components/common/status-badge"
import { Progress } from "@/components/ui/progress"
import type {
  Bill,
  BudgetCategory,
  DebtAccount,
  FinanceAccount,
  Transaction,
} from "@/types/finance"

interface AccountOverviewProps {
  accounts: FinanceAccount[]
}

interface FinanceDetailsProps {
  bills: Bill[]
  budgets: BudgetCategory[]
  debts: DebtAccount[]
  transactions: Transaction[]
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const accountIcons = {
  checking: Landmark,
  savings: PiggyBank,
  credit: CreditCard,
  investment: LineChart,
} as const

export function AccountOverview({ accounts }: AccountOverviewProps) {
  return (
    <SectionCard
      title="Accounts"
      description="A unified view of cash, credit and investments"
      contentClassName="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {accounts.map((account) => {
        const Icon = accountIcons[account.kind]
        return (
          <article
            key={account.id}
            className="rounded-2xl border border-border/70 bg-secondary/20 p-4 transition-colors hover:border-white/10 hover:bg-secondary/30"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-indigo-300">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span
                className={`text-xs font-medium ${
                  account.changePercent >= 0
                    ? "text-emerald-300"
                    : "text-amber-300"
                }`}
              >
                {account.changePercent >= 0 ? "+" : ""}
                {account.changePercent}%
              </span>
            </div>
            <p className="mt-4 truncate text-sm font-medium text-foreground">
              {account.name}
            </p>
            <p className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground">
              {currency.format(account.balance)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {account.institution} ·••{account.lastFour}
            </p>
          </article>
        )
      })}
    </SectionCard>
  )
}

export function FinanceDetails({
  bills,
  budgets,
  debts,
  transactions,
}: FinanceDetailsProps) {
  const sessionSpending = new Map<string, number>()
  transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.date.startsWith("2026-07"),
    )
    .forEach((transaction) => {
      sessionSpending.set(
        transaction.category,
        (sessionSpending.get(transaction.category) ?? 0) + transaction.amount,
      )
    })

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <SectionCard
        title="Budget health"
        description="July category limits"
        className="xl:col-span-1"
        contentClassName="space-y-4"
      >
        {budgets.slice(0, 7).map((budget) => {
          const spent = sessionSpending.get(budget.category) ?? 0
          const percentage = Math.min((spent / budget.allocated) * 100, 100)
          const isOver = spent > budget.allocated
          return (
            <div key={budget.category} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">
                  {budget.category}
                </span>
                <span
                  className={isOver ? "text-red-300" : "text-muted-foreground"}
                >
                  {currency.format(spent)} / {currency.format(budget.allocated)}
                </span>
              </div>
              <Progress
                value={percentage}
                className={
                  isOver ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"
                }
                aria-label={`${budget.category} budget ${Math.round(percentage)} percent used`}
              />
            </div>
          )
        })}
      </SectionCard>

      <SectionCard
        title="Upcoming bills"
        description="Next 14 days"
        className="xl:col-span-1"
        contentClassName="space-y-2"
      >
        {bills.map((bill) => {
          const days = differenceInCalendarDays(
            parseISO(bill.dueDate),
            parseISO("2026-07-12"),
          )
          return (
            <article
              key={bill.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-amber-300">
                <CalendarClock className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {bill.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {format(parseISO(bill.dueDate), "MMM d")} ·{" "}
                  {days === 0 ? "Today" : `in ${days} days`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {currency.format(bill.amount)}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {bill.autopay ? "Autopay" : "Manual"}
                </p>
              </div>
            </article>
          )
        })}
        <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-indigo-300" aria-hidden="true" />3
          of 4 bills are protected by autopay.
        </div>
      </SectionCard>

      <SectionCard
        title="Debt repayment"
        description="Principal reduction progress"
        className="xl:col-span-1"
        contentClassName="space-y-5"
      >
        {debts.map((debt) => {
          const paidPercent =
            ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100
          return (
            <article key={debt.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-red-300">
                    {debt.name.includes("card") ? (
                      <CreditCard className="size-4" aria-hidden="true" />
                    ) : (
                      <Building2 className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {debt.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {debt.apr}% APR
                    </p>
                  </div>
                </div>
                <StatusBadge tone={debt.apr > 10 ? "warning" : "info"}>
                  {currency.format(debt.balance)}
                </StatusBadge>
              </div>
              <Progress
                value={paidPercent}
                aria-label={`${debt.name} ${Math.round(paidPercent)} percent repaid`}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{Math.round(paidPercent)}% repaid</span>
                <span>Next {currency.format(debt.minimumPayment)}</span>
              </div>
            </article>
          )
        })}
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/20 p-3 text-xs text-muted-foreground">
          <ReceiptText className="size-4 text-indigo-300" aria-hidden="true" />
          Paying the card statement first reduces the highest APR balance.
        </div>
      </SectionCard>
    </div>
  )
}
