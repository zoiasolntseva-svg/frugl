// Meal plan + shopping list logic. Pure functions only (no React, no database),
// so it can be tested on its own.
//
// Two different costs exist for every recipe:
//   - portion cost: what the recipe actually uses (e.g. 0.3 of a tub of yoghurt)
//   - shopping cost: what you pay at the till, because stores sell whole packs
// The budget is checked against the shopping cost. Packs are shared: if two
// meals both need rice, you buy the rice once and only pay for extra packs
// when the combined amount needs them.

export type Macros = { protein: number; carbs: number; fat: number };
export type Goal = "balanced" | "weight_loss" | "muscle_gain";
export type Period = "weekly" | "monthly";

export const MAX_REPEATS_PER_RECIPE: Record<Period, number> = { weekly: 3, monthly: 12 };

export type Ingredient = {
  id: number;
  name: string;
  category: string;
  unit: string;
  /** Price per `unit` (per kg, per litre, per can, ...). */
  price: number;
  /** How many `unit`s are in the pack you buy. */
  packSize: number;
  packLabel: string;
};

export type RecipeIngredient = { ingredient: Ingredient; quantity: number };

export type Recipe = {
  id: number;
  name: string;
  instructions: string;
  prepTime: number;
  servings: number;
  calories: number | null;
  macros: Macros | null;
  ingredients: RecipeIngredient[];
};

export type ShoppingItem = {
  ingredientId: number;
  name: string;
  category: string;
  unit: string;
  packLabel: string;
  packsToBuy: number;
  packPrice: number;
  lineTotal: number;
  /** Amount the plan uses, in `unit`s. */
  needed: number;
  /** Amount bought, in `unit`s. */
  bought: number;
  /** Amount left over, in `unit`s. */
  leftover: number;
  leftoverValue: number;
};

export type IngredientCost = {
  name: string;
  /** Portion cost for all batches of this recipe in the plan. */
  cost: number;
  packLabel: string;
  packPrice: number;
};

export type PlannedRecipe = {
  id: number;
  name: string;
  instructions: string;
  prepTime: number;
  servings: number;
  quantity: number;
  unitCost: number;
  cost: number;
  unitCalories: number | null;
  calories: number | null;
  macros: Macros | null;
  ingredientBreakdown: IngredientCost[];
};

export type Plan = {
  recipes: PlannedRecipe[];
  shoppingList: ShoppingItem[];
  /** What you would pay at the till for the whole shopping list. */
  tillTotal: number;
  /** The part of the shopping list the meals actually use. */
  portionTotal: number;
  /** Value of the ingredients left over after cooking. */
  leftoverValue: number;
  totalMeals: number;
  totalCalories: number;
};

const EPS = 1e-9;

const roundCents = (n: number) => Math.round(n * 100) / 100;

/** Whole packs needed to cover `needed`, tolerant of floating point noise. */
export function packsFor(needed: number, packSize: number): number {
  if (needed <= EPS) return 0;
  return Math.ceil(needed / packSize - EPS);
}

export function packPriceOf(ingredient: Ingredient): number {
  return roundCents(ingredient.price * ingredient.packSize);
}

export function portionCostOf(recipe: Recipe): number {
  return recipe.ingredients.reduce((sum, ri) => sum + ri.quantity * ri.ingredient.price, 0);
}

/**
 * Scale a recipe's ingredient quantities, calories and macros so one batch
 * feeds `householdSize` people instead of the recipe's own `servings`. A
 * recipe written for 2 that's scaled to a household of 4 uses twice the
 * ingredients (and costs twice as much) per batch.
 */
export function scaleToHousehold(recipe: Recipe, householdSize: number): Recipe {
  const factor = householdSize / recipe.servings;
  if (factor === 1) return recipe;
  return {
    ...recipe,
    servings: householdSize,
    calories: recipe.calories !== null ? recipe.calories * factor : null,
    macros: recipe.macros
      ? {
          protein: recipe.macros.protein * factor,
          carbs: recipe.macros.carbs * factor,
          fat: recipe.macros.fat * factor,
        }
      : null,
    ingredients: recipe.ingredients.map((ri) => ({ ...ri, quantity: ri.quantity * factor })),
  };
}

type Selection = { recipe: Recipe; batches: number }[];

