import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json(
            { error: "Missing account id" },
            { status: 400 }
        );
    }

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

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, balance_cents, active } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (balance_cents !== undefined) updateData.balance_cents = balance_cents;
    if (active !== undefined) updateData.active = active;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
            { error: "No valid fields to update" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("accounts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json(
            { error: "Missing account id" },
            { status: 400 }
        );
    }

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

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("accounts")
        .update({ active: false })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
}