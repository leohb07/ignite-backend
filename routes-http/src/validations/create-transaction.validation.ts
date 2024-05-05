import { z } from "zod";

export const createTransactionValidation = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(["debit", "credit"]),
});
