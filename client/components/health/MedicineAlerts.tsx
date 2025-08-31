import { useEffect, useMemo, useState } from "react";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

type Med = {
  id: string;
  name: string;
  dose: string;
  time: string; // HH:MM 24h
  lastTaken?: number; // ts
};

function nextDueTimestamp(time: string, lastTaken?: number) {
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  const now = new Date();
  const due = new Date();
  due.setHours(hh, mm, 0, 0);
  if (lastTaken && lastTaken > due.getTime()) due.setDate(due.getDate() + 1);
  if (due.getTime() < now.getTime() - 5 * 60 * 1000) due.setDate(due.getDate() + 1);
  return due.getTime();
}

export default function MedicineAlerts() {
  const [meds, setMeds] = useLocalStorage<Med[]>("bt_meds", []);
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("08:00");

  const enriched = useMemo(() =>
    meds.map((m) => {
      const dueAt = nextDueTimestamp(m.time, m.lastTaken);
      const diff = dueAt - Date.now();
      const dueSoon = diff <= 60 * 60 * 1000; // within 1h
      const pastDue = diff < 0;
      return { ...m, dueAt, dueSoon, pastDue };
    }).sort((a, b) => a.dueAt - b.dueAt)
  , [meds]);

  useEffect(() => {
    const id = setInterval(() => {
      // Trigger re-evaluation by toggling state via setMeds same value
      setMeds((list) => [...list]);
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [setMeds]);

  const add = () => {
    if (!name.trim()) return;
    setMeds((list) => [...list, { id: Math.random().toString(36).slice(2), name: name.trim(), dose: dose.trim() || "", time }]);
    setName("");
    setDose("");
  };

  const markTaken = (id: string) => setMeds((list) => list.map((m) => (m.id === id ? { ...m, lastTaken: Date.now() } : m)));
  const remove = (id: string) => setMeds((list) => list.filter((m) => m.id !== id));

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Medicine Alerts</h3>
        <span className="text-xs text-muted-foreground">Daily reminders</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Medicine name" className="px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
        <input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="Dose (e.g., 10mg)" className="px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
        <div className="flex gap-2">
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex-1 px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
          <button onClick={add} className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Add</button>
        </div>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {enriched.map((m) => (
          <li key={m.id} className={`flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 px-3 py-2 rounded-xl border overflow-hidden ${m.pastDue ? "border-red-400/40 bg-red-400/10" : m.dueSoon ? "border-amber-300/40 bg-amber-300/10" : "border-white/10 bg-white/5"}`}>
            <div className="min-w-0 flex-1">
              <div className="font-medium break-words">{m.name} {m.dose && <span className="text-xs text-muted-foreground">• {m.dose}</span>}</div>
              <div className="text-xs text-muted-foreground break-words">Time: {m.time} • Next: {new Date(m.dueAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-1 sm:mt-0">
              <button onClick={() => markTaken(m.id)} className="px-2 py-1 rounded-lg border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs">Taken</button>
              <button onClick={() => remove(m.id)} className="px-2 py-1 rounded-lg border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs">Remove</button>
            </div>
          </li>
        ))}
        {enriched.length === 0 && (
          <li className="text-xs text-muted-foreground">No medicines added yet</li>
        )}
      </ul>
    </div>
  );
}