/** Combine every meal's ingredients and round up to whole packs. */
export function buildShoppingList(selection: Selection): ShoppingItem[] {
  const needs = new Map<number, { ingredient: Ingredient; needed: number }>();
  for (const { recipe, batches } of selection) {
    if (batches <= 0) continue;
    for (const ri of recipe.ingredients) {
      const entry = needs.get(ri.ingredient.id) ?? { ingredient: ri.ingredient, needed: 0 };
      entry.needed += ri.quantity * batches;
      needs.set(ri.ingredient.id, entry);
    }
  }

  const items: ShoppingItem[] = [];
  for (const { ingredient, needed } of needs.values()) {
    const packsToBuy = packsFor(needed, ingredient.packSize);
    if (packsToBuy === 0) continue;
    const packPrice = packPriceOf(ingredient);
    const bought = packsToBuy * ingredient.packSize;
    const leftover = Math.max(bought - needed, 0);
    items.push({
      ingredientId: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
      unit: ingredient.unit,
      packLabel: ingredient.packLabel,
      packsToBuy,
      packPrice,
      lineTotal: roundCents(packsToBuy * packPrice),
      needed,
      bought,
      leftover,
      leftoverValue: leftover * ingredient.price,
    });
  }
  return items;
}

export const shoppingTotal = (items: ShoppingItem[]) =>
  roundCents(items.reduce((sum, item) => sum + item.lineTotal, 0));

function orderForGoal(recipes: Recipe[], goal: Goal): Recipe[] {
  return [...recipes].sort((a, b) => {
    if (goal === "weight_loss") {
      const diff = (a.calories ?? Infinity) - (b.calories ?? Infinity);
      if (diff !== 0) return diff;
    } else if (goal === "muscle_gain") {
      const diff = (b.macros?.protein ?? 0) - (a.macros?.protein ?? 0);
      if (diff !== 0) return diff;
    }
    return portionCostOf(a) - portionCostOf(b);
  });
}

/**
 * Pick meals for a budget. Meals are tried in the order the goal prefers, and
 * a meal (or another batch of it) is only added if the whole-pack shopping
 * total still fits the budget. Repeated passes let a bigger budget buy more.
 * `householdSize` scales every recipe (see scaleToHousehold) so a bigger
 * household needs more per batch, not just more batches.
 */
export function buildPlan(
  recipes: Recipe[],
  budget: number,
  goal: Goal,
  period: Period,
  householdSize: number
): Plan {
  const household = Math.max(1, Math.round(householdSize));
  const ordered = orderForGoal(
    recipes.map((r) => scaleToHousehold(r, household)).filter((r) => portionCostOf(r) > 0),
    goal
  );
  const cap = MAX_REPEATS_PER_RECIPE[period];
  const batches = new Map<number, number>();

  const selectionWith = (extra?: Recipe): Selection =>
    ordered
      .map((recipe) => ({
        recipe,
        batches: (batches.get(recipe.id) ?? 0) + (extra && extra.id === recipe.id ? 1 : 0),
      }))
      .filter((s) => s.batches > 0);

  let addedInPass = true;
  while (addedInPass) {
    addedInPass = false;
    for (const recipe of ordered) {
      const current = batches.get(recipe.id) ?? 0;
      if (current >= cap) continue;
      const total = shoppingTotal(buildShoppingList(selectionWith(recipe)));
      if (total <= budget + 1e-6) {
        batches.set(recipe.id, current + 1);
        addedInPass = true;
      }
    }
  }

  const selection = selectionWith();
  const shoppingList = buildShoppingList(selection);
  const tillTotal = shoppingTotal(shoppingList);
  const leftoverValue = shoppingList.reduce((sum, item) => sum + item.leftoverValue, 0);

  const recipesOut: PlannedRecipe[] = selection
    .map(({ recipe, batches: quantity }) => {
      const unitCost = portionCostOf(recipe);
      return {
        id: recipe.id,
        name: recipe.name,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        quantity,
        unitCost,
        cost: unitCost * quantity,
        unitCalories: recipe.calories,
        calories: recipe.calories !== null ? recipe.calories * quantity : null,
        macros: recipe.macros,
        ingredientBreakdown: recipe.ingredients
          .map((ri) => ({
            name: ri.ingredient.name,
            cost: ri.quantity * ri.ingredient.price * quantity,
            packLabel: ri.ingredient.packLabel,
            packPrice: packPriceOf(ri.ingredient),
          }))
          .sort((a, b) => b.cost - a.cost),
      };
    })
    .sort((a, b) => a.unitCost - b.unitCost);

  return {
    recipes: recipesOut,
    shoppingList,
    tillTotal,
    portionTotal: recipesOut.reduce((sum, r) => sum + r.cost, 0),
    leftoverValue,
    totalMeals: recipesOut.reduce((sum, r) => sum + r.quantity, 0),
    totalCalories: recipesOut.reduce((sum, r) => sum + (r.calories ?? 0), 0),
  };
}
