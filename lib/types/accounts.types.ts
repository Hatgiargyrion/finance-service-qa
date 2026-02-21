export type AccountType = "CHECKING" | "SAVINGS" | "CREDIT";

export interface CreateAccountDTO {
  name: string;
  type: AccountType;
  balance_cents?: number;
}

export interface UpdateAccountDTO {
  name?: string;
  type?: AccountType;
  balance_cents?: number;
}