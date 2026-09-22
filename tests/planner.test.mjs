import { test } from "node:test";
import assert from "node:assert/strict";
import {
  packsFor,
  buildShoppingList,
  shoppingTotal,
  buildPlan,
  scaleToHousehold,
  portionCostOf,
  MAX_REPEATS_PER_RECIPE,
} from "../lib/planner.ts";

let nextId = 1;
const ing = (name, unit, price, packSize, packLabel, category = "Pantry") => ({
  id: nextId++,
  name,
  category,
  unit,
  price,
  packSize,
  packLabel,
});

const rice = ing("Rice", "kg", 24.99, 1, "1 kg bag", "Grains");
const chicken = ing("Chicken Breast", "kg", 89.99, 1, "1 kg pack", "Meat");
const onion = ing("Onion", "kg", 17.99, 1, "1 kg bag", "Produce");
const yoghurt = ing("Greek Yogurt", "tub", 44.99, 1, "Tub (500 g)", "Dairy");
const banana = ing("Bananas", "kg", 19.99, 1, "1 kg bunch", "Produce");
const oats = ing("Oats", "box", 34.99, 1, "Box (500 g)", "Grains");
const eggs = ing("Eggs", "dozen", 42.99, 1, "Dozen eggs", "Dairy");
const bread = ing("Bread", "loaf", 18.99, 1, "Loaf (700 g)", "Bakery");
const mince = ing("Beef Mince", "kg", 109.99, 0.5, "500 g pack", "Meat");
const broccoli = ing("Frozen Broccoli", "bag", 34.99, 1, "Bag (500 g)", "Frozen");
const salmon = ing("Salmon", "kg", 249.99, 0.4, "400 g pack", "Meat");

let recipeId = 1;
const recipe = (name, calories, protein, parts) => ({
  id: recipeId++,
  name,
  instructions: "",
  prepTime: 10,
  servings: 2,
  calories,
  macros: { protein, carbs: 30, fat: 10 },
  ingredients: parts.map(([ingredient, quantity]) => ({ ingredient, quantity })),
});

const chickenRice = recipe("Chicken & Rice Bowl", 520, 35, [
  [chicken, 0.75],
  [rice, 0.5],
  [onion, 0.25],
]);
const beefStirFry = recipe("Beef & Broccoli Stir Fry", 540, 32, [
  [mince, 0.5],
  [broccoli, 1],
  [rice, 0.5],
  [onion, 0.25],
]);
const yoghurtBowl = recipe("Greek Yogurt & Banana Bowl", 290, 16, [
  [yoghurt, 0.3],
  [banana, 0.3],
  [oats, 0.1],
]);
const eggsToast = recipe("Scrambled Eggs & Toast", 350, 20, [
  [eggs, 0.5],
  [bread, 0.25],
]);
const salmonRice = recipe("Salmon & Rice Bowl", 590, 44, [
  [salmon, 0.35],
  [rice, 0.5],
  [broccoli, 1],
]);

const catalogue = [chickenRice, beefStirFry, yoghurtBowl, eggsToast, salmonRice];

test("packsFor rounds up to whole packs and ignores floating point noise", () => {
  assert.equal(packsFor(0, 1), 0);
  assert.equal(packsFor(0.3, 1), 1);
  assert.equal(packsFor(1, 1), 1);
  assert.equal(packsFor(1.5, 1), 2);
  assert.equal(packsFor(0.6, 0.2), 3); // 0.6 / 0.2 is 2.9999999999999996 in floating point
  assert.equal(packsFor(2.1, 0.5), 5);
});

test("a portion of an ingredient still costs a whole pack", () => {
  const list = buildShoppingList([{ recipe: yoghurtBowl, batches: 1 }]);
  const tub = list.find((i) => i.name === "Greek Yogurt");
  assert.equal(tub.packsToBuy, 1);
  assert.equal(tub.lineTotal, 44.99);
  assert.ok(Math.abs(tub.leftover - 0.7) < 1e-9);
  assert.ok(Math.abs(tub.leftoverValue - 0.7 * 44.99) < 1e-6);
});

