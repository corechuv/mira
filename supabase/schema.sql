-- Запустите в Supabase SQL editor
create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  items jsonb not null,
  amount integer not null,
  currency text not null default 'RUB',
  contact jsonb not null,
  shipping jsonb not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'orders_insert_any') then
    create policy "orders_insert_any" on public.orders for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'orders_select_own') then
    create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
  end if;
end$$;
