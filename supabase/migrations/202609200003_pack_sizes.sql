-- Stores sell whole packs, not portions. `price` stays the price per `unit`
-- (per kg, per litre, per can, ...). `pack_size` is how many of that unit are
-- in the pack you actually buy, so pack price = price * pack_size.
-- Pack sizes are typical SA retail sizes and are estimates, like the prices.
alter table public.ingredients
  add column if not exists pack_size numeric(8, 3) not null default 1,
  add column if not exists pack_label text;

alter table public.ingredients
  drop constraint if exists ingredients_pack_size_positive;
alter table public.ingredients
  add constraint ingredients_pack_size_positive check (pack_size > 0);

update public.ingredients i
set pack_size = v.pack_size, pack_label = v.pack_label
from (values
  ('Eggs',            1,   'Dozen eggs'),
  ('Milk',            1,   '1 L milk'),
  ('Bread',           1,   'Loaf (700 g)'),
  ('Chicken Breast',  1,   '1 kg pack'),
  ('Rice',            1,   '1 kg bag'),
  ('Black Beans',     1,   'Can (410 g)'),
  ('Frozen Broccoli', 1,   'Bag (500 g)'),
  ('Pasta',           1,   'Packet (500 g)'),
  ('Tomato Sauce',    1,   'Jar (400 g)'),
  ('Cheddar Cheese',  1,   'Block (400 g)'),
  ('Peanut Butter',   1,   'Jar (400 g)'),
  ('Bananas',         1,   '1 kg bunch'),
  ('Oats',            1,   'Box (500 g)'),
  ('Beef Mince',      0.5, '500 g pack'),
  ('Onion',           1,   '1 kg bag'),
  ('Spinach',         1,   'Bag (200 g)'),
  ('Tomato',          0.5, '500 g punnet'),
  ('Tuna',            1,   'Can (170 g)'),
  ('Beef Steak',      0.5, '500 g pack'),
  ('Sweet Potato',    1,   '1 kg bag'),
  ('Salmon',          0.4, '400 g pack'),
  ('Greek Yogurt',    1,   'Tub (500 g)')
) as v(name, pack_size, pack_label)
where i.name = v.name;