test("packs are shared between meals", () => {
  const two = buildShoppingList([
    { recipe: chickenRice, batches: 1 },
    { recipe: beefStirFry, batches: 1 },
  ]);
  const riceLine = two.find((i) => i.name === "Rice");
  // 0.5 kg + 0.5 kg = 1 kg = exactly one 1 kg bag, not two
  assert.equal(riceLine.packsToBuy, 1);
  assert.equal(riceLine.lineTotal, 24.99);

  const three = buildShoppingList([
    { recipe: chickenRice, batches: 2 },
    { recipe: beefStirFry, batches: 1 },
  ]);
  assert.equal(three.find((i) => i.name === "Rice").packsToBuy, 2); // 1.5 kg needs two bags
});

test("the shopping total never exceeds the budget", () => {
  for (const budget of [40, 100, 250, 400, 500, 800, 1000, 1500, 3000]) {
    for (const goal of ["balanced", "weight_loss", "muscle_gain"]) {
      for (const period of ["weekly", "monthly"]) {
        const plan = buildPlan(catalogue, budget, goal, period, 2);
        assert.ok(
          plan.tillTotal <= budget + 1e-6,
          `R${budget} ${goal}/${period}: till total ${plan.tillTotal} exceeds budget`
        );
        assert.equal(plan.tillTotal, shoppingTotal(plan.shoppingList));
      }
    }
  }
});

test("portion cost plus leftover value equals the shopping total", () => {
  const plan = buildPlan(catalogue, 1000, "balanced", "weekly", 2);
  const tolerance = 0.01 * plan.shoppingList.length + 0.01;
  assert.ok(Math.abs(plan.portionTotal + plan.leftoverValue - plan.tillTotal) < tolerance);
  assert.ok(plan.tillTotal >= plan.portionTotal - 1e-6, "you can never pay less than you use");
});

test("a bigger budget buys more meals", () => {
  const small = buildPlan(catalogue, 150, "balanced", "monthly", 2).totalMeals;
  const medium = buildPlan(catalogue, 500, "balanced", "monthly", 2).totalMeals;
  const large = buildPlan(catalogue, 1500, "balanced", "monthly", 2).totalMeals;
  assert.ok(small < medium, `${small} should be fewer than ${medium}`);
  assert.ok(medium < large, `${medium} should be fewer than ${large}`);
});

test("a budget below the cheapest shop gives an empty plan", () => {
  const plan = buildPlan(catalogue, 20, "balanced", "weekly", 2);
  assert.equal(plan.recipes.length, 0);
  assert.equal(plan.tillTotal, 0);
  assert.equal(plan.totalMeals, 0);
});

test("sharing a pack makes the next batch free", () => {
  const riceOnly = recipe("Plain rice", 300, 5, [[rice, 0.5]]);
  // R24.99 buys one 1 kg bag, which covers two 0.5 kg batches but not a third
  const plan = buildPlan([riceOnly], 24.99, "balanced", "monthly", 2);
  assert.equal(plan.totalMeals, 2);
  assert.equal(plan.tillTotal, 24.99);
});

test("weight loss and muscle gain prefer different meals", () => {
  const light = recipe("Light salad", 250, 10, [[banana, 0.5]]);
  const heavy = recipe("Protein feast", 800, 60, [[chicken, 1]]);
  // enough for either the salad or the chicken, not both
  const budget = 95;
  const loss = buildPlan([light, heavy], budget, "weight_loss", "weekly", 2);
  const gain = buildPlan([light, heavy], budget, "muscle_gain", "weekly", 2);
  assert.equal(loss.recipes[0].name, "Light salad");
  assert.equal(gain.recipes[0].name, "Protein feast");
});

