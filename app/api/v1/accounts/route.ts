import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const supabase = createClient(
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

    const body = await req.json();
    const { name, type, balance_cents } = body;

    // Basic validation
    if (!name || !type) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { data, error } = await supabase
        .from("accounts")
        .insert({
            user_id: user.id,
            name,
            type,
            balance_cents: balance_cents ?? 0,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
}

export async function GET(req: Request) {
    const supabase = createClient(
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