-- Профили/роли
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'user',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update using (auth.uid() = id);

-- Триггер создания профиля
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row execute procedure public.handle_new_user();

-- ======= Товары =======
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short text,
  price numeric not null check (price>=0),
  currency text not null default 'EUR',
  stock int not null default 0,
  active boolean not null default true,
  brand text,
  images jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

-- read всем
drop policy if exists products_read on public.products;
create policy products_read on public.products
for select using (true);

-- write только admin
drop policy if exists products_write_admin on public.products;
create policy products_write_admin on public.products
for all
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- ======= Категории: select всем, write admin =======
drop policy if exists categories_write_admin on public.categories;
create policy categories_write_admin on public.categories
for all
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- ======= Reviews: модерация admin =======
-- (предполагаем, что таблица public.reviews уже есть: status text default 'pending')
alter table if exists public.reviews enable row level security;

-- читать: approved всем, свои — всегда
drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews
for select using (status='approved' or user_id = auth.uid() or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- писать: создать — авторизованные; менять/удалять — admin
drop policy if exists reviews_insert_user on public.reviews;
create policy reviews_insert_user on public.reviews
for insert with check (auth.uid() = user_id);

drop policy if exists reviews_write_admin on public.reviews;
create policy reviews_write_admin on public.reviews
for all
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- ======= Orders: читать свои, админ — все; менять статусы — админ =======
alter table if exists public.orders enable row level security;

drop policy if exists orders_read on public.orders;
create policy orders_read on public.orders
for select using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

drop policy if exists orders_admin_write on public.orders;
create policy orders_admin_write on public.orders
for all
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
