-- ENABLE RLS
alter table accounts enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;

-- ACCOUNTS POLICY
create policy "users manage own accounts"
on accounts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- CATEGORIES POLICY
create policy "users manage own categories"
on categories
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- TRANSACTIONS POLICY
create policy "users manage own transactions"
on transactions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);