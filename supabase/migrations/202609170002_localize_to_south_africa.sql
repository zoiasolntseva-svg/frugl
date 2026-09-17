-- Replace the US/Walmart placeholder data with South African stores and ZAR pricing
delete from public.recipe_ingredients;
delete from public.nutrition_info;
delete from public.recipes;
delete from public.ingredients;

with ing as (
  insert into public.ingredients (name, unit, category, price, store) values
    ('Eggs', 'dozen', 'Dairy', 42.99, 'Checkers'),
    ('Milk', 'liter', 'Dairy', 21.99, 'Checkers'),
    ('Bread', 'loaf', 'Bakery', 18.99, 'Checkers'),
    ('Chicken Breast', 'kg', 'Meat', 89.99, 'Checkers'),
    ('Rice', 'kg', 'Grains', 24.99, 'Checkers'),
    ('Black Beans', 'can', 'Canned Goods', 16.99, 'Checkers'),
    ('Frozen Broccoli', 'bag', 'Frozen', 34.99, 'Checkers'),
    ('Pasta', 'packet', 'Grains', 19.99, 'Checkers'),
    ('Tomato Sauce', 'jar', 'Canned Goods', 24.99, 'Checkers'),
    ('Cheddar Cheese', 'block', 'Dairy', 79.99, 'Checkers'),
    ('Peanut Butter', 'jar', 'Pantry', 39.99, 'Checkers'),
    ('Bananas', 'kg', 'Produce', 19.99, 'Checkers'),
    ('Oats', 'box', 'Grains', 34.99, 'Checkers'),
    ('Beef Mince', 'kg', 'Meat', 109.99, 'Checkers'),
    ('Onion', 'kg', 'Produce', 17.99, 'Checkers'),
    ('Eggs', 'dozen', 'Dairy', 44.99, 'Pick n Pay'),
    ('Milk', 'liter', 'Dairy', 20.99, 'Pick n Pay'),
    ('Bread', 'loaf', 'Bakery', 17.99, 'Pick n Pay'),
    ('Chicken Breast', 'kg', 'Meat', 94.99, 'Pick n Pay'),
    ('Rice', 'kg', 'Grains', 23.99, 'Pick n Pay'),
    ('Black Beans', 'can', 'Canned Goods', 15.99, 'Pick n Pay'),
    ('Frozen Broccoli', 'bag', 'Frozen', 36.99, 'Pick n Pay'),
    ('Pasta', 'packet', 'Grains', 18.99, 'Pick n Pay'),
    ('Tomato Sauce', 'jar', 'Canned Goods', 22.99, 'Pick n Pay'),
    ('Cheddar Cheese', 'block', 'Dairy', 84.99, 'Pick n Pay'),
    ('Peanut Butter', 'jar', 'Pantry', 37.99, 'Pick n Pay'),
    ('Bananas', 'kg', 'Produce', 18.99, 'Pick n Pay'),
    ('Oats', 'box', 'Grains', 32.99, 'Pick n Pay'),
    ('Beef Mince', 'kg', 'Meat', 114.99, 'Pick n Pay'),
    ('Onion', 'kg', 'Produce', 16.99, 'Pick n Pay')
  returning id, name, store
),
rec as (
  insert into public.recipes (name, instructions, prep_time, servings) values
    ('Scrambled Eggs & Toast', 'Whisk eggs and cook in a pan over medium heat. Toast the bread. Serve with a glass of milk.', 10, 2),
    ('Chicken & Rice Bowl', 'Season and cook the chicken breast. Cook the rice. Saute diced onion. Combine and serve.', 25, 4),
    ('Black Bean Pasta', 'Cook the pasta. Warm black beans and tomato sauce together. Toss with pasta and top with cheese.', 20, 4),
    ('PB Banana Oats', 'Cook oats with milk. Stir in peanut butter and top with sliced banana.', 5, 1),
    ('Beef & Broccoli Stir Fry', 'Brown the beef mince with onion. Add frozen broccoli and cook through. Serve over rice.', 20, 4)
  returning id, name
)
insert into public.recipe_ingredients (recipe_id, ingredient_id, quantity)
select r.id, i.id, v.quantity
from (values
  ('Scrambled Eggs & Toast', 'Eggs', 0.5),
  ('Scrambled Eggs & Toast', 'Bread', 0.25),
  ('Scrambled Eggs & Toast', 'Milk', 0.2),
  ('Chicken & Rice Bowl', 'Chicken Breast', 0.75),
  ('Chicken & Rice Bowl', 'Rice', 0.5),
  ('Chicken & Rice Bowl', 'Onion', 0.25),
  ('Black Bean Pasta', 'Pasta', 1),
  ('Black Bean Pasta', 'Black Beans', 2),
  ('Black Bean Pasta', 'Tomato Sauce', 1),
  ('Black Bean Pasta', 'Cheddar Cheese', 0.25),
  ('PB Banana Oats', 'Oats', 0.2),
  ('PB Banana Oats', 'Peanut Butter', 0.1),
  ('PB Banana Oats', 'Bananas', 0.3),
  ('PB Banana Oats', 'Milk', 0.2),
  ('Beef & Broccoli Stir Fry', 'Beef Mince', 0.5),
  ('Beef & Broccoli Stir Fry', 'Frozen Broccoli', 1),
  ('Beef & Broccoli Stir Fry', 'Rice', 0.5),
  ('Beef & Broccoli Stir Fry', 'Onion', 0.25)
) as v(recipe_name, ingredient_name, quantity)
join rec r on r.name = v.recipe_name
join ing i on i.name = v.ingredient_name;

insert into public.nutrition_info (recipe_id, calories, macros, allergens)
select rec2.id, v.calories, v.macros::jsonb, v.allergens::jsonb
from (values
  ('Scrambled Eggs & Toast', 350, '{"protein":20,"carbs":30,"fat":15}', '{"gluten":true,"dairy":true,"nuts":false,"eggs":true,"soy":false,"shellfish":false}'),
  ('Chicken & Rice Bowl', 520, '{"protein":35,"carbs":55,"fat":12}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Black Bean Pasta', 480, '{"protein":18,"carbs":70,"fat":10}', '{"gluten":true,"dairy":true,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('PB Banana Oats', 420, '{"protein":14,"carbs":60,"fat":14}', '{"gluten":false,"dairy":true,"nuts":true,"eggs":false,"soy":false,"shellfish":false}'),
  ('Beef & Broccoli Stir Fry', 540, '{"protein":32,"carbs":45,"fat":22}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}')
) as v(recipe_name, calories, macros, allergens)
join public.recipes rec2 on rec2.name = v.recipe_name;
