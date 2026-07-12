import { z } from "zod";

import { transactionCategories } from "@/types/finance";

export const transactionSchema = z.object({
  description: z.string().trim().min(2, "Enter a clear description").max(80),
  merchant: z.string().trim().max(80).optional(),
  amount: z
    .number({ invalid_type_error: "Enter an amount" })
    .positive("Amount must be above zero"),
  type: z.enum(["income", "expense"]),
  category: z.enum(transactionCategories),
  date: z.string().min(1, "Choose a date"),
  account: z.string().trim().min(1, "Choose an account"),
  recurring: z.boolean(),
  note: z.string().trim().max(240).optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
