"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";

type Macros = { protein: number; carbs: number; fat: number };
type Allergens = Record<string, boolean>;
type IngredientCost = { name: string; cost: number };
type Goal = "balanced" | "weight_loss" | "muscle_gain";

type PlannedRecipe = {
  id: number;
  name: string;
  instructions: string;
  prep_time: number;
  servings: number;
  unitCost: number;
  unitCalories: number | null;
  quantity: number;
  cost: number; // unitCost * quantity
  calories: number | null; // unitCalories * quantity
  macros: Macros | null;
  allergens: Allergens | null;
  ingredientBreakdown: IngredientCost[]; // scaled by quantity
  color: string;
};

// Validated categorical palette (fixed order — never cycled per-render logic, only by index)
const CATEGORICAL = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#4a3aa7", // violet
  "#e34948", // red
];
const TRACK_COLOR = "#e1e0d9";
const MAX_REPEATS_PER_RECIPE = 3;

const GOALS: { value: Goal; label: string; description: string }[] = [
  { value: "balanced", label: "Balanced", description: "A varied, affordable mix" },
  { value: "weight_loss", label: "Weight Loss", description: "Lower-calorie meals first" },
  { value: "muscle_gain", label: "Muscle Gain", description: "High-protein meals first" },
];

function currency(n: number) {
  return `R${n.toFixed(2)}`;
}

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-ink/10 rounded-xl p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-ink/50 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="text-xs text-ink/50 mt-0.5">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function BudgetDonut({ spent, budget }: { spent: number; budget: number }) {
  const remaining = Math.max(budget - spent, 0);
  const overBudget = spent > budget;
  const data = overBudget
    ? [{ name: "Spent", value: budget }]
    : [
        { name: "Spent", value: spent },
        { name: "Remaining", value: remaining },
      ];
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={95}
            startAngle={90}
            endAngle={-270}
            stroke="#fcfcfb"
            strokeWidth={2}
          >
            <Cell fill={overBudget ? "#e34948" : "#2A9D67"} />
            {!overBudget && <Cell fill={TRACK_COLOR} />}
          </Pie>
          <Tooltip formatter={(value) => currency(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-ink">{pct.toFixed(0)}%</span>
        <span className="text-xs text-ink/50">of budget used</span>
      </div>
      <div className="flex justify-center gap-6 mt-2 text-sm">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: overBudget ? "#e34948" : "#2A9D67" }}
          />
          Spent {currency(spent)}
        </span>
        <span className="flex items-center gap-1.5 text-ink/60">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: TRACK_COLOR }} />
          Left {currency(Math.max(budget - spent, 0))}
        </span>
      </div>
    </div>
  );
}

