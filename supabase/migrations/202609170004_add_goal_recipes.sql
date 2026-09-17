-- Add new ingredients (7 items x 6 stores) needed for goal-oriented recipes
insert into public.ingredients (name, unit, category, price, store) values
  ('Spinach', 'bag', 'Produce', 24.99, 'Checkers'),
  ('Tomato', 'kg', 'Produce', 29.99, 'Checkers'),
  ('Tuna', 'can', 'Canned Goods', 19.99, 'Checkers'),
  ('Beef Steak', 'kg', 'Meat', 159.99, 'Checkers'),
  ('Sweet Potato', 'kg', 'Produce', 22.99, 'Checkers'),
  ('Salmon', 'kg', 'Meat', 249.99, 'Checkers'),
  ('Greek Yogurt', 'tub', 'Dairy', 44.99, 'Checkers'),
  ('Spinach', 'bag', 'Produce', 23.99, 'Pick n Pay'),
  ('Tomato', 'kg', 'Produce', 28.99, 'Pick n Pay'),
  ('Tuna', 'can', 'Canned Goods', 18.99, 'Pick n Pay'),
  ('Beef Steak', 'kg', 'Meat', 164.99, 'Pick n Pay'),
  ('Sweet Potato', 'kg', 'Produce', 21.99, 'Pick n Pay'),
  ('Salmon', 'kg', 'Meat', 259.99, 'Pick n Pay'),
  ('Greek Yogurt', 'tub', 'Dairy', 42.99, 'Pick n Pay'),
  ('Spinach', 'bag', 'Produce', 32.99, 'Woolworths'),
  ('Tomato', 'kg', 'Produce', 38.99, 'Woolworths'),
  ('Tuna', 'can', 'Canned Goods', 26.99, 'Woolworths'),
  ('Beef Steak', 'kg', 'Meat', 199.99, 'Woolworths'),
  ('Sweet Potato', 'kg', 'Produce', 29.99, 'Woolworths'),
  ('Salmon', 'kg', 'Meat', 319.99, 'Woolworths'),
  ('Greek Yogurt', 'tub', 'Dairy', 54.99, 'Woolworths'),
  ('Spinach', 'bag', 'Produce', 21.99, 'Shoprite'),
  ('Tomato', 'kg', 'Produce', 25.99, 'Shoprite'),
  ('Tuna', 'can', 'Canned Goods', 17.99, 'Shoprite'),
  ('Beef Steak', 'kg', 'Meat', 149.99, 'Shoprite'),
  ('Sweet Potato', 'kg', 'Produce', 19.99, 'Shoprite'),
  ('Salmon', 'kg', 'Meat', 234.99, 'Shoprite'),
  ('Greek Yogurt', 'tub', 'Dairy', 39.99, 'Shoprite'),
  ('Spinach', 'bag', 'Produce', 26.99, 'Spar'),
  ('Tomato', 'kg', 'Produce', 31.99, 'Spar'),
  ('Tuna', 'can', 'Canned Goods', 20.99, 'Spar'),
  ('Beef Steak', 'kg', 'Meat', 169.99, 'Spar'),
  ('Sweet Potato', 'kg', 'Produce', 24.99, 'Spar'),
  ('Salmon', 'kg', 'Meat', 269.99, 'Spar'),
  ('Greek Yogurt', 'tub', 'Dairy', 46.99, 'Spar'),
  ('Spinach', 'bag', 'Produce', 19.99, 'Food Lover''s Market'),
  ('Tomato', 'kg', 'Produce', 24.99, 'Food Lover''s Market'),
  ('Tuna', 'can', 'Canned Goods', 18.99, 'Food Lover''s Market'),
  ('Beef Steak', 'kg', 'Meat', 154.99, 'Food Lover''s Market'),
  ('Sweet Potato', 'kg', 'Produce', 17.99, 'Food Lover''s Market'),
  ('Salmon', 'kg', 'Meat', 244.99, 'Food Lover''s Market'),
  ('Greek Yogurt', 'tub', 'Dairy', 43.99, 'Food Lover''s Market');

