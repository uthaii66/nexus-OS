import {
  debtAccounts,
  financeAccounts,
  financeBudgets,
  financeSummary,
  financeTransactions,
  spendingTrend,
  upcomingBills,
} from "@/data/mock/finance";
import type { FinanceService } from "@/services/finance/finance-service";
import type {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "@/types/finance";

const clone = <T>(value: T): T => structuredClone(value);

const createTransactionId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `txn-${crypto.randomUUID()}`
    : `txn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export class MockFinanceService implements FinanceService {
  private transactions = clone(financeTransactions);

  async getTransactions() {
    return clone(this.transactions);
  }

  async createTransaction(input: CreateTransactionInput) {
    const transaction: Transaction = {
      ...input,
      id: createTransactionId(),
      createdAt: new Date().toISOString(),
    };
    this.transactions = [transaction, ...this.transactions];
    return clone(transaction);
  }

  async updateTransaction(id: string, input: UpdateTransactionInput) {
    const existing = this.transactions.find(
      (transaction) => transaction.id === id,
    );
    if (!existing) throw new Error("Transaction not found");

    const updated: Transaction = { ...existing, ...input };
    this.transactions = this.transactions.map((transaction) =>
      transaction.id === id ? updated : transaction,
    );
    return clone(updated);
  }

  async deleteTransaction(id: string) {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== id,
    );
  }

  async getFinanceSummary() {
    return clone(financeSummary);
  }

  async getAccounts() {
    return clone(financeAccounts);
  }

  async getBudgets() {
    return clone(financeBudgets);
  }

  async getUpcomingBills() {
    return clone(upcomingBills);
  }

  async getSpendingTrend() {
    return clone(spendingTrend);
  }

  async getDebtAccounts() {
    return clone(debtAccounts);
  }
}

export const financeService: FinanceService = new MockFinanceService();
