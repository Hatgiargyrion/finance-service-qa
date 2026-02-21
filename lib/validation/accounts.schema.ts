import { z } from "zod";

export const AccountTypeEnum = z.enum(["CHECKING", "SAVINGS", "CREDIT"]);

export const CreateAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: AccountTypeEnum,
  balance_cents: z.number().int().nonnegative().optional(),
});

export const UpdateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  type: AccountTypeEnum.optional(),
  balance_cents: z.number().int().nonnegative().optional(),
});