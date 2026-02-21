import {
  updateAccount,
  deleteAccount,
} from "@/lib/controllers/accounts.controller";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  return updateAccount(req, id, body);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return deleteAccount(req, id);
}