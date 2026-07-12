import type {
  Bill,
  BudgetCategory,
  CreateTransactionInput,
  DebtAccount,
  FinanceAccount,
  FinanceSummary,
  SpendingTrendPoint,
  Transaction,
  UpdateTransactionInput,
} from "@/types/finance"

export interface FinanceService {
  getTransactions(): Promise<Transaction[]>
  createTransaction(input: CreateTransactionInput): Promise<Transaction>
  updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction>
  deleteTransaction(id: string): Promise<void>
  getFinanceSummary(): Promise<FinanceSummary>
  getAccounts(): Promise<FinanceAccount[]>
  getBudgets(): Promise<BudgetCategory[]>
  getUpcomingBills(): Promise<Bill[]>
  getSpendingTrend(): Promise<SpendingTrendPoint[]>
  getDebtAccounts(): Promise<DebtAccount[]>
}
