import { useMemo, useState } from "react";

const foods = [
  { name: "Oats + berries + chia", tags: ["glucose", "heart", "veg"], kcal: 380, gi: "low" },
  { name: "Grilled salmon + quinoa + greens", tags: ["heart", "weight"], kcal: 520, gi: "low" },
  { name: "Paneer salad + olive oil", tags: ["keto", "veg", "weight"], kcal: 430, gi: "low" },
  { name: "Chicken stir-fry + veggies", tags: ["glucose", "weight"], kcal: 480, gi: "medium" },
  { name: "Tofu scramble + avocado", tags: ["veg", "heart", "keto"], kcal: 420, gi: "low" },
  { name: "Greek yogurt + nuts", tags: ["glucose", "weight"], kcal: 320, gi: "low" },
  { name: "Lentil soup + salad", tags: ["veg", "heart"], kcal: 450, gi: "low" },
  { name: "Egg omelette + spinach", tags: ["keto", "glucose"], kcal: 360, gi: "low" },
];

type Goal = "heart" | "glucose" | "weight" | "keto" | "veg";

export default function FoodSuggestions() {
  const [goals, setGoals] = useState<Goal[]>(["heart", "glucose"]);
  const filtered = useMemo(() => {
    if (goals.length === 0) return foods;
    return foods.filter((f) => goals.every((g) => f.tags.includes(g)));
  }, [goals]);

  const toggle = (g: Goal) => setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Food Suggestions</h3>
        <span className="text-xs text-muted-foreground">AI‑guided</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {(["heart", "glucose", "weight", "keto", "veg"] as Goal[]).map((g) => (
          <button key={g} onClick={() => toggle(g)} className={`px-2.5 py-1.5 rounded-lg text-xs border ${goals.includes(g) ? "bg-white/10 border-white/20" : "bg-white/80 dark:bg-white/5 border-black/15 dark:border-white/10"}`}>
            {g}
          </button>
        ))}
      </div>
      <ul className="grid sm:grid-cols-2 gap-3 text-sm">
        {filtered.slice(0, 6).map((f, i) => (
          <li key={i} className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
            <div className="font-medium">{f.name}</div>
            <div className="text-xs text-muted-foreground">{f.kcal} kcal • GI: {f.gi}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => alert("Added to meal plan")} className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs">Add</button>
              <button onClick={() => alert("Replaced suggestion")} className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs">Replace</button>
            </div>
          </li>
        ))}
        {filtered.length === 0 && <li className="text-xs text-muted-foreground">No foods match current filters</li>}
      </ul>
    </div>
  );
}
