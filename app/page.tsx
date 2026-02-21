"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const [accounts, setAccounts] = useState<any[]>([]);

  async function login(email: string) {
    await supabase.auth.signInWithPassword({
      email,
      password: "123456",
    });
  }

  async function createAccount() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    await supabase.from("accounts").insert({
      user_id: user.id,
      name: "Conta Teste",
      type: "wallet",
      balance_cents: 1000,
    });

    loadAccounts();
  }

  async function loadAccounts() {
    const { data } = await supabase.from("accounts").select("*");
    setAccounts(data || []);
  }

  return (
    <div>
      <h1>RLS Test</h1>
      <button onClick={() => login("userA@test.com")}>Login A</button>
      <button onClick={() => login("userB@test.com")}>Login B</button>
      <button onClick={createAccount}>Criar Conta</button>
      <button onClick={loadAccounts}>Carregar Contas</button>

      <pre>{JSON.stringify(accounts, null, 2)}</pre>
    </div>
  );
}