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
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

import { signOut } from "@/lib/utils";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4 card-glow">
      <h3 className="font-medium mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function Settings() {
  const [name, setName] = useLocalStorage("bt_name", "SAJISH KUMAR");
  const [email, setEmail] = useLocalStorage("bt_email", "");
  const [phone, setPhone] = useLocalStorage("bt_phone", "");
  const [dob, setDob] = useLocalStorage("bt_dob", "");
  const [gender, setGender] = useLocalStorage<"male" | "female" | "other" | "prefer_not">("bt_gender", "prefer_not");
  const [avatar, setAvatar] = useLocalStorage<string | null>("bt_avatar", null);

  const [height, setHeight] = useLocalStorage<number | "">("bt_height", "");
  const [weight, setWeight] = useLocalStorage<number | "">("bt_weight", "");
  const [blood, setBlood] = useLocalStorage("bt_blood", "");
  const [allergies, setAllergies] = useLocalStorage("bt_allergies", "");
  const [conditions, setConditions] = useLocalStorage("bt_conditions", "");
  const [emgName, setEmgName] = useLocalStorage("bt_emg_name", "");
  const [emgPhone, setEmgPhone] = useLocalStorage("bt_emg_phone", "");

  const [units, setUnits] = useLocalStorage<"metric" | "imperial">("bt_units", "metric");
  const [timeFmt, setTimeFmt] = useLocalStorage<"12h" | "24h">("bt_time_fmt", "24h");
  const [tz, setTz] = useLocalStorage("bt_tz", Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [alerts, setAlerts] = useLocalStorage("bt_alerts", { liveVitals: true, weeklyEmail: true, criticalPush: true });
  const [shareDefaultRO, setShareDefaultRO] = useLocalStorage("bt_share_ro", true);
  const [retention, setRetention] = useLocalStorage<number>("bt_retention", 12);
  const [integrations, setIntegrations] = useLocalStorage("bt_integrations", { googleFit: false, appleHealth: false, garmin: false });

  const timezones = useMemo(() => [tz, "UTC", "America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Singapore"], [tz]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-futuristic tracking-widest">Settings</h1>
        <p className="text-sm text-muted-foreground">Profile, preferences, privacy & integrations</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Section title="Profile">
          <div className="grid sm:grid-cols-3 gap-3 items-start">
            <div className="space-y-2">
              <div className="h-20 w-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 grid place-items-center">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-xs text-muted-foreground">No photo</div>
                )}
              </div>
              <div className="flex gap-2">
                <label className="px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = () => setAvatar(r.result as string);
                    r.readAsDataURL(f);
                  }} />
                </label>
                {avatar && (
                  <button onClick={() => setAvatar(null)} className="px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs">Remove</button>
                )}
              </div>
            </div>

            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Phone</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Date of birth</span>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Gender</span>
              <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
                <option value="prefer_not">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        </Section>

        <Section title="Health Profile">
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Height ({units === "metric" ? "cm" : "in"})</span>
              <input type="number" value={height as any} onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Weight ({units === "metric" ? "kg" : "lb"})</span>
              <input type="number" value={weight as any} onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Blood group</span>
              <select value={blood} onChange={(e) => setBlood(e.target.value)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
                <option value="">Select</option>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((b)=> (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1 sm:col-span-3">
              <span className="text-sm text-muted-foreground">Allergies</span>
              <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1 sm:col-span-3">
              <span className="text-sm text-muted-foreground">Medical conditions</span>
              <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Emergency contact name</span>
              <input value={emgName} onChange={(e) => setEmgName(e.target.value)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Emergency contact phone</span>
              <input value={emgPhone} onChange={(e) => setEmgPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
          </div>
        </Section>

        <Section title="Preferences">
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Units</span>
              <select value={units} onChange={(e) => setUnits(e.target.value as any)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lb, in)</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Time format</span>
              <select value={timeFmt} onChange={(e) => setTimeFmt(e.target.value as any)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
                <option value="24h">24-hour</option>
                <option value="12h">12-hour</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm text-muted-foreground">Timezone</span>
              <select value={tz} onChange={(e) => setTz(e.target.value)} className="w-full px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10">
                {Array.from(new Set(timezones)).map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </label>
          </div>
        </Section>

        <Section title="Notifications">
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-2">
              <span>Live vitals alerts</span>
              <input type="checkbox" checked={alerts.liveVitals} onChange={(e) => setAlerts({ ...alerts, liveVitals: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Weekly email digest</span>
              <input type="checkbox" checked={alerts.weeklyEmail} onChange={(e) => setAlerts({ ...alerts, weeklyEmail: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Critical push alerts</span>
              <input type="checkbox" checked={alerts.criticalPush} onChange={(e) => setAlerts({ ...alerts, criticalPush: e.target.checked })} />
            </label>
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Section title="Data & Privacy">
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-2">
              <span>Share links default to read-only</span>
              <input type="checkbox" checked={shareDefaultRO} onChange={(e) => setShareDefaultRO(e.target.checked)} />
            </label>
            <label className="space-y-1 block">
              <span className="text-sm text-muted-foreground">Retention (months)</span>
              <input type="number" min={1} max={60} value={retention} onChange={(e) => setRetention(Number(e.target.value))} className="w-40 px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10" />
            </label>
            <div className="flex gap-2">
              <button onClick={() => alert("Export started")} className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Export Data</button>
              <button onClick={() => alert("Import started")} className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Import Data</button>
            </div>
          </div>
        </Section>

        <Section title="Integrations">
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-2">
              <span>Google Fit</span>
              <input type="checkbox" checked={integrations.googleFit} onChange={(e) => setIntegrations({ ...integrations, googleFit: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Apple Health</span>
              <input type="checkbox" checked={integrations.appleHealth} onChange={(e) => setIntegrations({ ...integrations, appleHealth: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Garmin</span>
              <input type="checkbox" checked={integrations.garmin} onChange={(e) => setIntegrations({ ...integrations, garmin: e.target.checked })} />
            </label>
            <p className="text-xs text-muted-foreground">Connect devices to sync lifestyle and vitals automatically.</p>
          </div>
        </Section>

        <Section title="Security">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span>Two-factor authentication</span>
              <button className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Configure</button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>Active sessions</span>
              <button className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Review</button>
            </div>
            <div className="pt-2 flex items-center justify-between gap-2">
              <span>Sign out of this device</span>
              <button onClick={() => signOut()} className="px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-400">Log out</button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
