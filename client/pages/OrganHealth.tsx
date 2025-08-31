import { useMemo, useState } from "react";
import Avatar from "../components/three/Avatar";
import CountUp from "../components/common/CountUp";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

 type OrganKey = "heart" | "lungs" | "liver" | "brain";

 const organMeta: Record<OrganKey, { name: string; color: string }> = {
  heart: { name: "Heart", color: "hsl(var(--neon-aqua))" },
  lungs: { name: "Lungs", color: "#60A5FA" },
  liver: { name: "Liver", color: "hsl(var(--neon-green))" },
  brain: { name: "Brain", color: "hsl(var(--neon-violet))" },
 };

 function genSeries(key: OrganKey, n = 30) {
  return Array.from({ length: n }, (_, i) => ({
    label: `D${i + 1}`,
    score:
      key === "heart"
        ? Math.round(78 + 8 * Math.sin(i / 4) + Math.random() * 4)
        : key === "lungs"
        ? Math.round(82 + 6 * Math.cos(i / 5) + Math.random() * 3)
        : key === "liver"
        ? Math.round(75 + 7 * Math.sin(i / 6) + Math.random() * 3)
        : Math.round(88 + 4 * Math.cos(i / 7) + Math.random() * 2),
  }));
 }

 function genFactors(key: OrganKey) {
  const base = {
    heart: { diet: 28, exercise: 34, stress: 20, sleep: 18 },
    lungs: { diet: 18, exercise: 26, stress: 22, sleep: 34 },
    liver: { diet: 36, exercise: 22, stress: 18, sleep: 24 },
    brain: { diet: 22, exercise: 24, stress: 28, sleep: 26 },
  }[key];
  return [
    { label: "Diet", value: base.diet },
    { label: "Exercise", value: base.exercise },
    { label: "Stress", value: base.stress },
    { label: "Sleep", value: base.sleep },
  ];
 }

 function organDistribution() {
  return [
    { name: "Heart", key: "heart", value: 28, color: "hsl(var(--neon-aqua))" },
    { name: "Brain", key: "brain", value: 25, color: "hsl(var(--neon-violet))" },
    { name: "Liver", key: "liver", value: 22, color: "hsl(var(--neon-green))" },
    { name: "Lungs", key: "lungs", value: 25, color: "#60A5FA" },
  ] as { name: string; key: OrganKey | string; value: number; color: string }[];
 }

 function ScoreCard({ organ, score }: { organ: OrganKey; score: number }) {
  const meta = organMeta[organ];
  return (
    <div className="glass rounded-2xl p-4 card-glow cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{meta.name}</div>
        <span className="px-2 py-0.5 rounded-lg text-[10px] border border-white/10" style={{ color: meta.color }}>OK</span>
      </div>
      <div className="mt-1 text-2xl font-semibold" style={{ color: meta.color }}>
        <CountUp to={score} />
      </div>
      <div className="text-xs text-muted-foreground">Health score</div>
    </div>
  );
 }

 export default function OrganHealth() {
  const [selected, setSelected] = useState<OrganKey>("heart");
  const series = useMemo(() => genSeries(selected), [selected]);
  const factors = useMemo(() => genFactors(selected), [selected]);
  const dist = useMemo(() => organDistribution(), []);

  const latestScores: Record<OrganKey, number> = {
    heart: series[series.length - 1]?.score || 84,
    lungs: 86,
    liver: 81,
    brain: 92,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-futuristic tracking-widest">Organ Health</h1>
          <p className="text-sm text-muted-foreground">Click an organ to focus. See scores, trends, and contributing factors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1">
          <Avatar onOrganHover={(o) => o && setSelected(o.id as OrganKey)} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(Object.keys(organMeta) as OrganKey[]).map((k) => (
              <div key={k} onClick={() => setSelected(k)}>
                <ScoreCard organ={k} score={latestScores[k]} />
              </div>
            ))}
          </div>
        </div>
        <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{organMeta[selected].name} Score Trend</h3>
              <span className="text-xs text-muted-foreground">Last 30 days</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="score" name="Score" stroke={organMeta[selected].color} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Organ Health Distribution</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dist} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                    {dist.map((p, i) => (
                      <Cell key={i} fill={p.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{organMeta[selected].name} – Contributing Factors</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={factors} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
              <Legend wrapperStyle={{ color: "#CBD5E1" }} />
              <Bar dataKey="value" name="Impact" fill={organMeta[selected].color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Recent {organMeta[selected].name} Notes</h3>
        </div>
        <ul className="grid md:grid-cols-2 gap-3 text-sm">
          <li className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">Improved {organMeta[selected].name.toLowerCase()} recovery during sleep over the last week.</li>
          <li className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">Lifestyle changes reduced stress impact by ~8%.</li>
          <li className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">Keep hydration at 2.5L/day to sustain optimal function.</li>
          <li className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">Consider meditation 10m/day for additional gains.</li>
        </ul>
      </div>
    </div>
  );
 }