test("repeat batches are capped per period", () => {
  const cheap = recipe("Cheap oats", 200, 8, [[oats, 0.1]]);
  const weekly = buildPlan([cheap], 100000, "balanced", "weekly", 2);
  const monthly = buildPlan([cheap], 100000, "balanced", "monthly", 2);
  assert.equal(weekly.recipes[0].quantity, MAX_REPEATS_PER_RECIPE.weekly);
  assert.equal(monthly.recipes[0].quantity, MAX_REPEATS_PER_RECIPE.monthly);
});

test("scaleToHousehold: matching household size leaves the recipe unchanged", () => {
  const scaled = scaleToHousehold(chickenRice, 2); // chickenRice.servings is 2
  assert.equal(scaled, chickenRice); // same object, not just equal values: no-op fast path
});

test("scaleToHousehold: doubling the household doubles ingredients, calories and macros", () => {
  const scaled = scaleToHousehold(chickenRice, 4); // 2 -> 4 people
  assert.equal(scaled.servings, 4);
  assert.equal(scaled.calories, chickenRice.calories * 2);
  assert.equal(scaled.macros.protein, chickenRice.macros.protein * 2);
  for (let i = 0; i < scaled.ingredients.length; i++) {
    assert.equal(scaled.ingredients[i].quantity, chickenRice.ingredients[i].quantity * 2);
  }
  assert.equal(portionCostOf(scaled), portionCostOf(chickenRice) * 2);
  // the original recipe object must not be mutated
  assert.equal(chickenRice.servings, 2);
});

test("scaleToHousehold: a household smaller than the recipe's servings shrinks it", () => {
  const scaled = scaleToHousehold(chickenRice, 1); // 2 -> 1 person
  assert.equal(scaled.servings, 1);
  assert.ok(Math.abs(portionCostOf(scaled) - portionCostOf(chickenRice) / 2) < 1e-9);
});

test("the same budget buys fewer meals for a bigger household, not more food for free", () => {
  const budget = 300;
  const solo = buildPlan(catalogue, budget, "balanced", "weekly", 1);
  const family = buildPlan(catalogue, budget, "balanced", "weekly", 6);

  assert.ok(
    family.totalMeals < solo.totalMeals,
    `a household of 6 (${family.totalMeals} meals) should fit fewer meal occasions than 1 (${solo.totalMeals}) on the same budget`
  );
  for (const plan of [solo, family]) {
    assert.ok(plan.tillTotal <= budget + 1e-6);
  }
  // every recipe actually serves the household size, not its original servings
  for (const r of family.recipes) {
    assert.equal(r.servings, 6);
  }
  for (const r of solo.recipes) {
    assert.equal(r.servings, 1);
  }
});

test("household size never goes below 1 and is rounded to a whole person", () => {
  const zero = buildPlan(catalogue, 500, "balanced", "weekly", 0);
  const fractional = buildPlan(catalogue, 500, "balanced", "weekly", 2.4);
  const negative = buildPlan(catalogue, 500, "balanced", "weekly", -3);
  assert.deepEqual(
    zero.recipes.map((r) => r.servings),
    negative.recipes.map((r) => r.servings)
  );
  assert.ok(zero.recipes.every((r) => r.servings === 1));
  assert.ok(fractional.recipes.every((r) => r.servings === 2));
});

test("shopping list carries what the UI needs", () => {
  const plan = buildPlan(catalogue, 800, "balanced", "weekly", 2);
  assert.ok(plan.shoppingList.length > 0);
  for (const item of plan.shoppingList) {
    assert.ok(item.packsToBuy >= 1);
    assert.ok(item.bought >= item.needed - 1e-9);
    assert.ok(item.leftover >= 0);
    assert.equal(item.lineTotal, Math.round(item.packsToBuy * item.packPrice * 100) / 100);
    assert.ok(item.category && item.packLabel && item.name);
  }
  for (const r of plan.recipes) {
    assert.ok(r.ingredientBreakdown.every((b) => b.packPrice > 0 && b.packLabel));
  }
});
