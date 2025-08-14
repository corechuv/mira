-- ===========================
-- MIRA: RESET + SEED (EUR)
-- Идемпотентно, без изменения структуры (только данные)
-- Запускать в Supabase → SQL Editor
-- ===========================
create extension if not exists pgcrypto;

-- 0) Очистка данных (без дропа таблиц/политик)
truncate table public.reviews cascade;
truncate table public.orders cascade;
truncate table public.products cascade;
truncate table public.categories cascade;

-- 1) Категории (3 уровня)
-- РОДИТЕЛИ
insert into public.categories (name, slug, parent_id, sort) values
 ('Pflege','pflege',null,1),
 ('Make-up','make-up',null,2),
 ('Haarpflege','haar',null,3),
 ('Duft','duft',null,4),
 ('Männer','maenner',null,5),
 ('Tools & Zubehör','tools',null,6),
 ('Geschenke','geschenke',null,7)
on conflict (slug) do nothing;

-- ДЕТИ Pflege
insert into public.categories (name, slug, parent_id, sort)
select x.name, x.slug, p.id, x.sort
from (values
 ('Hautpflege','hautpflege',1),
 ('Körperpflege','koerperpflege',2),
 ('Sonnenpflege','sonnenpflege',3),
 ('Reinigung','reinigung',4),
 ('Seren','seren',5),
 ('Masken','masken',6)
) x(name,slug,sort),
 (select id from public.categories where slug='pflege') p
on conflict (slug) do nothing;

-- ДЕТИ Make-up
insert into public.categories (name, slug, parent_id, sort)
select x.name, x.slug, p.id, x.sort
from (values
 ('Teint','teint',1),
 ('Lippen','lippen',2),
 ('Augen','augen',3),
 ('Pinsel','pinsel',4)
) x(name,slug,sort),
 (select id from public.categories where slug='make-up') p
on conflict (slug) do nothing;

-- ДЕТИ Haar
insert into public.categories (name, slug, parent_id, sort)
select x.name, x.slug, p.id, x.sort
from (values
 ('Shampoo','shampoo',1),
 ('Conditioner','conditioner',2),
 ('Styling','styling',3),
 ('Pflege','haarpflege-pflege',4)
) x(name,slug,sort),
 (select id from public.categories where slug='haar') p
on conflict (slug) do nothing;

-- ДЕТИ Duft
insert into public.categories (name, slug, parent_id, sort)
select x.name, x.slug, p.id, x.sort
from (values
 ('Eau de Parfum','edp',1),
 ('Eau de Toilette','edt',2),
 ('Home','home-duft',3)
) x(name,slug,sort),
 (select id from public.categories where slug='duft') p
on conflict (slug) do nothing;

-- ВНУТРЕННИЕ (3-й уровень, для примера)
insert into public.categories (name, slug, parent_id, sort)
select 'Gesichtsreinigung','gesichtsreinigung', id, 1 from public.categories where slug='reinigung'
on conflict (slug) do nothing;
insert into public.categories (name, slug, parent_id, sort)
select 'Seren mit Vitamin C','seren-vitc', id, 1 from public.categories where slug='seren'
on conflict (slug) do nothing;

-- 2) Товары (EUR, активные, с картинками и спеками)
-- Размножим по подкатегориям (второй/третий уровень)
with cat as (
  select id, slug from public.categories where parent_id is not null
),
gen as (
  select c.id as category_id, c.slug, g as n
  from cat c
  cross join generate_series(1,4) as g
),
ins as (
  insert into public.products (slug, title, short, price, currency, stock, active, brand, images, specs, category_id)
  select
    (slug||'-'||n) as pslug,
    initcap(replace(slug,'-',' '))||' #'||n as title,
    'Beispielprodukt für Kategorie '||slug||'. Hochwertige Pflege/Make-up in EUR.' as short,
    round((random()*60 + 7)::numeric, 2) as price,
    'EUR',
    (15 + floor(random()*50))::int as stock,
    true,
    (array['Mira','Dermix','PureGlow','Aromatique','SkinLab','Douglas'])[1 + floor(random()*6)::int] as brand,
    jsonb_build_array(
      -- 1–2 изображения
      'https://images.unsplash.com/photo-1585238342028-4bbc0b2403b7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop'
    ) as images,
    jsonb_build_object(
      'skin_type', (array['dry','oily','combination','sensitive','all'])[1+floor(random()*5)::int],
      'volume_ml', (array[30,50,75,100,150,200])[1+floor(random()*6)::int],
      'variant', (array['Light','Medium','Dark','Neutral','Rose','Amber'])[1+floor(random()*6)::int]
    ) as specs,
    category_id
  from gen
  returning id, slug
)
select count(*) as seeded_products from ins;

-- 3) Отзывы (approved/pending), по 0–3 на товар
do $$
declare
  uid uuid;
begin
  -- возьмём первого пользователя из auth.users, если есть (для FK)
  select id into uid from auth.users order by created_at limit 1;
  if uid is null then
    -- fallback: создаём фиктивного через вставку в profiles невозможно, нужен auth.users.
    -- Тогда запишем user_id = null, если в вашей схеме FK обязателен, пропустим вставку.
    raise notice 'Нет пользователей в auth.users — отзывы будут без вставки.';
  else
    insert into public.reviews (product_id, user_id, rating, text, status)
    select p.id, uid,
           3 + floor(random()*3)::int,
           'Sehr gutes Produkt. Empfehlung! ('||p.slug||')',
           (array['approved','approved','pending'])[1+floor(random()*3)::int]
    from public.products p
    where random() < 0.6; -- ~60% продуктов с отзывами
  end if;
end $$;

-- 4) Заказы (paid), 6 штук с агрегированными items
with pick as (
  select id, title, price from public.products order by random() limit 18
),
grp as (
  select *, (row_number() over () - 1) / 3 as grp from pick
),
o as (
  select
    'MIRA-'||upper(substring(replace(gen_random_uuid()::text,'-','') for 10)) as id,
    jsonb_agg(jsonb_build_object('title', title, 'price', price, 'qty', (1+floor(random()*2))::int)) as items
  from grp
  group by grp
)
insert into public.orders(id, items, amount, currency, contact, shipping, status, ext_id)
select
  o.id,
  o.items,
  (select sum(((e->>'price')::numeric) * ((e->>'qty')::int)) from jsonb_array_elements(o.items) e) as amount,
  'EUR',
  jsonb_build_object('name','Demo Käufer','email','buyer@example.com','phone','+49 30 000000'),
  jsonb_build_object('method','standard','address','Berlin, DE'),
  'paid',
  'cs_test_'||substr(replace(gen_random_uuid()::text,'-',''),1,14)
from o;

-- 5) Итог
notify pgrst, 'reload schema';