-- Add 8 new recipes with varied nutrition profiles (weight-loss friendly, muscle-gain, and balanced)
with rec as (
  insert into public.recipes (name, instructions, prep_time, servings) values
    ('Grilled Chicken & Spinach Salad', 'Grill the chicken breast and slice. Toss with spinach and diced tomato.', 15, 2),
    ('Tuna & Black Bean Salad', 'Drain the tuna and mix with black beans, diced onion, and diced tomato.', 10, 2),
    ('Egg White Veggie Omelette', 'Whisk eggs and cook with wilted spinach and diced tomato folded in.', 10, 1),
    ('Steak & Sweet Potato', 'Pan-sear the steak to your liking. Roast the sweet potato with diced onion.', 25, 2),
    ('Salmon & Rice Bowl', 'Pan-sear the salmon. Cook the rice and steam the broccoli. Combine in a bowl.', 20, 2),
    ('Protein Smoothie Bowl', 'Blend the milk, peanut butter, oats, and banana until smooth. Serve chilled.', 5, 1),
    ('Greek Yogurt & Banana Bowl', 'Spoon the yogurt into a bowl, top with sliced banana and oats.', 5, 1),
    ('Chicken Caesar Bowl', 'Grill and slice the chicken. Toss with torn bread croutons and shaved cheddar.', 20, 2)
  returning id, name
)
insert into public.recipe_ingredients (recipe_id, ingredient_id, quantity)
select r.id, i.id, v.quantity
from (values
  ('Grilled Chicken & Spinach Salad', 'Chicken Breast', 0.4),
  ('Grilled Chicken & Spinach Salad', 'Spinach', 1),
  ('Grilled Chicken & Spinach Salad', 'Tomato', 0.2),
  ('Tuna & Black Bean Salad', 'Tuna', 2),
  ('Tuna & Black Bean Salad', 'Black Beans', 1),
  ('Tuna & Black Bean Salad', 'Onion', 0.2),
  ('Tuna & Black Bean Salad', 'Tomato', 0.2),
  ('Egg White Veggie Omelette', 'Eggs', 0.75),
  ('Egg White Veggie Omelette', 'Spinach', 0.5),
  ('Egg White Veggie Omelette', 'Tomato', 0.2),
  ('Steak & Sweet Potato', 'Beef Steak', 0.4),
  ('Steak & Sweet Potato', 'Sweet Potato', 0.5),
  ('Steak & Sweet Potato', 'Onion', 0.25),
  ('Salmon & Rice Bowl', 'Salmon', 0.35),
  ('Salmon & Rice Bowl', 'Rice', 0.5),
  ('Salmon & Rice Bowl', 'Frozen Broccoli', 1),
  ('Protein Smoothie Bowl', 'Milk', 0.3),
  ('Protein Smoothie Bowl', 'Peanut Butter', 0.15),
  ('Protein Smoothie Bowl', 'Oats', 0.25),
  ('Protein Smoothie Bowl', 'Bananas', 0.4),
  ('Greek Yogurt & Banana Bowl', 'Greek Yogurt', 0.3),
  ('Greek Yogurt & Banana Bowl', 'Bananas', 0.3),
  ('Greek Yogurt & Banana Bowl', 'Oats', 0.1),
  ('Chicken Caesar Bowl', 'Chicken Breast', 0.5),
  ('Chicken Caesar Bowl', 'Cheddar Cheese', 0.15),
  ('Chicken Caesar Bowl', 'Bread', 0.2)
) as v(recipe_name, ingredient_name, quantity)
join rec r on r.name = v.recipe_name
join public.ingredients i on i.name = v.ingredient_name;

insert into public.nutrition_info (recipe_id, calories, macros, allergens)
select rec2.id, v.calories, v.macros::jsonb, v.allergens::jsonb
from (values
  ('Grilled Chicken & Spinach Salad', 380, '{"protein":42,"carbs":12,"fat":14}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Tuna & Black Bean Salad', 360, '{"protein":38,"carbs":30,"fat":8}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Egg White Veggie Omelette', 280, '{"protein":24,"carbs":8,"fat":16}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":true,"soy":false,"shellfish":false}'),
  ('Steak & Sweet Potato', 620, '{"protein":48,"carbs":45,"fat":26}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Salmon & Rice Bowl', 590, '{"protein":44,"carbs":50,"fat":22}', '{"gluten":false,"dairy":false,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Protein Smoothie Bowl', 480, '{"protein":18,"carbs":65,"fat":16}', '{"gluten":false,"dairy":true,"nuts":true,"eggs":false,"soy":false,"shellfish":false}'),
  ('Greek Yogurt & Banana Bowl', 290, '{"protein":16,"carbs":42,"fat":6}', '{"gluten":false,"dairy":true,"nuts":false,"eggs":false,"soy":false,"shellfish":false}'),
  ('Chicken Caesar Bowl', 460, '{"protein":40,"carbs":25,"fat":22}', '{"gluten":true,"dairy":true,"nuts":false,"eggs":false,"soy":false,"shellfish":false}')
) as v(recipe_name, calories, macros, allergens)
join public.recipes rec2 on rec2.name = v.recipe_name;
