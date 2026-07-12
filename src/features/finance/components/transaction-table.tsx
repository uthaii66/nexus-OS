import { useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import {
  CalendarDays,
  Pencil,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { ConfirmationDialog } from "@/components/common/confirmation-dialog"
import { DataTable, type DataTableColumn } from "@/components/common/data-table"
import { EmptyState } from "@/components/common/empty-state"
import { FilterBar } from "@/components/common/filter-bar"
import { SearchInput } from "@/components/common/search-input"
import { SectionCard } from "@/components/common/section-card"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFinanceStore } from "@/store/finance-store"
import {
  transactionCategories,
  type Transaction,
  type TransactionCategory,
  type TransactionFilters,
  type TransactionType,
} from "@/types/finance"

interface TransactionTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onAdd: () => void
}

const initialFilters: TransactionFilters = {
  query: "",
  category: "all",
  type: "all",
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

export function TransactionTable({
  transactions,
  onEdit,
  onAdd,
}: TransactionTableProps) {
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null)
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction)
  const toggleRecurring = useFinanceStore((state) => state.toggleRecurring)

  const filteredTransactions = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const minAmount = filters.minAmount ? Number(filters.minAmount) : null
    const maxAmount = filters.maxAmount ? Number(filters.maxAmount) : null

    return transactions
      .filter((transaction) => {
        const matchesQuery =
          !query ||
          transaction.description.toLowerCase().includes(query) ||
          transaction.merchant?.toLowerCase().includes(query) ||
          transaction.account.toLowerCase().includes(query)
        const matchesCategory =
          filters.category === "all" ||
          transaction.category === filters.category
        const matchesType =
          filters.type === "all" || transaction.type === filters.type
        const matchesFrom =
          !filters.dateFrom || transaction.date >= filters.dateFrom
        const matchesTo = !filters.dateTo || transaction.date <= filters.dateTo
        const matchesMin = minAmount === null || transaction.amount >= minAmount
        const matchesMax = maxAmount === null || transaction.amount <= maxAmount
        return (
          matchesQuery &&
          matchesCategory &&
          matchesType &&
          matchesFrom &&
          matchesTo &&
          matchesMin &&
          matchesMax
        )
      })
      .sort((left, right) => right.date.localeCompare(left.date))
  }, [filters, transactions])

  const columns: DataTableColumn<Transaction>[] = [
    {
      id: "transaction",
      header: "Transaction",
      cell: (transaction) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-foreground">
            {transaction.description}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {transaction.merchant ?? transaction.account}
          </p>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: (transaction) => (
        <StatusBadge tone="neutral">{transaction.category}</StatusBadge>
      ),
    },
    {
      id: "date",
      header: "Date",
      cell: (transaction) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {format(parseISO(transaction.date), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "recurring",
      header: "Repeat",
      cell: (transaction) => (
        <Button
          variant="ghost"
          size="sm"
          className={
            transaction.recurring ? "text-indigo-300" : "text-muted-foreground"
          }
          onClick={() => {
            toggleRecurring(transaction.id)
            toast.success(
              transaction.recurring
                ? "Recurring status removed"
                : "Marked recurring",
            )
          }}
          aria-label={`${transaction.recurring ? "Remove" : "Mark"} recurring status for ${transaction.description}`}
        >
          <RefreshCw className="size-3.5" />
          {transaction.recurring ? "Yes" : "No"}
        </Button>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      className: "text-right",
      cell: (transaction) => (
        <p
          className={`whitespace-nowrap text-right font-semibold tabular-nums ${
            transaction.type === "income"
              ? "text-emerald-300"
              : "text-foreground"
          }`}
        >
          {transaction.type === "income" ? "+" : "−"}
          {currency.format(transaction.amount)}
        </p>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (transaction) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${transaction.description}`}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hover:text-red-300"
            onClick={() => setPendingDelete(transaction)}
            aria-label={`Delete ${transaction.description}`}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ]

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== "" && filter !== "all",
  )

  return (
    <>
      <SectionCard
        title="Recent transactions"
        description={`${filteredTransactions.length} of ${transactions.length} transactions shown`}
        action={
          <Button size="sm" onClick={onAdd}>
            <Plus /> Add
          </Button>
        }
        contentClassName="space-y-4 px-0 pb-0 sm:px-0"
      >
        <div className="px-5 sm:px-6">
          <FilterBar>
            <SearchInput
              value={filters.query}
              onChange={(query) =>
                setFilters((current) => ({ ...current, query }))
              }
              placeholder="Search transactions"
              className="flex-1 sm:min-w-64"
            />
            <Select
              value={filters.category}
              onValueChange={(category: TransactionCategory | "all") =>
                setFilters((current) => ({ ...current, category }))
              }
            >
              <SelectTrigger
                className="sm:w-40"
                aria-label="Filter by category"
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {transactionCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.type}
              onValueChange={(type: TransactionType | "all") =>
                setFilters((current) => ({ ...current, type }))
              }
            >
              <SelectTrigger
                className="sm:w-36"
                aria-label="Filter by transaction type"
              >
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant={filtersExpanded ? "secondary" : "outline"}
              onClick={() => setFiltersExpanded((expanded) => !expanded)}
              aria-expanded={filtersExpanded}
            >
              <SlidersHorizontal /> More
            </Button>
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFilters(initialFilters)}
              >
                Clear
              </Button>
            ) : null}

            {filtersExpanded ? (
              <div className="grid w-full gap-2 border-t border-border/60 pt-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        dateFrom: event.target.value,
                      }))
                    }
                    className="pl-9"
                    aria-label="Transactions from date"
                  />
                </div>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      dateTo: event.target.value,
                    }))
                  }
                  aria-label="Transactions through date"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Minimum amount"
                  value={filters.minAmount}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      minAmount: event.target.value,
                    }))
                  }
                  aria-label="Minimum transaction amount"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Maximum amount"
                  value={filters.maxAmount}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      maxAmount: event.target.value,
                    }))
                  }
                  aria-label="Maximum transaction amount"
                />
              </div>
            ) : null}
          </FilterBar>
        </div>

        <DataTable
          data={filteredTransactions}
          columns={columns}
          getRowId={(transaction) => transaction.id}
          empty={
            <div className="px-5 pb-6 sm:px-6">
              <EmptyState
                icon={SlidersHorizontal}
                title="No matching transactions"
                description="Adjust the filters or add a new transaction."
                action={
                  <Button
                    variant="outline"
                    onClick={() => setFilters(initialFilters)}
                  >
                    Reset filters
                  </Button>
                }
              />
            </div>
          }
        />
      </SectionCard>

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Delete transaction?"
        description={`This removes “${pendingDelete?.description ?? "this transaction"}” from the current session. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return
          deleteTransaction(pendingDelete.id)
          toast.success("Transaction deleted")
          setPendingDelete(null)
        }}
      />
    </>
  )
}
