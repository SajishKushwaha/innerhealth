import { useEffect, useRef, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

export default function ECGSparkline() {
  const [data, setData] = useState<{ t: number; v: number }[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({ t: i, v: Math.sin(i / 2) * 20 + 70 }))
  );
  const tRef = useRef(40);

  useEffect(() => {
    const id = setInterval(() => {
      tRef.current += 1;
      setData((prev) => {
        const next = prev.slice(-39);
        const ecg = (n: number) => {
          const base = Math.sin(n / 2) * 6 + 72;
          const spike = (n % 30 === 0) ? 35 : 0;
          return base + spike + Math.random() * 2 - 1;
        };
        next.push({ t: tRef.current, v: ecg(tRef.current) });
        return next;
      });
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <Line type="monotone" dataKey="v" stroke="hsl(var(--neon-aqua))" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
