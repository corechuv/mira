insert into public.products (slug, title, short, price, currency, stock, active, brand, images, category_id)
values
('mira-cleanser', 'Mira Gentle Cleanser', 'Нежное очищение для чувствительной кожи.', 19.90, 'EUR', 50, true, 'Mira', '["https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1200&auto=format&fit=crop"]', (select id from public.categories order by created_at limit 1)),
('mira-serum', 'Mira Vitamin C Serum 10%', 'Сияние и тонус благодаря стабильной форме Vit C.', 29.90, 'EUR', 40, true, 'Mira', '["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop"]', (select id from public.categories order by created_at limit 1)),
('mira-cream', 'Mira Hydrating Cream', 'Глубокое увлажнение без липкости. Подходит днём и ночью.', 24.90, 'EUR', 70, true, 'Mira', '["https://images.unsplash.com/photo-1585238342028-4bbc0b2403b7?q=80&w=1200&auto=format&fit=crop"]', (select id from public.categories order by created_at limit 1))
on conflict (slug) do nothing;
