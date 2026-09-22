-- New ingredients for South African-inspired recipes (7 items x 6 stores)
insert into public.ingredients (name, unit, category, price, pack_size, pack_label, store) values
  ('Maize Meal', 'kg', 'Grains', 17.99, 2.5, '2.5 kg bag', 'Checkers'),
  ('Carrots', 'kg', 'Produce', 19.99, 1, '1 kg bag', 'Checkers'),
  ('Boerewors', 'kg', 'Meat', 119.99, 0.5, '500 g pack', 'Checkers'),
  ('Curry Powder', 'jar', 'Pantry', 34.99, 1, 'Jar (100 g)', 'Checkers'),
  ('Brown Lentils', 'kg', 'Grains', 29.99, 0.5, '500 g packet', 'Checkers'),
  ('Samp', 'kg', 'Grains', 24.99, 1, '1 kg packet', 'Checkers'),
  ('Peri-Peri Sauce', 'bottle', 'Pantry', 32.99, 1, 'Bottle (250 ml)', 'Checkers'),
  ('Maize Meal', 'kg', 'Grains', 16.99, 2.5, '2.5 kg bag', 'Pick n Pay'),
  ('Carrots', 'kg', 'Produce', 18.99, 1, '1 kg bag', 'Pick n Pay'),
  ('Boerewors', 'kg', 'Meat', 123.99, 0.5, '500 g pack', 'Pick n Pay'),
  ('Curry Powder', 'jar', 'Pantry', 32.99, 1, 'Jar (100 g)', 'Pick n Pay'),
  ('Brown Lentils', 'kg', 'Grains', 27.99, 0.5, '500 g packet', 'Pick n Pay'),
  ('Samp', 'kg', 'Grains', 23.49, 1, '1 kg packet', 'Pick n Pay'),
  ('Peri-Peri Sauce', 'bottle', 'Pantry', 31.99, 1, 'Bottle (250 ml)', 'Pick n Pay'),
  ('Maize Meal', 'kg', 'Grains', 21.99, 2.5, '2.5 kg bag', 'Woolworths'),
  ('Carrots', 'kg', 'Produce', 25.99, 1, '1 kg bag', 'Woolworths'),
  ('Boerewors', 'kg', 'Meat', 149.99, 0.5, '500 g pack', 'Woolworths'),
  ('Curry Powder', 'jar', 'Pantry', 41.99, 1, 'Jar (100 g)', 'Woolworths'),
  ('Brown Lentils', 'kg', 'Grains', 36.99, 0.5, '500 g packet', 'Woolworths'),
  ('Samp', 'kg', 'Grains', 30.99, 1, '1 kg packet', 'Woolworths'),
  ('Peri-Peri Sauce', 'bottle', 'Pantry', 39.99, 1, 'Bottle (250 ml)', 'Woolworths'),
  ('Maize Meal', 'kg', 'Grains', 15.99, 2.5, '2.5 kg bag', 'Shoprite'),
  ('Carrots', 'kg', 'Produce', 17.99, 1, '1 kg bag', 'Shoprite'),
  ('Boerewors', 'kg', 'Meat', 112.99, 0.5, '500 g pack', 'Shoprite'),
  ('Curry Powder', 'jar', 'Pantry', 29.99, 1, 'Jar (100 g)', 'Shoprite'),
  ('Brown Lentils', 'kg', 'Grains', 25.99, 0.5, '500 g packet', 'Shoprite'),
  ('Samp', 'kg', 'Grains', 21.99, 1, '1 kg packet', 'Shoprite'),
  ('Peri-Peri Sauce', 'bottle', 'Pantry', 28.99, 1, 'Bottle (250 ml)', 'Shoprite'),
  ('Maize Meal', 'kg', 'Grains', 18.99, 2.5, '2.5 kg bag', 'Spar'),
  ('Carrots', 'kg', 'Produce', 20.99, 1, '1 kg bag', 'Spar'),
  ('Boerewors', 'kg', 'Meat', 127.99, 0.5, '500 g pack', 'Spar'),
  ('Curry Powder', 'jar', 'Pantry', 35.99, 1, 'Jar (100 g)', 'Spar'),
  ('Brown Lentils', 'kg', 'Grains', 30.99, 0.5, '500 g packet', 'Spar'),
  ('Samp', 'kg', 'Grains', 25.99, 1, '1 kg packet', 'Spar'),
  ('Peri-Peri Sauce', 'bottle', 'Pantry', 33.99, 1, 'Bottle (250 ml)', 'Spar'),
  ('Maize Meal', 'kg', 'Grains', 16.49, 2.5, '2.5 kg bag', 'Food Lover''s Market'),
  ('Carrots', 'kg', 'Produce', 15.99, 1, '1 kg bag', 'Food Lover''s Market'),
  ('Boerewors', 'kg', 'Meat', 116.99, 0.5, '500 g pack', 'Food Lover''s Market'),
  ('Curry Powder', 'jar', 'Pantry', 33.99, 1, 'Jar (100 g)', 'Food Lover''s Market'),
  ('Brown Lentils', 'kg', 'Grains', 28.99, 0.5, '500 g packet', 'Food Lover''s Market'),
  ('Samp', 'kg', 'Grains', 24.49, 1, '1 kg packet', 'Food Lover''s Market'),
  ('Peri-Peri Sauce', 'bottle', 'Pantry', 31.99, 1, 'Bottle (250 ml)', 'Food Lover''s Market');

