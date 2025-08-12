-- Таблица категорий (дерево через parent_id)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references public.categories(id) on delete cascade,
  sort int default 0
);

-- Индексы
create index if not exists categories_parent_idx on public.categories(parent_id, sort, name);

-- Включаем RLS и разрешаем читать всем (anon)
alter table public.categories enable row level security;
drop policy if exists categories_select_all on public.categories;
create policy categories_select_all on public.categories
for select using (true);

-- (пример) ДАННЫЕ: 3 уровня
-- L1
insert into public.categories (slug, name, sort) values
 ('skincare','Уход за кожей',1),
 ('makeup','Макияж',2),
 ('haircare','Волосы',3)
on conflict(slug) do nothing;

-- L2
with l1 as (select slug,id from public.categories where parent_id is null)
insert into public.categories (slug,name,parent_id,sort) values
 ('cleansers','Очищение',(select id from l1 where slug='skincare'),1),
 ('serums','Сыворотки',(select id from l1 where slug='skincare'),2),
 ('spf','SPF',(select id from l1 where slug='skincare'),3),
 ('lips','Губы',(select id from l1 where slug='makeup'),1),
 ('eyes','Глаза',(select id from l1 where slug='makeup'),2),
 ('face','Лицо',(select id from l1 where slug='makeup'),3),
 ('shampoo','Шампуни',(select id from l1 where slug='haircare'),1),
 ('conditioner','Кондиционеры',(select id from l1 where slug='haircare'),2),
 ('masks','Маски',(select id from l1 where slug='haircare'),3)
on conflict(slug) do nothing;

-- L3 (примеры)
with l2 as (select slug,id from public.categories where parent_id is not null)
insert into public.categories (slug,name,parent_id,sort) values
 ('gel','Гели',(select id from l2 where slug='cleansers'),1),
 ('foam','Пенки',(select id from l2 where slug='cleansers'),2),
 ('oil','Масла',(select id from l2 where slug='cleansers'),3),
 ('ha','Гиалуроновые',(select id from l2 where slug='serums'),1),
 ('niacinamide','С ниацинамидом',(select id from l2 where slug='serums'),2),
 ('vitc','С витамином C',(select id from l2 where slug='serums'),3),
 ('matte','Матовые',(select id from l2 where slug='lips'),1),
 ('gloss','Блески',(select id from l2 where slug='lips'),2),
 ('volumizing','Для объёма',(select id from l2 where slug='shampoo'),1),
 ('repair','Восстановление',(select id from l2 where slug='masks'),2)
on conflict(slug) do nothing;
