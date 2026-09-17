"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Macros = { protein: number; carbs: number; fat: number };
type Allergens = Record<string, boolean>;

type PlannedRecipe = {
  id: number;
  name: string;
  instructions: string;
  prep_time: number;
  servings: number;
  cost: number;
  calories: number | null;
  macros: Macros | null;
  allergens: Allergens | null;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [stores, setStores] = useState<string[]>([]);
  const [store, setStore] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");

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
         recipe_ingredients ( quantity, ingredients ( price, store ) ),
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
      recipe_ingredients: { quantity: number; ingredients: { price: number; store: string } | null }[];
      nutrition_info: { calories: number; macros: Macros; allergens: Allergens }[];
    };

    const candidates = ((recipes as unknown as RawRecipe[]) || [])
      .map((r) => {
        const storeIngredients = r.recipe_ingredients.filter(
          (ri) => ri.ingredients?.store === store
        );
        return { r, storeIngredients };
      })
      .filter(({ storeIngredients }) => storeIngredients.length > 0)
      .map(({ r, storeIngredients }) => ({
        id: r.id,
        name: r.name,
        instructions: r.instructions,
        prep_time: r.prep_time,
        servings: r.servings,
        cost: storeIngredients.reduce(
          (sum, ri) => sum + ri.quantity * (ri.ingredients?.price || 0),
          0
        ),
        calories: r.nutrition_info[0]?.calories ?? null,
        macros: r.nutrition_info[0]?.macros ?? null,
        allergens: r.nutrition_info[0]?.allergens ?? null,
      }))
      .sort((a, b) => a.cost - b.cost);

    const selected: PlannedRecipe[] = [];
    let remaining = budgetNumber;
    for (const recipe of candidates) {
      if (recipe.cost <= remaining) {
        selected.push(recipe);
        remaining -= recipe.cost;
      }
    }

    setPlan(selected);
    setPlanTotal(budgetNumber - remaining);
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Meal Plan</h1>
          <button onClick={handleLogout} className="text-sm text-primary hover:underline">
            Log out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="border border-primary/20 rounded-2xl p-6 mb-8 space-y-4">
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
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Building your plan..." : "Get Meal Plan"}
          </button>
        </form>

        {plan && (
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {plan.length} meals for R{planTotal.toFixed(2)}
            </h2>
            <p className="text-sm mb-6">
              {plan.length === 0
                ? "No recipes fit that budget/store combination yet."
                : `R${(parseFloat(budget) - planTotal).toFixed(2)} left over.`}
            </p>
            <div className="space-y-4">
              {plan.map((recipe) => (
                <div key={recipe.id} className="border border-ink/10 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{recipe.name}</h3>
                    <span className="text-primary font-medium">R{recipe.cost.toFixed(2)}</span>
                  </div>
                  <p className="text-sm mb-2">
                    {recipe.prep_time} min &middot; serves {recipe.servings}
                    {recipe.calories ? ` · ${recipe.calories} cal` : ""}
                  </p>
                  <p className="text-sm">{recipe.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
