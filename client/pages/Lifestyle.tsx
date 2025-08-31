import { useMemo, useState } from "react";
import CountUp from "../components/common/CountUp";
import LifestyleImpact from "../components/charts/LifestyleImpact";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

 type RangeKey = "day" | "week" | "month";
 const ranges: Record<RangeKey, number> = { day: 24, week: 7, month: 30 };

 type Point = { label: string; steps: number; active: number; sleep: number; calIn: number; calOut: number; water: number; stress: number };

 function gen(range: RangeKey): Point[] {
  const n = ranges[range];
  return Array.from({ length: n }, (_, i) => {
    const label = range === "day" ? `${i}:00` : `D${i + 1}`;
    const steps = Math.max(0, Math.round(8000 + 2500 * Math.sin(i / 3) + Math.random() * 800 - 400));
    const active = Math.max(0, Math.round(45 + 25 * Math.sin(i / 2.5) + Math.random() * 10));
    const sleep = +(7 + 1.2 * Math.sin(i / 3.5) + (Math.random() * 0.8 - 0.4)).toFixed(1);
    const calIn = Math.round(2200 + 300 * Math.sin(i / 4) + Math.random() * 200);
    const calOut = Math.round(2000 + 350 * Math.sin(i / 3.2) + Math.random() * 220);
    const water = +(2.2 + 0.8 * Math.sin(i / 5) + (Math.random() * 0.4 - 0.2)).toFixed(1);
    const stress = Math.max(1, Math.min(5, Math.round(3 + 1.2 * Math.sin(i / 4) + (Math.random() * 1 - 0.5))));
    return { label, steps, active, sleep, calIn, calOut, water, stress };
  });
 }

 function Metric({ title, value, unit, color, bar }: { title: string; value: number; unit?: string; color: string; bar?: { max: number } }) {
  const pct = bar ? Math.min(100, (value / bar.max) * 100) : 0;
  return (
    <div className="glass rounded-2xl p-4 card-glow">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-semibold" style={{ color }}>
        <CountUp to={value} /> {unit}
      </div>
      {bar && (
        <div className="mt-3 h-2 w-full bg-white/10 rounded">
          <div className="h-full rounded bg-[linear-gradient(90deg,hsl(var(--neon-aqua)),hsl(var(--neon-violet)))]" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
 }

 export default function Lifestyle() {
  const [range, setRange] = useState<RangeKey>("week");
  const data = useMemo(() => gen(range), [range]);
  const latest = data[data.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-futuristic tracking-widest">Lifestyle</h1>
          <p className="text-sm text-muted-foreground">Activity, sleep, calories, hydration & stress</p>
        </div>
        <div className="flex gap-2">
          {(["day","week","month"] as RangeKey[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-xs border ${range===r?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}`}>{r.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        <Metric title="Steps" value={latest.steps} unit="" color="hsl(var(--neon-green))" bar={{ max: 10000 }} />
        <Metric title="Active Minutes" value={latest.active} unit="min" color="#60A5FA" bar={{ max: 60 }} />
        <Metric title="Sleep" value={latest.sleep} unit="hrs" color="hsl(var(--neon-violet))" bar={{ max: 8 }} />
        <Metric title="Hydration" value={latest.water} unit="L" color="hsl(var(--neon-aqua))" bar={{ max: 3 }} />
        <Metric title="Calories In" value={latest.calIn} unit="kcal" color="#FDE047" />
        <Metric title="Calories Out" value={latest.calOut} unit="kcal" color="#34D399" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Activity & Steps</h3></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ color: "#CBD5E1" }} />
                <Line yAxisId="left" type="monotone" dataKey="steps" name="Steps" stroke="hsl(var(--neon-green))" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="active" name="Active (min)" stroke="#60A5FA" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Calories In vs Out</h3></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FDE047" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FDE047" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="calIn" name="Calories In" stroke="#FDE047" fill="url(#in)" />
                <Area type="monotone" dataKey="calOut" name="Calories Out" stroke="#34D399" fill="url(#out)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <LifestyleImpact />
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Sleep & Stress Snapshot</h3></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ color: "#CBD5E1" }} />
                <Bar dataKey="sleep" name="Sleep (hrs)" fill="hsl(var(--neon-violet))" />
                <Bar dataKey="stress" name="Stress (1-5)" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Recent Lifestyle Logs</h3></div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="text-left">
                <th className="py-2 pr-4 font-medium">Period</th>
                <th className="py-2 pr-4 font-medium">Steps</th>
                <th className="py-2 pr-4 font-medium">Active (min)</th>
                <th className="py-2 pr-4 font-medium">Sleep (hrs)</th>
                <th className="py-2 pr-4 font-medium">Water (L)</th>
                <th className="py-2 pr-4 font-medium">Cal In</th>
                <th className="py-2 pr-4 font-medium">Cal Out</th>
                <th className="py-2 pr-4 font-medium">Stress</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-10).map((d, idx) => (
                <tr key={idx} className="border-t border-white/10">
                  <td className="py-2 pr-4">{d.label}</td>
                  <td className="py-2 pr-4">{d.steps}</td>
                  <td className="py-2 pr-4">{d.active}</td>
                  <td className="py-2 pr-4">{d.sleep}</td>
                  <td className="py-2 pr-4">{d.water}</td>
                  <td className="py-2 pr-4">{d.calIn}</td>
                  <td className="py-2 pr-4">{d.calOut}</td>
                  <td className="py-2 pr-4">{d.stress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
 }