function CalorieDonut({ plan }: { plan: PlannedRecipe[] }) {
  const data = plan.map((r) => ({
    name: r.quantity > 1 ? `${r.name} ×${r.quantity}` : r.name,
    value: r.calories ?? 0,
    color: r.color,
  }));
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            stroke="#fcfcfb"
            strokeWidth={2}
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} cal`} />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-sm text-ink/60 -mt-2 mb-2">{total} cal total this week</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
        {data.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function CostBarChart({ plan }: { plan: PlannedRecipe[] }) {
  const data = [...plan]
    .sort((a, b) => a.cost - b.cost)
    .map((r) => ({
      name: r.name.length > 16 ? r.name.slice(0, 15) + "…" : r.name,
      label: r.quantity > 1 ? `${r.name.length > 12 ? r.name.slice(0, 11) + "…" : r.name} ×${r.quantity}` : r.name,
      cost: Number(r.cost.toFixed(2)),
      color: r.color,
    }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(60 * data.length, 160)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="#e1e0d9" />
        <XAxis type="number" tickFormatter={(v) => `R${v}`} tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
        <YAxis type="category" dataKey="label" width={130} tick={{ fontSize: 12, fill: "#2B221A" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
        <Tooltip formatter={(value) => currency(Number(value))} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
        <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={20}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function RecipeCard({ recipe }: { recipe: PlannedRecipe }) {
  const maxCost = Math.max(...recipe.ingredientBreakdown.map((i) => i.cost), 0.01);

  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: recipe.color }} />
          <h3 className="font-semibold text-lg">{recipe.name}</h3>
          {recipe.quantity > 1 && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: recipe.color }}
            >
              ×{recipe.quantity}
            </span>
          )}
        </div>
        <span className="font-bold text-lg" style={{ color: recipe.color }}>
          {currency(recipe.cost)}
        </span>
      </div>
      <p className="text-sm text-ink/60 mb-3">
        {recipe.prep_time} min &middot; serves {recipe.servings}
        {recipe.unitCalories ? ` · ${recipe.unitCalories} cal/batch` : ""}
        {recipe.macros ? ` · ${recipe.macros.protein}g protein` : ""}
      </p>
      <p className="text-sm mb-4">{recipe.instructions}</p>

      <p className="text-xs uppercase tracking-wide text-ink/50 font-medium mb-2">
        Price breakdown{recipe.quantity > 1 ? ` (×${recipe.quantity} batches)` : ""}
      </p>
      <div className="space-y-1.5">
        {recipe.ingredientBreakdown.map((ing) => (
          <div key={ing.name} className="flex items-center gap-2">
            <span className="text-xs text-ink/70 w-28 shrink-0 truncate">{ing.name}</span>
            <div className="flex-1 h-2 bg-ink/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(ing.cost / maxCost) * 100}%`,
                  background: recipe.color,
                }}
              />
            </div>
            <span className="text-xs font-medium text-ink/70 w-14 shrink-0 text-right">
              {currency(ing.cost)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [stores, setStores] = useState<string[]>([]);
  const [store, setStore] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [goal, setGoal] = useState<Goal>("balanced");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlannedRecipe[] | null>(null);
  const [planTotal, setPlanTotal] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
      setUser(data.session.user);
      setCheckingAuth(false);
    });
  }, [router]);

  useEffect(() => {
    supabase
      .from("ingredients")
      .select("store")
      .then(({ data }) => {
        if (!data) return;
        const unique = Array.from(new Set(data.map((row) => row.store)));
        setStores(unique);
        if (unique.length > 0) setStore((current) => current || unique[0]);
      });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPlan(null);

    const budgetNumber = parseFloat(budget);
    if (!store || !budgetNumber || budgetNumber <= 0) {
      setError("Enter a valid budget and pick a store.");
      return;
    }

    setSaving(true);

    if (user) {
      await supabase
        .from("profiles")
        .update({ store_preference: store, city })
        .eq("id", user.id);
    }

    const { data: recipes, error: fetchError } = await supabase
      .from("recipes")
      .select(
        `id, name, instructions, prep_time, servings,
         recipe_ingredients ( quantity, ingredients ( name, price, store ) ),
         nutrition_info ( calories, macros, allergens )`
      );

    setSaving(false);

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    type RawRecipe = {
      id: number;
      name: string;
      instructions: string;
      prep_time: number;
      servings: number;
      recipe_ingredients: {
        quantity: number;
        ingredients: { name: string; price: number; store: string } | null;
      }[];
      nutrition_info: { calories: number; macros: Macros; allergens: Allergens }[];
    };

    type Candidate = {
      id: number;
      name: string;
      instructions: string;
      prep_time: number;
      servings: number;
      unitCost: number;
      unitCalories: number | null;
      macros: Macros | null;
      allergens: Allergens | null;
      unitIngredientBreakdown: IngredientCost[];
    };

    const candidates: Candidate[] = ((recipes as unknown as RawRecipe[]) || [])
      .map((r) => {
        const storeIngredients = r.recipe_ingredients.filter(
          (ri) => ri.ingredients?.store === store
        );
        return { r, storeIngredients };
      })
      .filter(({ storeIngredients }) => storeIngredients.length > 0)
      .map(({ r, storeIngredients }) => {
        const unitIngredientBreakdown = storeIngredients
          .map((ri) => ({
            name: ri.ingredients?.name || "Unknown",
            cost: ri.quantity * (ri.ingredients?.price || 0),
          }))
          .sort((a, b) => b.cost - a.cost);
        return {
          id: r.id,
          name: r.name,
          instructions: r.instructions,
          prep_time: r.prep_time,
          servings: r.servings,
          unitCost: unitIngredientBreakdown.reduce((sum, i) => sum + i.cost, 0),
          unitCalories: r.nutrition_info[0]?.calories ?? null,
          macros: r.nutrition_info[0]?.macros ?? null,
          allergens: r.nutrition_info[0]?.allergens ?? null,
          unitIngredientBreakdown,
        };
      });

    // Order candidates by how well they serve the chosen goal
    const sorted = [...candidates].sort((a, b) => {
      if (goal === "weight_loss") {
        const calDiff = (a.unitCalories ?? Infinity) - (b.unitCalories ?? Infinity);
        if (calDiff !== 0) return calDiff;
        return a.unitCost - b.unitCost;
      }
      if (goal === "muscle_gain") {
        const proteinDiff = (b.macros?.protein ?? 0) - (a.macros?.protein ?? 0);
        if (proteinDiff !== 0) return proteinDiff;
        return a.unitCost - b.unitCost;
      }
      return a.unitCost - b.unitCost;
    });

    // Fill the budget: repeat passes over the sorted list so a bigger budget
    // buys more (extra batches of cheap/goal-fitting meals) instead of going unused.
    const quantities = new Map<number, number>();
    let remaining = budgetNumber;
    let addedInLastPass = true;
    while (addedInLastPass && remaining > 0) {
      addedInLastPass = false;
      for (const c of sorted) {
        const currentQty = quantities.get(c.id) ?? 0;
        if (currentQty >= MAX_REPEATS_PER_RECIPE) continue;
        if (c.unitCost <= remaining && c.unitCost > 0) {
          quantities.set(c.id, currentQty + 1);
          remaining -= c.unitCost;
          addedInLastPass = true;
        }
      }
    }

    const selected = sorted
      .filter((c) => (quantities.get(c.id) ?? 0) > 0)
      .map((c) => {
        const quantity = quantities.get(c.id) ?? 0;
        return {
          id: c.id,
          name: c.name,
          instructions: c.instructions,
          prep_time: c.prep_time,
          servings: c.servings,
          unitCost: c.unitCost,
          unitCalories: c.unitCalories,
          quantity,
          cost: c.unitCost * quantity,
          calories: c.unitCalories !== null ? c.unitCalories * quantity : null,
          macros: c.macros,
          allergens: c.allergens,
          ingredientBreakdown: c.unitIngredientBreakdown.map((ing) => ({
            name: ing.name,
            cost: ing.cost * quantity,
          })),
        };
      })
      .sort((a, b) => a.unitCost - b.unitCost);

    const withColor: PlannedRecipe[] = selected.map((r, i) => ({
      ...r,
      color: CATEGORICAL[i % CATEGORICAL.length],
    }));

    setPlan(withColor);
    setPlanTotal(budgetNumber - remaining);
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  const budgetNumber = parseFloat(budget) || 0;
  const totalCalories = plan?.reduce((s, r) => s + (r.calories ?? 0), 0) ?? 0;
  const totalMeals = plan?.reduce((s, r) => s + r.quantity, 0) ?? 0;

  return (
    <main className="min-h-screen bg-[#f9f9f7] text-ink px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Meal Plan</h1>
            <p className="text-sm text-ink/50">Budget-smart groceries, sorted.</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-primary hover:underline">
            Log out
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded-2xl p-6 mb-8 shadow-sm space-y-4"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Weekly grocery budget (R)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-ink/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Store</label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="w-full border border-ink/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {stores.length === 0 && <option value="">No stores available yet</option>}
                {stores.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City (optional)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-ink/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Goal</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={`text-left border rounded-xl px-4 py-3 transition-colors ${
                    goal === g.value
                      ? "border-primary bg-primary/5"
                      : "border-ink/15 hover:border-ink/30"
                  }`}
                >
                  <p className={`font-medium ${goal === g.value ? "text-primary" : "text-ink"}`}>
                    {g.label}
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5">{g.description}</p>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Building your plan..." : "Get Meal Plan"}
          </button>
        </form>

        {plan && plan.length === 0 && (
          <p className="text-sm text-ink/60">No recipes fit that budget/store combination yet.</p>
        )}

        {plan && plan.length > 0 && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-4 gap-4">
              <StatTile label="Budget" value={currency(budgetNumber)} />
              <StatTile label="Spent" value={currency(planTotal)} />
              <StatTile label="Left over" value={currency(Math.max(budgetNumber - planTotal, 0))} />
              <StatTile
                label="Meals"
                value={`${totalMeals}`}
                sub={`${plan.length} recipes · ${totalCalories} cal total`}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ChartCard title="Budget usage">
                <BudgetDonut spent={planTotal} budget={budgetNumber} />
              </ChartCard>
              <ChartCard title="Calories by meal">
                <CalorieDonut plan={plan} />
              </ChartCard>
            </div>

            <ChartCard title="Cost per meal">
              <CostBarChart plan={plan} />
            </ChartCard>

            <div>
              <h2 className="text-lg font-semibold mb-3">Your meals</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {plan.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