-- Butternut already fits the existing Produce pattern used for Onion, so it
-- gets the same relative pricing across stores as Onion.
insert into public.ingredients (name, unit, category, price, pack_size, pack_label, store) values
  ('Butternut', 'kg', 'Produce', 17.99, 1, '1 kg', 'Checkers'),
  ('Butternut', 'kg', 'Produce', 16.99, 1, '1 kg', 'Pick n Pay'),
  ('Butternut', 'kg', 'Produce', 22.99, 1, '1 kg', 'Woolworths'),
  ('Butternut', 'kg', 'Produce', 15.99, 1, '1 kg', 'Shoprite'),
  ('Butternut', 'kg', 'Produce', 18.99, 1, '1 kg', 'Spar'),
  ('Butternut', 'kg', 'Produce', 14.99, 1, '1 kg', 'Food Lover''s Market');

-- Nine South African-inspired recipes. Not all strictly traditional, but
-- rooted in SA staples and flavours, and priced to sit alongside the
-- existing recipes so there's a real substitute at every budget level:
--   ~R40-55: Pap & Chakalaka, Lentil Curry & Rice, Samp & Beans, Boerewors
--            Roll (alongside the existing Egg White Veggie Omelette)
--   ~R70-90: Butternut & Chicken Curry, Peri-Peri Chicken & Rice, Curried
--            Mince & Rice, Chicken Mince Stew & Pap, Beef Mince Stew & Pap
--            (alongside the existing Chicken & Rice Bowl, Steak & Sweet
--            Potato)
with rec as (
  insert into public.recipes (name, instructions, prep_time, servings) values
    ('Pap & Chakalaka', 'Cook the maize meal into a stiff pap. For the chakalaka, saute onion and carrots, add tomato, black beans and curry powder, and simmer until thick. Serve alongside the pap.', 30, 4),
    ('Beef Mince Stew & Pap', 'Cook the maize meal into a stiff pap. Brown the mince with onion, add tomato and carrots, and simmer into a stew. Serve over the pap.', 40, 4),
    ('Chicken Mince Stew & Pap', 'Cook the maize meal into a stiff pap. Cook the chicken with onion, add tomato and carrots, and simmer into a stew. Serve over the pap.', 40, 4),
    ('Boerewors Roll', 'Grill or pan-fry the boerewors. Split the bread roll, add the boerewors, grilled onion and tomato sauce.', 15, 2),
    ('Curried Mince & Rice', 'Brown the mince with onion and curry powder, add tomato and simmer. Serve over the rice.', 35, 4),
    ('Lentil Curry & Rice', 'Saute onion and curry powder, add tomato and the lentils with water, and simmer until soft. Serve over the rice.', 30, 4),
    ('Samp & Beans (Umngqusho)', 'Simmer the samp and black beans together with onion until soft and creamy. A traditional, slow-cooked favourite.', 60, 4),
    ('Peri-Peri Chicken & Rice', 'Grill or pan-fry the chicken breast basted with peri-peri sauce. Cook the rice and saute the onion. Serve together.', 30, 4),
    ('Butternut & Chicken Curry', 'Saute onion and curry powder, add the chicken and butternut, and simmer until the chicken is cooked and the butternut is soft. Serve over the rice.', 35, 4)
  returning id, name
)
insert into public.recipe_ingredients (recipe_id, ingredient_id, quantity)
select r.id, i.id, v.quantity
from (values
  ('Pap & Chakalaka', 'Maize Meal', 0.5),
  ('Pap & Chakalaka', 'Tomato', 0.5),
  ('Pap & Chakalaka', 'Onion', 0.3),
  ('Pap & Chakalaka', 'Carrots', 0.3),
  ('Pap & Chakalaka', 'Black Beans', 1),
  ('Pap & Chakalaka', 'Curry Powder', 0.05),

  ('Beef Mince Stew & Pap', 'Beef Mince', 0.5),
  ('Beef Mince Stew & Pap', 'Maize Meal', 0.5),
  ('Beef Mince Stew & Pap', 'Onion', 0.3),
  ('Beef Mince Stew & Pap', 'Tomato', 0.4),
  ('Beef Mince Stew & Pap', 'Carrots', 0.3),

  ('Chicken Mince Stew & Pap', 'Chicken Breast', 0.6),
  ('Chicken Mince Stew & Pap', 'Maize Meal', 0.5),
  ('Chicken Mince Stew & Pap', 'Onion', 0.3),
  ('Chicken Mince Stew & Pap', 'Tomato', 0.4),
  ('Chicken Mince Stew & Pap', 'Carrots', 0.3),

  ('Boerewors Roll', 'Boerewors', 0.3),
  ('Boerewors Roll', 'Bread', 0.3),
  ('Boerewors Roll', 'Onion', 0.2),
  ('Boerewors Roll', 'Tomato Sauce', 0.15),

  ('Curried Mince & Rice', 'Beef Mince', 0.5),
  ('Curried Mince & Rice', 'Onion', 0.3),
  ('Curried Mince & Rice', 'Tomato', 0.3),
  ('Curried Mince & Rice', 'Curry Powder', 0.08),
  ('Curried Mince & Rice', 'Rice', 0.5),

  ('Lentil Curry & Rice', 'Brown Lentils', 0.4),
  ('Lentil Curry & Rice', 'Onion', 0.3),
  ('Lentil Curry & Rice', 'Tomato', 0.3),
  ('Lentil Curry & Rice', 'Curry Powder', 0.08),
  ('Lentil Curry & Rice', 'Rice', 0.5),

  ('Samp & Beans (Umngqusho)', 'Samp', 0.4),
  ('Samp & Beans (Umngqusho)', 'Black Beans', 2),
  ('Samp & Beans (Umngqusho)', 'Onion', 0.2),

  ('Peri-Peri Chicken & Rice', 'Chicken Breast', 0.6),
  ('Peri-Peri Chicken & Rice', 'Peri-Peri Sauce', 0.25),
  ('Peri-Peri Chicken & Rice', 'Rice', 0.5),
  ('Peri-Peri Chicken & Rice', 'Onion', 0.2),

  ('Butternut & Chicken Curry', 'Butternut', 0.5),
  ('Butternut & Chicken Curry', 'Chicken Breast', 0.5),
  ('Butternut & Chicken Curry', 'Onion', 0.3),
  ('Butternut & Chicken Curry', 'Curry Powder', 0.08),
  ('Butternut & Chicken Curry', 'Rice', 0.4)
) as v(recipe_name, ingredient_name, quantity)
join rec r on r.name = v.recipe_name
join public.ingredients i on i.name = v.ingredient_name;

insert into public.nutrition_info (recipe_id, calories, macros, allergens)
select rec2.id, v.calories, v.macros::jsonb, v.allergens::jsonb
from (values
  ('Pap & Chakalaka', 320, '{"protein":10,"carbs":60,"fat":4}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Beef Mince Stew & Pap', 520, '{"protein":30,"carbs":50,"fat":20}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Chicken Mince Stew & Pap', 480, '{"protein":38,"carbs":48,"fat":12}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Boerewors Roll', 450, '{"protein":22,"carbs":35,"fat":26}', '{"gluten":true,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Curried Mince & Rice', 540, '{"protein":28,"carbs":55,"fat":22}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Lentil Curry & Rice', 380, '{"protein":16,"carbs":65,"fat":6}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Samp & Beans (Umngqusho)', 360, '{"protein":14,"carbs":68,"fat":3}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Peri-Peri Chicken & Rice', 500, '{"protein":40,"carbs":45,"fat":15}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Butternut & Chicken Curry', 460, '{"protein":32,"carbs":48,"fat":14}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}')
) as v(recipe_name, calories, macros, allergens)
join public.recipes rec2 on rec2.name = v.recipe_name;
