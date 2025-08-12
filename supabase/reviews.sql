create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  user_id uuid null,
  rating int not null check (rating between 1 and 5),
  text text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

-- Любой может вставлять (гости тоже), user_id автоматически подтянется, если есть
drop policy if exists "reviews_insert_any" on public.reviews;
create policy "reviews_insert_any" on public.reviews
  for insert with check (true);

-- Видимость: одобрено всем, свои — всегда
drop policy if exists "reviews_select_approved_or_own" on public.reviews;
create policy "reviews_select_approved_or_own" on public.reviews
  for select using (status = 'approved' or auth.uid() = user_id);

-- Изменять/модерировать — только сервис-роль (через панель) — отдельные политики не добавляем
