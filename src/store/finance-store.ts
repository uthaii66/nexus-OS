import { create } from "zustand";

import { financeSummary, financeTransactions } from "@/data/mock/finance";
import type {
  CreateTransactionInput,
  FinanceSummary,
  Transaction,
  UpdateTransactionInput,
} from "@/types/finance";

interface FinanceState {
  transactions: Transaction[];
  addTransaction: (input: CreateTransactionInput) => Transaction;
  updateTransaction: (id: string, input: UpdateTransactionInput) => void;
  deleteTransaction: (id: string) => void;
  toggleRecurring: (id: string) => void;
  resetFinanceSession: () => void;
}

const createTransactionId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `txn-${crypto.randomUUID()}`
    : `txn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const initialTransactions = () =>
  financeTransactions.map((transaction) => ({ ...transaction }));

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: initialTransactions(),
  addTransaction: (input) => {
    const transaction: Transaction = {
      ...input,
      id: createTransactionId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ transactions: [transaction, ...state.transactions] }));
    return transaction;
  },
  updateTransaction: (id, input) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...input } : transaction,
      ),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter(
        (transaction) => transaction.id !== id,
      ),
    })),
  toggleRecurring: (id) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, recurring: !transaction.recurring }
          : transaction,
      ),
    })),
  resetFinanceSession: () => set({ transactions: initialTransactions() }),
}));

export const calculateFinanceSummary = (
  transactions: Transaction[],
): FinanceSummary => {
  const julyTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith("2026-07"),
  );
  const monthlyIncome = julyTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const monthlyExpenses = julyTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense" && transaction.category !== "Transfer",
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
  const initialIncome = financeTransactions
    .filter(
      (transaction) =>
        transaction.date.startsWith("2026-07") && transaction.type === "income",
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
  const initialExpenses = financeTransactions
    .filter(
      (transaction) =>
        transaction.date.startsWith("2026-07") &&
        transaction.type === "expense" &&
        transaction.category !== "Transfer",
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
  const balanceDelta =
    monthlyIncome - initialIncome - (monthlyExpenses - initialExpenses);

  return {
    ...financeSummary,
    totalBalance: financeSummary.totalBalance + balanceDelta,
    monthlyIncome,
    monthlyExpenses,
    budgetRemaining: financeSummary.monthlyBudget - monthlyExpenses,
    savingsRate:
      monthlyIncome > 0
        ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
        : 0,
  };
};

export type { FinanceState };
