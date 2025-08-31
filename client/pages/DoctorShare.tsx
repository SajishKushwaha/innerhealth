import { useMemo, useState } from "react";
import CountUp from "../components/common/CountUp";

function randomToken(len = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function EmailInput({ onAdd }: { onAdd: (email: string) => void }) {
  const [val, setVal] = useState("");
  const add = () => {
    const email = val.trim();
    const ok = /.+@.+\..+/.test(email);
    if (ok) {
      onAdd(email);
      setVal("");
    }
  };
  return (
    <div className="flex gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="doctor@example.com" className="flex-1 px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
      <button onClick={add} className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Invite</button>
    </div>
  );
}

export default function DoctorShare() {
  const [readOnly, setReadOnly] = useState(true);
  const [expires, setExpires] = useState("7d");
  const [token, setToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [includeSections, setIncludeSections] = useState({ dashboard: true, vitals: true, labs: true, lifestyle: true, forecast: true });

  const link = useMemo(() => {
    const base = window.location.origin + "/doctor-share";
    return token ? `${base}?t=${token}&ro=${readOnly ? 1 : 0}&exp=${expires}` : "";
  }, [token, readOnly, expires]);

  const genLink = () => setToken(randomToken());
  const copyLink = async () => {
    if (!link) return;
    try {
      if ((navigator as any).share) await (navigator as any).share({ title: "BioTwin Share", url: link });
      else await navigator.clipboard.writeText(link);
    } catch {}
  };

  const invite = (email: string) => setEmails((prev) => Array.from(new Set([...prev, email])));

  const accessLog = [
    { time: "Today 10:21", who: "Dr. Mehta", action: "Viewed Labs" },
    { time: "Yesterday 18:03", who: "Dr. Singh", action: "Viewed Vitals" },
  ];

  return (
    <>
      <div className="space-y-6 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-futuristic tracking-widest">Doctor / Share</h1>
          <p className="text-sm text-muted-foreground">Generate a secure link or export a PDF snapshot to share with your doctor</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Export PDF</button>
          <button onClick={copyLink} disabled={!link} className="px-4 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50">Share Link</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 xl:col-span-2">
          <h3 className="font-medium mb-3">Link Settings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center justify-between gap-2">
              <span>Read-only</span>
              <input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Expires</span>
              <select value={expires} onChange={(e) => setExpires(e.target.value)} className="px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
                <option value="24h">24 hours</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="never">Never</option>
              </select>
            </label>
            <div className="md:col-span-2">
              <div className="text-sm text-muted-foreground mb-2">Include sections</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(includeSections).map(([k, v]) => (
                  <label key={k} className="flex items-center gap-2 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10 px-3 py-2 rounded-xl">
                    <input type="checkbox" checked={v} onChange={(e) => setIncludeSections({ ...includeSections, [k]: e.target.checked })} />
                    <span className="capitalize">{k}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <button onClick={genLink} className="w-full px-4 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Generate Link</button>
              {link && (
                <div className="mt-2 p-3 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10 text-xs break-all">{link}</div>
              )}
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <h3 className="font-medium mb-3">Invite Doctor</h3>
          <EmailInput onAdd={invite} />
          <ul className="mt-3 space-y-1 text-sm">
            {emails.map((e) => (
              <li key={e} className="flex items-center justify-between dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10 px-3 py-2 rounded-xl">
                <span>{e}</span>
                <span className="text-xs text-emerald-400">Invited</span>
              </li>
            ))}
            {emails.length === 0 && <li className="text-xs text-muted-foreground">No invites sent yet</li>}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 xl:col-span-2 print:block">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Printable Snapshot</h3>
            <span className="text-xs text-muted-foreground">Preview</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl p-4 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              <div className="text-xs text-muted-foreground">Overall Health</div>
              <div className="text-2xl font-semibold"><CountUp to={86} />%</div>
            </div>
            <div className="rounded-xl p-4 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              <div className="text-xs text-muted-foreground">Heart Rate</div>
              <div className="text-2xl font-semibold">72 bpm</div>
            </div>
            <div className="rounded-xl p-4 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              <div className="text-xs text-muted-foreground">SpO₂</div>
              <div className="text-2xl font-semibold">98%</div>
            </div>
            <div className="rounded-xl p-4 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
              <div className="text-xs text-muted-foreground">Glucose</div>
              <div className="text-2xl font-semibold">105 mg/dL</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">This snapshot is formatted for printing and sharing.</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <h3 className="font-medium mb-2">Access Log</h3>
          <ul className="space-y-2 text-sm">
            {accessLog.map((r, i) => (
              <li key={i} className="flex items-center justify-between dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10 px-3 py-2 rounded-xl">
                <span>{r.time}</span>
                <span className="text-muted-foreground">{r.who}</span>
                <span>{r.action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

      <div className="print-only hidden p-8 text-black bg-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-futuristic tracking-widest text-sm">BIOTWIN AI</div>
            <h1 className="text-2xl font-semibold">Health Twin Report</h1>
            <div className="text-sm">Patient: {(() => { try { return JSON.parse(localStorage.getItem("bt_name")||"\"\"") || ""; } catch { return ""; } })() || "—"}</div>
            <div className="text-sm">Date: {new Date().toLocaleString()}</div>
          </div>
          <div className="text-right text-sm">
            Read-only: {readOnly ? "Yes" : "No"}<br />
            Expires: {expires}
          </div>
        </div>
        <hr className="my-4 border-gray-200" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl p-4 border border-gray-200">
            <div className="text-xs text-gray-500">Overall Health</div>
            <div className="text-2xl font-semibold">86%</div>
          </div>
          <div className="rounded-xl p-4 border border-gray-200">
            <div className="text-xs text-gray-500">Heart Rate</div>
            <div className="text-2xl font-semibold">72 bpm</div>
          </div>
          <div className="rounded-xl p-4 border border-gray-200">
            <div className="text-xs text-gray-500">SpO₂</div>
            <div className="text-2xl font-semibold">98%</div>
          </div>
          <div className="rounded-xl p-4 border border-gray-200">
            <div className="text-xs text-gray-500">Glucose</div>
            <div className="text-2xl font-semibold">105 mg/dL</div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-medium">Included Sections</h2>
          <ul className="text-sm grid sm:grid-cols-2 gap-1 mt-2">
            {Object.entries(includeSections).filter(([,v])=>v).map(([k]) => (
              <li key={k} className="">• {k}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-medium">Notes</h2>
          <p className="text-sm leading-relaxed">Improved sleep and daily activity correlate with lower projected cardiac risk over 5 years. Consider a low‑GI breakfast to reduce glucose peaks.</p>
        </div>
      </div>
    </>
  );
}
