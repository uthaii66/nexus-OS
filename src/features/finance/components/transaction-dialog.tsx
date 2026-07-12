import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  transactionSchema,
  type TransactionFormValues,
} from "@/features/finance/schemas/transaction-schema";
import { useFinanceStore } from "@/store/finance-store";
import { transactionCategories, type Transaction } from "@/types/finance";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  defaultType?: "income" | "expense";
}

const accounts = [
  "Everyday checking",
  "High-yield savings",
  "Venture card",
  "Core portfolio",
];

const getDefaultValues = (
  transaction?: Transaction | null,
  defaultType: "income" | "expense" = "expense",
): TransactionFormValues => ({
  description: transaction?.description ?? "",
  merchant: transaction?.merchant ?? "",
  amount: transaction?.amount ?? 0,
  type: transaction?.type ?? defaultType,
  category:
    transaction?.category ?? (defaultType === "income" ? "Income" : "Other"),
  date: transaction?.date ?? "2026-07-12",
  account: transaction?.account ?? "Everyday checking",
  recurring: transaction?.recurring ?? false,
  note: transaction?.note ?? "",
});

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="text-xs text-red-300" role="alert">
      {message}
    </p>
  ) : null;
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  defaultType = "expense",
}: TransactionDialogProps) {
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const isEditing = Boolean(transaction);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaultValues(transaction, defaultType),
  });

  useEffect(() => {
    if (open) reset(getDefaultValues(transaction, defaultType));
  }, [defaultType, open, reset, transaction]);

  const onSubmit = (values: TransactionFormValues) => {
    const cleanValues = {
      ...values,
      merchant: values.merchant || undefined,
      note: values.note || undefined,
    };
    if (transaction) {
      updateTransaction(transaction.id, cleanValues);
      toast.success("Transaction updated");
    } else {
      addTransaction(cleanValues);
      toast.success(
        values.type === "income" ? "Income added" : "Expense added",
      );
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit transaction" : "Add transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the transaction details for this session."
              : "Record income or spending. Your dashboard updates immediately."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="transaction-description">Description</Label>
              <Input
                id="transaction-description"
                placeholder="e.g. Weekly groceries"
                aria-invalid={Boolean(errors.description)}
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value: "income" | "expense") => {
                      field.onChange(value);
                      if (value === "income") setValue("category", "Income");
                    }}
                  >
                    <SelectTrigger aria-label="Transaction type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-amount">Amount</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="transaction-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-7"
                  aria-invalid={Boolean(errors.amount)}
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>
              <FieldError message={errors.amount?.message} />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-label="Transaction category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-date">Date</Label>
              <Input
                id="transaction-date"
                type="date"
                aria-invalid={Boolean(errors.date)}
                {...register("date")}
              />
              <FieldError message={errors.date?.message} />
            </div>

            <div className="space-y-2">
              <Label>Account</Label>
              <Controller
                control={control}
                name="account"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-label="Account">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account} value={account}>
                          {account}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-merchant">Merchant or source</Label>
              <Input
                id="transaction-merchant"
                placeholder="Optional"
                {...register("merchant")}
              />
              <FieldError message={errors.merchant?.message} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="transaction-note">Note</Label>
              <Textarea
                id="transaction-note"
                rows={2}
                placeholder="Optional context"
                {...register("note")}
              />
              <FieldError message={errors.note?.message} />
            </div>
          </div>

          <Controller
            control={control}
            name="recurring"
            render={({ field }) => (
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/25 p-3">
                <Checkbox
                  id="transaction-recurring"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="transaction-recurring"
                    className="cursor-pointer"
                  >
                    Recurring transaction
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Mark this as an expense or income that repeats regularly.
                  </p>
                </div>
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Save changes" : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
