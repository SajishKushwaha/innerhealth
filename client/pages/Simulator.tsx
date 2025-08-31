import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

 type SimState = {
  quitSmoking: boolean;
  keto: boolean;
  dailyRun: boolean;
  extraSleep: number; // hours
 };

 function projectBaseline() {
  // 0..5 years, simple upward slope
  return [
    { y: "Now", risk: 9 },
    { y: "+1y", risk: 10 },
    { y: "+2y", risk: 11.5 },
    { y: "+3y", risk: 12.7 },
    { y: "+4y", risk: 13.8 },
    { y: "+5y", risk: 15 },
  ];
 }

 function deltaFrom(sim: SimState) {
  let delta = 0;
  if (sim.quitSmoking) delta -= 6;
  if (sim.keto) delta -= 2;
  if (sim.dailyRun) delta -= 4;
  delta -= sim.extraSleep * 1.2; // per extra hour of sleep
  return Math.max(-25, Math.min(0, delta));
 }

 export default function Simulator() {
  const [sim, setSim] = useState<SimState>({ quitSmoking: true, keto: false, dailyRun: true, extraSleep: 1 });
  const baseline = useMemo(() => projectBaseline(), []);
  const adj = useMemo(() => deltaFrom(sim), [sim]);
  const simulated = useMemo(() => baseline.map((p) => ({ ...p, risk: Math.max(1, +(p.risk + adj).toFixed(1)) })), [baseline, adj]);

  // Organ distribution tweak for donut (simple proportional adjustment)
  const organParts = useMemo(() => {
    const base = [
      { name: "Heart", value: 28, color: "hsl(var(--neon-aqua))" },
      { name: "Brain", value: 25, color: "#60A5FA" },
      { name: "Liver", value: 22, color: "hsl(var(--neon-violet))" },
      { name: "Lungs", value: 25, color: "hsl(var(--neon-green))" },
    ];
    const factor = 1 + adj / -50; // less risk => slightly smaller values
    return base.map((b) => ({ ...b, value: Math.max(10, Math.round(b.value * factor)) }));
  }, [adj]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-futuristic tracking-widest">Scenario Simulator</h1>
          <p className="text-sm text-muted-foreground">Toggle habits to see instant 1–5 year risk projections</p>
        </div>
        <div className="glass rounded-2xl px-4 py-2 text-sm">
          Projected 5y change: <span className="text-emerald-400 font-medium">{adj}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="glass rounded-2xl p-4 xl:col-span-1">
          <h3 className="font-medium mb-3">Adjust Habits</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-2">
              <span>Quit smoking</span>
              <input type="checkbox" checked={sim.quitSmoking} onChange={(e) => setSim({ ...sim, quitSmoking: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Keto diet</span>
              <input type="checkbox" checked={sim.keto} onChange={(e) => setSim({ ...sim, keto: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>5km run/day</span>
              <input type="checkbox" checked={sim.dailyRun} onChange={(e) => setSim({ ...sim, dailyRun: e.target.checked })} />
            </label>
            <div>
              <div className="flex items-center justify-between text-sm mb-1"><span>+ Sleep (hrs)</span><span>{sim.extraSleep}h</span></div>
              <input type="range" min={0} max={3} step={1} value={sim.extraSleep} onChange={(e) => setSim({ ...sim, extraSleep: Number(e.target.value) })} className="w-full" />
            </div>
            <div className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10 text-sm">
              Tip: Combine exercise + sleep for compounding benefits.
            </div>
          </div>
        </div>

        {/* Projection chart */}
        <div className="glass rounded-2xl p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Disease Risk Projection (1–5y)</h3></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart>
                <defs>
                  <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="sim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--neon-violet))" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(var(--neon-violet))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="y" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} allowDuplicatedCategory={false} />
                <YAxis unit="%" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ color: "#CBD5E1" }} />
                <Area dataKey="risk" name="Baseline" data={baseline} type="monotone" stroke="#94A3B8" fill="url(#base)" />
                <Area dataKey="risk" name="Simulated" data={simulated} type="monotone" stroke="hsl(var(--neon-violet))" fill="url(#sim)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Organ health donut (simulated distribution) */}
        <div className="glass rounded-2xl p-4 xl:col-span-1">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Organ Health (Simulated)</h3></div>
          {/* Reuse OrganDonut structure by inline Pie since OrganDonut uses fixed data; provide adapted markup here for autonomy */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={organParts} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {organParts.map((p, i) => (
                    <Cell key={i} fill={p.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 text-xs text-muted-foreground grid grid-cols-2 gap-x-4">
            {organParts.map((p) => (
              <li key={p.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: p.color }} />{p.name}: {p.value}%</li>
            ))}
          </ul>
        </div>

        {/* Summary deltas */}
        <div className="glass rounded-2xl p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Summary Impact</h3></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl p-4 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              <div className="text-xs text-muted-foreground">5y Risk Change</div>
              <div className="text-2xl font-semibold text-emerald-400">{adj}%</div>
            </div>
            <div className="rounded-xl p-4 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              <div className="text-xs text-muted-foreground">Heart Focus</div>
              <div className="text-2xl font-semibold">Improved</div>
            </div>
            <div className="rounded-xl p-4 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              <div className="text-xs text-muted-foreground">Glucose Peaks</div>
              <div className="text-2xl font-semibold">Lower</div>
            </div>
            <div className="rounded-xl p-4 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              <div className="text-xs text-muted-foreground">VO₂ Max</div>
              <div className="text-2xl font-semibold">Higher</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 }
