"use client";

import { useState } from "react";
import { currency, formatAmount } from "@/lib/format";
import type { ShoppingItem } from "@/lib/planner";

const AISLE_ORDER = ["Produce", "Meat", "Dairy", "Bakery", "Frozen", "Canned Goods", "Grains", "Pantry"];

// Older or restricted browsers may not allow the async clipboard API.
function fallbackCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  textarea.remove();
  return ok;
}

export default function ShoppingListCard({
  items,
  total,
  portionTotal,
  leftoverValue,
}: {
  items: ShoppingItem[];
  total: number;
  portionTotal: number;
  leftoverValue: number;
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const groups = new Map<string, ShoppingItem[]>();
  for (const item of items) {
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  }
  const categories = Array.from(groups.keys()).sort((a, b) => {
    const ai = AISLE_ORDER.indexOf(a);
    const bi = AISLE_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  function toggle(id: number) {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function copyList() {
    const lines = ["Frugl shopping list (estimated prices)", ""];
    for (const category of categories) {
      lines.push(category);
      for (const item of groups.get(category) ?? []) {
        lines.push(`- ${item.packsToBuy} x ${item.packLabel} ${item.name} (${currency(item.lineTotal)})`);
      }
      lines.push("");
    }
    lines.push(`Estimated total: ${currency(total)}`);
    const text = lines.join("\n");

    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = fallbackCopy(text);
    }
    setCopyState(ok ? "copied" : "failed");
    setTimeout(() => setCopyState("idle"), 2500);
  }

  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div>
          <h3 className="font-semibold">Shopping list</h3>
          <p className="text-xs text-ink/50">
            {items.length} items, whole packs, with shared ingredients counted once
          </p>
        </div>
        <button
          type="button"
          onClick={copyList}
          className="text-sm text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors shrink-0"
        >
          {copyState === "copied" ? "Copied!" : copyState === "failed" ? "Couldn't copy" : "Copy list"}
        </button>
      </div>

      <div className="mt-4 space-y-5">
        {categories.map((category) => (
          <div key={category}>
            <p className="text-xs uppercase tracking-wide text-ink/50 font-medium mb-2">{category}</p>
            <ul className="divide-y divide-ink/5">
              {(groups.get(category) ?? []).map((item) => {
                const done = checked.has(item.ingredientId);
                return (
                  <li key={item.ingredientId} className="py-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(item.ingredientId)}
                        className="mt-1 h-4 w-4 accent-primary shrink-0"
                      />
                      <span className={`flex-1 min-w-0 ${done ? "opacity-40 line-through" : ""}`}>
                        <span className="block text-sm font-medium">{item.name}</span>
                        <span className="block text-xs text-ink/60">
                          {item.packsToBuy} × {item.packLabel}
                        </span>
                        <span className="block text-[11px] text-ink/40">
                          Meals use {formatAmount(item.needed)} {item.unit}
                          {item.leftover > 0.005
                            ? ` · ${formatAmount(item.leftover)} ${item.unit} left over`
                            : ""}
                        </span>
                      </span>
                      <span className={`text-sm font-medium shrink-0 ${done ? "opacity-40" : ""}`}>
                        {currency(item.lineTotal)}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between">
        <span className="font-semibold">Estimated shopping total</span>
        <span className="text-xl font-bold">{currency(total)}</span>
      </div>
      <p className="text-xs text-ink/50 mt-2">
        Your meals use about {currency(portionTotal)} of this. About {currency(leftoverValue)} of ingredients
        will be left over after cooking.
      </p>
    </div>
  );
}
