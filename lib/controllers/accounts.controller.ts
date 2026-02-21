import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  CreateAccountSchema,
  UpdateAccountSchema,
} from "@/lib/validation/accounts.schema";

function createSupabase(req: Request) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    }
  );
}

// CREATE
export async function createAccount(req: Request, body: unknown) {
  const parseResult = CreateAccountSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: parseResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const data = parseResult.data;
  const supabase = createSupabase(req);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: inserted, error } = await supabase
    .from("accounts")
    .insert({
      user_id: user.id,
      name: data.name,
      type: data.type,
      balance_cents: data.balance_cents ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(inserted, { status: 201 });
}

// LIST
export async function listAccounts(req: Request) {
  const supabase = createSupabase(req);

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const active = searchParams.get("active");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("accounts")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (active !== null) {
    query = query.eq("active", active === "true");
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: count ? Math.ceil(count / limit) : 0,
    },
  });
}

// UPDATE
export async function updateAccount(
  req: Request,
  id: string,
  body: unknown
) {
  const parseResult = UpdateAccountSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: parseResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const data = parseResult.data;
  const supabase = createSupabase(req);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: updated, error } = await supabase
    .from("accounts")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(updated);
}

// DELETE (soft delete)
export async function deleteAccount(req: Request, id: string) {
  const supabase = createSupabase(req);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("accounts")
    .update({ active: false })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Account deleted" });
}