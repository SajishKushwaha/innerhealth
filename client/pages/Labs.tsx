import { useMemo, useState } from "react";
import CountUp from "../components/common/CountUp";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

 type RangeKey = "1m" | "3m" | "6m" | "12m";
 const ranges: Record<RangeKey, number> = { "1m": 4, "3m": 12, "6m": 24, "12m": 48 };

 type LabPoint = {
  label: string;
  a1c: number; // %
  ldl: number; // mg/dL
  hdl: number; // mg/dL
  tg: number; // mg/dL
  crp: number; // mg/L
  alt: number; // U/L
  ast: number; // U/L
  creat: number; // mg/dL
  egfr: number; // mL/min/1.73m2
 };

 const ref = {
  a1c: { low: 4.0, high: 5.6 },
  ldl: { low: 0, high: 100 },
  hdl: { low: 40, high: 999 },
  tg: { low: 0, high: 150 },
  crp: { low: 0, high: 3 },
  alt: { low: 7, high: 56 },
  ast: { low: 10, high: 40 },
  creat: { low: 0.6, high: 1.3 },
  egfr: { low: 90, high: 999 },
 } as const;

 function statusOf(value: number, key: keyof typeof ref) {
  const r = ref[key];
  if (value < r.low) return { label: "LOW", color: "#60A5FA" };
  if (value > r.high) return { label: "HIGH", color: "#F97316" };
  return { label: "OK", color: "#10B981" };
 }

 function gen(range: RangeKey): LabPoint[] {
  const n = ranges[range];
  return Array.from({ length: n }, (_, i) => {
    const label = `W${i + 1}`;
    const a1c = +(5.2 + 0.4 * Math.sin(i / 8) + (Math.random() * 0.2 - 0.1)).toFixed(1);
    const ldl = Math.round(95 + 18 * Math.sin(i / 6) + Math.random() * 10);
    const hdl = Math.round(52 + 8 * Math.cos(i / 7) + Math.random() * 6);
    const tg = Math.round(135 + 30 * Math.sin(i / 5) + Math.random() * 20);
    const crp = +(1.6 + 0.9 * Math.sin(i / 4) + (Math.random() * 0.6 - 0.3)).toFixed(1);
    const alt = Math.round(28 + 10 * Math.sin(i / 9) + Math.random() * 6);
    const ast = Math.round(24 + 8 * Math.cos(i / 9) + Math.random() * 5);
    const creat = +(1.0 + 0.1 * Math.sin(i / 12) + (Math.random() * 0.05 - 0.02)).toFixed(2);
    const egfr = Math.round(96 + 8 * Math.cos(i / 10) + Math.random() * 4);
    return { label, a1c, ldl, hdl, tg, crp, alt, ast, creat, egfr };
  });
 }

 function Chip({ text, color }: { text: string; color: string }) {
  return (
    <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium border border-white/10" style={{ color }}>{text}</span>
  );
 }

 function Panel({ title, value, unit, stat }: { title: string; value: number | string; unit: string; stat?: { label: string; color: string } }) {
  return (
    <div className="glass rounded-2xl p-4 card-glow">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        {stat && <Chip text={stat.label} color={stat.color} />}
      </div>
      <div className="mt-1 text-2xl font-semibold">{typeof value === 'number' ? <CountUp to={value} /> : value} {unit}</div>
    </div>
  );
 }

 export default function Labs() {
  const [range, setRange] = useState<RangeKey>("3m");
  const data = useMemo(() => gen(range), [range]);
  const latest = data[data.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-futuristic tracking-widest">Labs</h1>
          <p className="text-sm text-muted-foreground">Key lab results, trends and flags</p>
        </div>
        <div className="flex gap-2">
          {(["1m","3m","6m","12m"] as RangeKey[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-xs border ${range===r?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}`}>{r.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Top lab panels */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <Panel title="HbA1c" value={latest.a1c} unit="%" stat={statusOf(latest.a1c, 'a1c')} />
        <Panel title="LDL" value={latest.ldl} unit="mg/dL" stat={statusOf(latest.ldl, 'ldl')} />
        <Panel title="HDL" value={latest.hdl} unit="mg/dL" stat={statusOf(latest.hdl, 'hdl')} />
        <Panel title="Triglycerides" value={latest.tg} unit="mg/dL" stat={statusOf(latest.tg, 'tg')} />
        <Panel title="CRP" value={latest.crp} unit="mg/L" stat={statusOf(latest.crp, 'crp')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Metabolic & Inflammation Trends</h3></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ color: "#CBD5E1" }} />
                <Line type="monotone" dataKey="a1c" name="HbA1c (%)" stroke="hsl(var(--neon-violet))" dot={false} />
                <Line type="monotone" dataKey="ldl" name="LDL" stroke="hsl(var(--neon-aqua))" dot={false} />
                <Line type="monotone" dataKey="crp" name="CRP" stroke="hsl(var(--neon-green))" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Liver & Kidney Snapshot</h3></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="alt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--neon-aqua))" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(var(--neon-aqua))" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="egfr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--neon-green))" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(var(--neon-green))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ color: "#CBD5E1" }} />
                <Area type="monotone" dataKey="alt" name="ALT (U/L)" stroke="hsl(var(--neon-aqua))" fill="url(#alt)" />
                <Area type="monotone" dataKey="ast" name="AST (U/L)" stroke="#60A5FA" fill="#60A5FA22" />
                <Area type="monotone" dataKey="egfr" name="eGFR" stroke="hsl(var(--neon-green))" fill="url(#egfr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2"><h3 className="font-medium">Recent Lab Results</h3></div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="text-left">
                <th className="py-2 pr-4 font-medium">Period</th>
                <th className="py-2 pr-4 font-medium">HbA1c</th>
                <th className="py-2 pr-4 font-medium">LDL</th>
                <th className="py-2 pr-4 font-medium">HDL</th>
                <th className="py-2 pr-4 font-medium">Trig</th>
                <th className="py-2 pr-4 font-medium">CRP</th>
                <th className="py-2 pr-4 font-medium">ALT</th>
                <th className="py-2 pr-4 font-medium">AST</th>
                <th className="py-2 pr-4 font-medium">Creat</th>
                <th className="py-2 pr-4 font-medium">eGFR</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-10).map((d, idx) => (
                <tr key={idx} className="border-t border-white/10">
                  <td className="py-2 pr-4">{d.label}</td>
                  <td className="py-2 pr-4">{d.a1c}%</td>
                  <td className="py-2 pr-4">{d.ldl}</td>
                  <td className="py-2 pr-4">{d.hdl}</td>
                  <td className="py-2 pr-4">{d.tg}</td>
                  <td className="py-2 pr-4">{d.crp}</td>
                  <td className="py-2 pr-4">{d.alt}</td>
                  <td className="py-2 pr-4">{d.ast}</td>
                  <td className="py-2 pr-4">{d.creat}</td>
                  <td className="py-2 pr-4">{d.egfr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
 }
