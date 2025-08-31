import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const parts = [
  { name: "Heart", value: 28, color: "hsl(var(--neon-aqua))" },
  { name: "Brain", value: 25, color: "#60A5FA" },
  { name: "Liver", value: 22, color: "hsl(var(--neon-violet))" },
  { name: "Lungs", value: 25, color: "hsl(var(--neon-green))" },
];

export default function OrganDonut() {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Organ Health Distribution</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={parts} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
              {parts.map((p, i) => (
                <Cell key={i} fill={p.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
