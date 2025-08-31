import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { y: "Now", risk: 8 },
  { y: "+1y", risk: 10 },
  { y: "+2y", risk: 12 },
  { y: "+3y", risk: 13 },
  { y: "+4y", risk: 14 },
  { y: "+5y", risk: 15 },
];

export default function ForecastChart() {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Disease Risk Projection</h3>
        <span className="text-xs text-muted-foreground">1–5 years</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 10, right: 12, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="risk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--neon-violet))" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(var(--neon-violet))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="y" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis unit="%" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
            <Area type="monotone" dataKey="risk" stroke="hsl(var(--neon-violet))" fill="url(#risk)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
