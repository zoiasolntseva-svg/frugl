"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { supabase } from "@/lib/supabase";

type WeightLog = { id: number; logged_at: string; weight_kg: number };
type StrengthLog = {
  id: number;
  logged_at: string;
  exercise: string;
  weight_kg: number;
  reps: number;
  sets: number;
};
type MealPlanHistory = {
  id: number;
  created_at: string;
  store: string;
  goal: string;
  total_calories: number | null;
  spent: number;
  meal_count: number;
};

const PRIMARY = "#2A9D67";
const ACCENT = "#eb6834";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-48 flex items-center justify-center text-sm text-ink/40 text-center px-6">
      {text}
    </div>
  );
}

export default function Progress() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [strengthLogs, setStrengthLogs] = useState<StrengthLog[]>([]);
  const [mealHistory, setMealHistory] = useState<MealPlanHistory[]>([]);

  const [weightInput, setWeightInput] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");
  const [strengthWeightInput, setStrengthWeightInput] = useState("");
  const [repsInput, setRepsInput] = useState("");
  const [setsInput, setSetsInput] = useState("3");
  const [selectedExercise, setSelectedExercise] = useState("");

  const [savingWeight, setSavingWeight] = useState(false);
  const [savingStrength, setSavingStrength] = useState(false);

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

  async function loadAll(userId: string) {
    const [{ data: w }, { data: s }, { data: m }] = await Promise.all([
      supabase
        .from("weight_logs")
        .select("id, logged_at, weight_kg")
        .eq("user_id", userId)
        .order("logged_at", { ascending: true }),
      supabase
        .from("strength_logs")
        .select("id, logged_at, exercise, weight_kg, reps, sets")
        .eq("user_id", userId)
        .order("logged_at", { ascending: true }),
      supabase
        .from("meal_plan_history")
        .select("id, created_at, store, goal, total_calories, spent, meal_count")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
    ]);
    setWeightLogs(w ?? []);
    setStrengthLogs(s ?? []);
    setMealHistory(m ?? []);
    if (s && s.length > 0) {
      setSelectedExercise((current) => current || s[s.length - 1].exercise);
    }
  }

  useEffect(() => {
    if (user) loadAll(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleLogWeight(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const weight = parseFloat(weightInput);
    if (!weight || weight <= 0) return;
    setSavingWeight(true);
    await supabase.from("weight_logs").insert({ user_id: user.id, weight_kg: weight });
    setWeightInput("");
    await loadAll(user.id);
    setSavingWeight(false);
  }

  async function handleLogStrength(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const weight = parseFloat(strengthWeightInput);
    const reps = parseInt(repsInput, 10);
    const sets = parseInt(setsInput, 10) || 1;
    if (!exerciseInput.trim() || !weight || !reps) return;
    setSavingStrength(true);
    await supabase.from("strength_logs").insert({
      user_id: user.id,
      exercise: exerciseInput.trim(),
      weight_kg: weight,
      reps,
      sets,
    });
    setStrengthWeightInput("");
    setRepsInput("");
    await loadAll(user.id);
    setSavingStrength(false);
  }

  if (checkingAuth) {
    return (
      <main className="flex-1 bg-paper text-ink flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  const weightChartData = weightLogs.map((w) => ({
    date: formatDate(w.logged_at),
    kg: Number(w.weight_kg),
  }));

  const exerciseNames = Array.from(new Set(strengthLogs.map((s) => s.exercise)));
  const strengthChartData = strengthLogs
    .filter((s) => s.exercise === selectedExercise)
    .map((s) => ({
      date: formatDate(s.logged_at),
      kg: Number(s.weight_kg),
      reps: s.reps,
    }));

  const calorieChartData = mealHistory.map((m) => ({
    date: formatDate(m.created_at),
    calories: m.total_calories ?? 0,
    spent: Number(m.spent),
  }));

  return (
    <main className="flex-1 bg-[#f9f9f7] text-ink px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Your Progress</h1>
          <p className="text-sm text-ink/50">Track your weight, strength, and calorie history over time.</p>
          <p className="text-xs text-ink/40 mt-1">
            For your own tracking only. Calorie history is based on the meal plans you generate, not what you
            actually ate, and none of this is medical advice.
          </p>
        </div>

        {/* Calorie / spend history — auto-populated from generated meal plans */}
        <ChartCard title="Calorie & spend history">
          {calorieChartData.length === 0 ? (
            <EmptyState text="Generate a meal plan on the dashboard to start building your history." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={calorieChartData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="#e1e0d9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="calories" name="Calories" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="spent" name="Spent (R)" stroke={ACCENT} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Weight tracking */}
          <div className="space-y-4">
            <ChartCard title="Weight trend">
              {weightChartData.length === 0 ? (
                <EmptyState text="Log your weight below to start tracking your trend." />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weightChartData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                    <CartesianGrid stroke="#e1e0d9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip formatter={(v) => `${v} kg`} />
                    <Line type="monotone" dataKey="kg" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <form
              onSubmit={handleLogWeight}
              className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm flex items-end gap-3"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Log weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="e.g. 72.5"
                  className="w-full border border-ink/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={savingWeight}
                className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Log
              </button>
            </form>
          </div>

          {/* Strength tracking */}
          <div className="space-y-4">
            <ChartCard title="Strength trend">
              {exerciseNames.length > 1 && (
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="mb-3 border border-ink/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {exerciseNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              )}
              {strengthChartData.length === 0 ? (
                <EmptyState text="Log a lift below to start tracking your strength trend." />
              ) : (
                <ResponsiveContainer width="100%" height={exerciseNames.length > 1 ? 188 : 220}>
                  <LineChart data={strengthChartData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                    <CartesianGrid stroke="#e1e0d9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
                    <Tooltip formatter={(v, name) => (name === "kg" ? `${v} kg` : v)} />
                    <Line type="monotone" dataKey="kg" stroke={ACCENT} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <form
              onSubmit={handleLogStrength}
              className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <label className="block text-sm font-medium">Log a lift</label>
              <input
                type="text"
                required
                value={exerciseInput}
                onChange={(e) => setExerciseInput(e.target.value)}
                placeholder="Exercise, e.g. Bench Press"
                className="w-full border border-ink/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={strengthWeightInput}
                  onChange={(e) => setStrengthWeightInput(e.target.value)}
                  placeholder="kg"
                  className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  min="1"
                  required
                  value={repsInput}
                  onChange={(e) => setRepsInput(e.target.value)}
                  placeholder="reps"
                  className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  min="1"
                  value={setsInput}
                  onChange={(e) => setSetsInput(e.target.value)}
                  placeholder="sets"
                  className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={savingStrength}
                className="w-full bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Log
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
