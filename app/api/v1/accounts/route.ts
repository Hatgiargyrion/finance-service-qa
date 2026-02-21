import {
  createAccount,
  listAccounts,
} from "@/lib/controllers/accounts.controller";

export async function POST(req: Request) {
  const body = await req.json();
  return createAccount(req, body);
}

export async function GET(req: Request) {
  return listAccounts(req);
}