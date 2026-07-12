import { useEffect, useState } from "react"

import { financeService } from "@/services/finance"
import type {
  Bill,
  BudgetCategory,
  DebtAccount,
  FinanceAccount,
  SpendingTrendPoint,
} from "@/types/finance"

interface FinanceDashboardReferenceData {
  accounts: FinanceAccount[]
  budgets: BudgetCategory[]
  bills: Bill[]
  spendingTrend: SpendingTrendPoint[]
  debts: DebtAccount[]
}

export function useFinanceDashboard() {
  const [data, setData] = useState<FinanceDashboardReferenceData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setError(null)
    try {
      const [accounts, budgets, bills, trend, debts] = await Promise.all([
        financeService.getAccounts(),
        financeService.getBudgets(),
        financeService.getUpcomingBills(),
        financeService.getSpendingTrend(),
        financeService.getDebtAccounts(),
      ])
      setData({ accounts, budgets, bills, spendingTrend: trend, debts })
    } catch {
      setError("Finance data could not be loaded.")
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return { data, error, reload: load }
}
