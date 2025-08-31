import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts";

const ranges = {
  day: 24,
  week: 7,
  month: 30,
};

type RangeKey = keyof typeof ranges;

function generate(range: RangeKey) {
  const n = ranges[range];
  const data = Array.from({ length: n }, (_, i) => ({
    label: range === "day" ? `${i}:00` : `D${i + 1}`,
    hr: Math.round(65 + 10 * Math.sin(i / 2) + Math.random() * 6),
    sleep: Math.max(0, Math.round(8 + 2 * Math.sin(i / 4) + Math.random() * 2 - 1)),
    glucose: Math.round(90 + 25 * Math.sin(i / 3) + Math.random() * 10),
    activity: Math.max(0, Math.round(40 + 20 * Math.sin(i / 5) + Math.random() * 10)),
  }));
  return data;
}

export default function MultiMetricChart() {
  const [range, setRange] = useState<RangeKey>("week");
  const data = useMemo(() => generate(range), [range]);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Multi-metric Trends</h3>
        <div className="flex gap-1">
          {(["day", "week", "month"] as RangeKey[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs border ${range === r ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"}`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
            <Legend wrapperStyle={{ color: "#CBD5E1" }} />
            <Line type="monotone" dataKey="hr" name="HR" stroke="hsl(var(--neon-aqua))" dot={false} />
            <Line type="monotone" dataKey="sleep" name="Sleep" stroke="hsl(var(--neon-violet))" dot={false} />
            <Line type="monotone" dataKey="glucose" name="Glucose" stroke="hsl(var(--neon-green))" dot={false} />
            <Line type="monotone" dataKey="activity" name="Activity" stroke="#60A5FA" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
