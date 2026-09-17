-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed sample ingredients so meal plan pricing has real data to work with
with ing as (
  insert into public.ingredients (name, unit, category, price, store) values
    ('Eggs', 'dozen', 'Dairy', 3.49, 'Walmart'),
    ('Milk', 'gallon', 'Dairy', 3.79, 'Walmart'),
    ('Bread', 'loaf', 'Bakery', 2.49, 'Walmart'),
    ('Chicken Breast', 'lb', 'Meat', 3.99, 'Walmart'),
    ('Rice', 'lb', 'Grains', 0.89, 'Walmart'),
    ('Black Beans', 'can', 'Canned Goods', 0.99, 'Walmart'),
    ('Frozen Broccoli', 'bag', 'Frozen', 1.99, 'Walmart'),
    ('Pasta', 'box', 'Grains', 1.29, 'Walmart'),
    ('Tomato Sauce', 'jar', 'Canned Goods', 2.29, 'Walmart'),
    ('Cheddar Cheese', 'block', 'Dairy', 3.99, 'Walmart'),
    ('Peanut Butter', 'jar', 'Pantry', 3.49, 'Walmart'),
    ('Bananas', 'lb', 'Produce', 0.59, 'Walmart'),
    ('Oats', 'container', 'Grains', 3.29, 'Walmart'),
    ('Ground Beef', 'lb', 'Meat', 4.99, 'Walmart'),
    ('Onion', 'lb', 'Produce', 0.79, 'Walmart')
  returning id, name
),
rec as (
  insert into public.recipes (name, instructions, prep_time, servings) values
    ('Scrambled Eggs & Toast', 'Whisk eggs and cook in a pan over medium heat. Toast the bread. Serve with a glass of milk.', 10, 2),
    ('Chicken & Rice Bowl', 'Season and cook the chicken breast. Cook the rice. Saute diced onion. Combine and serve.', 25, 4),
    ('Black Bean Pasta', 'Cook the pasta. Warm black beans and tomato sauce together. Toss with pasta and top with cheese.', 20, 4),
    ('PB Banana Oats', 'Cook oats with milk. Stir in peanut butter and top with sliced banana.', 5, 1),
    ('Beef & Broccoli Stir Fry', 'Brown ground beef with onion. Add frozen broccoli and cook through. Serve over rice.', 20, 4)
  returning id, name
)
insert into public.recipe_ingredients (recipe_id, ingredient_id, quantity)
select r.id, i.id, v.quantity
from (values
  ('Scrambled Eggs & Toast', 'Eggs', 0.5),
  ('Scrambled Eggs & Toast', 'Bread', 0.25),
  ('Scrambled Eggs & Toast', 'Milk', 0.05),
  ('Chicken & Rice Bowl', 'Chicken Breast', 1.5),
  ('Chicken & Rice Bowl', 'Rice', 1),
  ('Chicken & Rice Bowl', 'Onion', 0.5),
  ('Black Bean Pasta', 'Pasta', 1),
  ('Black Bean Pasta', 'Black Beans', 2),
  ('Black Bean Pasta', 'Tomato Sauce', 1),
  ('Black Bean Pasta', 'Cheddar Cheese', 0.25),
  ('PB Banana Oats', 'Oats', 0.2),
  ('PB Banana Oats', 'Peanut Butter', 0.1),
  ('PB Banana Oats', 'Bananas', 1),
  ('PB Banana Oats', 'Milk', 0.1),
  ('Beef & Broccoli Stir Fry', 'Ground Beef', 1),
  ('Beef & Broccoli Stir Fry', 'Frozen Broccoli', 1),
  ('Beef & Broccoli Stir Fry', 'Rice', 1),
  ('Beef & Broccoli Stir Fry', 'Onion', 0.5)
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
