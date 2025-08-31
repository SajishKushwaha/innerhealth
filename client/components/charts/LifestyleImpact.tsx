import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { label: "Diet", positive: 32, negative: 8 },
  { label: "Exercise", positive: 44, negative: 6 },
  { label: "Stress", positive: 18, negative: 22 },
  { label: "Sleep", positive: 28, negative: 9 },
];

export default function LifestyleImpact() {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Lifestyle Habits Impact</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Legend wrapperStyle={{ color: "#CBD5E1" }} />
            <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
            <Bar dataKey="positive" stackId="a" name="Positive" fill="hsl(var(--neon-green))" />
            <Bar dataKey="negative" stackId="a" name="Negative" fill="hsl(var(--neon-violet))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
