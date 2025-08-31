import { useMemo, useState } from "react";
import CountUp from "../components/common/CountUp";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, CartesianGrid, Legend } from "recharts";

type RangeKey = "day" | "week" | "month";

const ranges: Record<RangeKey, number> = { day: 24, week: 7, month: 30 };

function gen(range: RangeKey) {
  const n = ranges[range];
  return Array.from({ length: n }, (_, i) => {
    const label = range === "day" ? `${i}:00` : `D${i + 1}`;
    const hr = Math.round(65 + 10 * Math.sin(i / 2) + Math.random() * 6);
    const spo2 = Math.round(96 + 2 * Math.sin(i / 4) + Math.random() * 1.2);
    const resp = Math.round(14 + 3 * Math.sin(i / 3) + Math.random() * 2);
    const temp = +(36.6 + 0.4 * Math.sin(i / 5) + (Math.random() * 0.2 - 0.1)).toFixed(1);
    const sys = Math.round(118 + 7 * Math.sin(i / 6) + Math.random() * 6);
    const dia = Math.round(76 + 5 * Math.cos(i / 6) + Math.random() * 4);
    const glucose = Math.round(95 + 20 * Math.sin(i / 3) + Math.random() * 12);
    return { label, hr, spo2, resp, temp, sys, dia, glucose };
  });
}

function MetricCard({ title, value, unit, color, children }: { title: string; value: number | string; unit?: string; color: string; children?: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4 card-glow">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-semibold" style={{ color }}>{typeof value === 'number' ? <CountUp to={value} /> : value} {unit}</div>
      {children}
    </div>
  );
}

export default function Vitals() {
  const [range, setRange] = useState<RangeKey>("week");
  const data = useMemo(() => gen(range), [range]);
  const latest = data[data.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-futuristic tracking-widest">Vitals</h1>
          <p className="text-sm text-muted-foreground">Key health metrics with trends</p>
        </div>
        <div className="flex gap-2">
          {(["day","week","month"] as RangeKey[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-xs border ${range===r?"bg-white/10 border-white/20":"bg-white/5 border-white/10"}`}>{r.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Heart Rate" value={latest.hr} unit="bpm" color="hsl(var(--neon-aqua))">
          <div className="mt-3 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <Line type="monotone" dataKey="hr" stroke="hsl(var(--neon-aqua))" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>
        <MetricCard title="SpO₂" value={latest.spo2} unit="%" color="hsl(var(--neon-green))">
          <div className="mt-3 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--neon-green))" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(var(--neon-green))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="spo2" stroke="hsl(var(--neon-green))" fill="url(#spo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>
        <MetricCard title="Blood Pressure" value={`${latest.sys}/${latest.dia}`} unit="mmHg" color="hsl(var(--neon-violet))">
          <div className="mt-3 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <Line type="monotone" dataKey="sys" stroke="hsl(var(--neon-violet))" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="dia" stroke="#60A5FA" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>
        <MetricCard title="Resp. Rate" value={latest.resp} unit="/min" color="#60A5FA">
          <div className="mt-3 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <Line type="monotone" dataKey="resp" stroke="#60A5FA" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Heart & Respiration</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ color: "#CBD5E1" }} />
                <Line type="monotone" dataKey="hr" name="HR" stroke="hsl(var(--neon-aqua))" dot={false} />
                <Line type="monotone" dataKey="resp" name="Resp" stroke="#60A5FA" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Glucose & Temperature</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ color: "#CBD5E1" }} />
                <Line yAxisId="left" type="monotone" dataKey="glucose" name="Glucose (mg/dL)" stroke="hsl(var(--neon-violet))" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="temp" name="Temp (°C)" stroke="hsl(var(--neon-green))" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Recent Readings</h3>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="text-left">
                <th className="py-2 pr-4 font-medium">Time</th>
                <th className="py-2 pr-4 font-medium">HR</th>
                <th className="py-2 pr-4 font-medium">SpO₂</th>
                <th className="py-2 pr-4 font-medium">BP</th>
                <th className="py-2 pr-4 font-medium">Resp</th>
                <th className="py-2 pr-4 font-medium">Temp</th>
                <th className="py-2 pr-4 font-medium">Glucose</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-10).map((d, idx) => (
                <tr key={idx} className="border-t border-white/10">
                  <td className="py-2 pr-4">{d.label}</td>
                  <td className="py-2 pr-4">{d.hr} bpm</td>
                  <td className="py-2 pr-4">{d.spo2}%</td>
                  <td className="py-2 pr-4">{d.sys}/{d.dia} mmHg</td>
                  <td className="py-2 pr-4">{d.resp}/min</td>
                  <td className="py-2 pr-4">{d.temp}°C</td>
                  <td className="py-2 pr-4">{d.glucose} mg/dL</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
