import { useEffect, useMemo, useState } from "react";
import CountUp from "../components/common/CountUp";
import ECGSparkline from "../components/charts/ECGSparkline";
import MultiMetricChart from "../components/charts/MultiMetricChart";
import ForecastChart from "../components/charts/ForecastChart";
import OrganDonut from "../components/charts/OrganDonut";
import LifestyleImpact from "../components/charts/LifestyleImpact";
import Avatar from "../components/three/Avatar";
import MedicineAlerts from "../components/health/MedicineAlerts";
import FoodSuggestions from "../components/health/FoodSuggestions";
import { Activity, ArrowDownRight, ArrowUpRight, Brain, Footprints, HeartPulse, Moon, Scale, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function Ring({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={80} height={80} className="block">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--neon-aqua))" />
          <stop offset="100%" stopColor="hsl(var(--neon-violet))" />
        </linearGradient>
      </defs>
      <circle cx={40} cy={40} r={radius} stroke="rgba(255,255,255,.12)" strokeWidth={8} fill="none" />
      <circle
        cx={40}
        cy={40}
        r={radius}
        stroke="url(#ring)"
        strokeWidth={8}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-white font-semibold">
        {Math.round(value)}%
      </text>
    </svg>
  );
}

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex items-end gap-1 h-12">
      {values.map((v, i) => (
        <div key={i} className="w-2 rounded bg-white/10 overflow-hidden">
          <div className="w-full bg-[linear-gradient(180deg,hsl(var(--neon-aqua)),hsl(var(--neon-violet)))]" style={{ height: `${(v / max) * 100}%` }} />
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const [health, setHealth] = useState(86);
  useEffect(() => {
    const id = setInterval(() => setHealth((h) => Math.max(70, Math.min(96, h + (Math.random() * 2 - 1)))), 5000);
    return () => clearInterval(id);
  }, []);

  const [spo2, setSpo2] = useState(98);
  const [glucose, setGlucose] = useState(105);
  const [sleep, setSleep] = useState([7, 6, 8, 7.5, 6.5, 7.8, 8.2]);
  const [stress, setStress] = useState(3);
  const [calIn, setCalIn] = useState(2100);
  const [calOut, setCalOut] = useState(1900);
  const [steps, setSteps] = useState(6800);

  // Simulator state
  const [sim, setSim] = useState({ quitSmoking: true, keto: false, dailyRun: true, extraSleep: 1 });
  const projectedRiskDelta = useMemo(() => {
    let delta = 0;
    if (sim.quitSmoking) delta -= 6;
    if (sim.keto) delta -= 2;
    if (sim.dailyRun) delta -= 4;
    delta -= sim.extraSleep * 1.2;
    return Math.max(-20, Math.min(0, delta));
  }, [sim]);

  const comparison = [
    { label: "HR", me: 72, pop: 78 },
    { label: "Sleep", me: 7.4, pop: 6.6 },
    { label: "Glucose", me: 102, pop: 110 },
    { label: "Activity", me: 62, pop: 48 },
  ];

  return (
    <div className="space-y-6">
      {/* Export/Share */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-futuristic tracking-widest">BioTwin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your digital health twin – live vitals, forecasts & simulations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Export PDF</button>
          <button
            onClick={async () => {
              const url = window.location.href;
              try {
                if ((navigator as any).share) await (navigator as any).share({ title: "BioTwin", url });
                else await navigator.clipboard.writeText(url);
              } catch {}
            }}
            className="px-4 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Share Link
          </button>
        </div>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
        <div className="glass rounded-2xl p-4 flex items-center gap-4 card-glow">
          <Ring value={health} />
          <div>
            <div className="text-sm text-muted-foreground">Overall Health</div>
            <div className="text-xl font-semibold"><CountUp to={health} suffix="%" /></div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4 card-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><HeartPulse className="text-neon-aqua" /><span>Heart Rate</span></div>
            <span className="text-xs text-emerald-400 flex items-center gap-1"><ArrowDownRight className="h-4 w-4" />1.2%</span>
          </div>
          <div className="mt-2">
            <ECGSparkline />
          </div>
          <div className="text-sm"><CountUp to={72} /> bpm</div>
        </div>
        <div className="glass rounded-2xl p-4 card-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Zap className="text-neon-green" /><span>Oxygen</span></div>
            <span className="text-xs text-emerald-400 flex items-center gap-1"><ArrowUpRight className="h-4 w-4" />0.3%</span>
          </div>
          <div className="mt-4 text-2xl font-semibold"><CountUp to={spo2} />%</div>
          <div className="text-xs text-muted-foreground">SpO₂ saturation</div>
        </div>
        <div className="glass rounded-2xl p-4 card-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Activity className="text-blue-400" /><span>Glucose</span></div>
            <span className="text-xs text-red-400 flex items-center gap-1"><ArrowUpRight className="h-4 w-4" />1.1%</span>
          </div>
          <div className="mt-4 text-2xl font-semibold"><CountUp to={glucose} /> mg/dL</div>
          <div className="text-xs text-muted-foreground">7-day trend</div>
        </div>
        <div className="glass rounded-2xl p-4 card-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Moon className="text-violet-400" /><span>Sleep</span></div>
          </div>
          <div className="mt-2"><MiniBars values={sleep as number[]} /></div>
          <div className="text-sm"><CountUp to={sleep[sleep.length - 1]} decimals={1} /> hrs</div>
        </div>
        <div className="glass rounded-2xl p-4 card-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Scale className="text-amber-300" /><span>Stress</span></div>
          </div>
          <div className="mt-2 text-3xl">{["😌","🙂","😐","😟","😣"][stress-1] || "🙂"}</div>
          <div className="text-xs text-muted-foreground">Level {stress}/5</div>
        </div>
        <div className="glass rounded-2xl p-4 card-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><img src="/placeholder.svg" className="h-5 w-5 opacity-60" /><span>Calories</span></div>
          </div>
          <div className="mt-3 h-3 w-full bg-white/10 rounded">
            <div className="h-full rounded bg-[linear-gradient(90deg,hsl(var(--neon-aqua)),hsl(var(--neon-violet)))]" style={{ width: `${Math.min(100, (calOut / calIn) * 100)}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{calOut} out / {calIn} in</div>
        </div>
        <div className="glass rounded-2xl p-4 card-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Footprints className="text-emerald-400" /><span>Steps</span></div>
          </div>
          <div className="mt-3 h-3 w-full bg-white/10 rounded">
            <div className="h-full rounded bg-[linear-gradient(90deg,hsl(var(--neon-green)),#60A5FA)]" style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1"><CountUp to={steps} /> / 10,000</div>
        </div>
      </div>

      {/* Centerpiece + Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1">
          <Avatar />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="glass rounded-2xl p-4">
              <div className="text-sm text-muted-foreground">Organ Focus</div>
              <div className="mt-1 font-medium flex items-center gap-2"><Brain className="h-4 w-4 text-neon-violet" /> Brain: Optimal</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="text-sm text-muted-foreground">Risk Alerts</div>
              <div className="mt-1 font-medium text-amber-300">Glucose post-meal spikes</div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MultiMetricChart />
          <ForecastChart />
          <OrganDonut />
          <LifestyleImpact />
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* AI Insights */}
        <div className="xl:col-span-1 glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">AI Insights</h3>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
          <ul className="space-y-3">
            <li className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              Improve sleep by 1.5h → lower heart risk by 12%.
            </li>
            <li className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              5km run/day projected to increase VO₂ max by 9%.
            </li>
            <li className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              Consider lower-GI breakfast to reduce glucose peaks.
            </li>
          </ul>
        </div>

        {/* Scenario Simulator */}
        <div className="xl:col-span-1 glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Scenario Simulator</h3>
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-2">
              <span>Quit smoking</span>
              <input type="checkbox" checked={sim.quitSmoking} onChange={(e) => setSim({ ...sim, quitSmoking: e.target.checked })} className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Keto diet</span>
              <input type="checkbox" checked={sim.keto} onChange={(e) => setSim({ ...sim, keto: e.target.checked })} className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>5km run/day</span>
              <input type="checkbox" checked={sim.dailyRun} onChange={(e) => setSim({ ...sim, dailyRun: e.target.checked })} className="h-4 w-4" />
            </label>
            <div>
              <div className="flex items-center justify-between text-sm"><span>+ Sleep (hrs)</span><span>{sim.extraSleep}h</span></div>
              <input type="range" min={0} max={3} step={1} value={sim.extraSleep} onChange={(e) => setSim({ ...sim, extraSleep: Number(e.target.value) })} className="w-full" />
            </div>
            <div className="p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              Projected 5y risk change: <span className="text-emerald-400 font-medium">{projectedRiskDelta}%</span>
            </div>
          </div>
        </div>

        {/* Comparison View */}
        <div className="xl:col-span-1 glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Comparison: Me vs Population</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,.9)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Bar dataKey="me" name="Me" fill="hsl(var(--neon-aqua))" />
                <Bar dataKey="pop" name="Population" fill="hsl(var(--neon-violet))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Health Assistants */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/** Medicine Alerts and Food Suggestions */}
        <MedicineAlerts />
        <FoodSuggestions />
      </div>
    </div>
  );
}
