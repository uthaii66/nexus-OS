export const transactionCategories = [
  "Income",
  "Housing",
  "Groceries",
  "Dining",
  "Transport",
  "Utilities",
  "Health",
  "Learning",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "Travel",
  "Transfer",
  "Other",
] as const;

export type TransactionCategory = (typeof transactionCategories)[number];
export type TransactionType = "income" | "expense";
export type AccountKind = "checking" | "savings" | "credit" | "investment";

export interface Transaction {
  id: string;
  description: string;
  merchant?: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  account: string;
  recurring: boolean;
  note?: string;
  createdAt: string;
}

export type CreateTransactionInput = Omit<Transaction, "id" | "createdAt">;
export type UpdateTransactionInput = Partial<CreateTransactionInput>;

export interface FinanceAccount {
  id: string;
  name: string;
  kind: AccountKind;
  balance: number;
  institution: string;
  lastFour: string;
  changePercent: number;
}

export interface FinanceSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  totalDebt: number;
  budgetRemaining: number;
  monthlyBudget: number;
  savingsRate: number;
  balanceChangePercent: number;
}

export interface BudgetCategory {
  category: TransactionCategory;
  allocated: number;
  spent: number;
  color: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: TransactionCategory;
  account: string;
  autopay: boolean;
  status: "scheduled" | "due-soon" | "paid";
}

export interface SpendingTrendPoint {
  month: string;
  spending: number;
  budget: number;
  income: number;
}

export interface DebtAccount {
  id: string;
  name: string;
  balance: number;
  originalBalance: number;
  apr: number;
  minimumPayment: number;
  nextPaymentDate: string;
}

export interface FinanceDashboardData {
  summary: FinanceSummary;
  accounts: FinanceAccount[];
  transactions: Transaction[];
  budgets: BudgetCategory[];
  bills: Bill[];
  spendingTrend: SpendingTrendPoint[];
  debts: DebtAccount[];
}

export interface TransactionFilters {
  query: string;
  category: TransactionCategory | "all";
  type: TransactionType | "all";
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
}

export interface DebtTrackerItem {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  completionPercent: number;
  status: "active" | "completed";
  note?: string;
}

export interface HomeContribution {
  id: string;
  year: number;
  month: string;
  emi: number;
  amountGiven: number;
  actualHomeAmount: number;
}

export interface SavingsAllocation {
  id: string;
  month: string;
  auraGold: number;
  tanishqGold: number;
  chitFund: number;
  mutualFund: number;
  rdIcici: number;
  totalSavings: number;
  remarks?: string;
}
