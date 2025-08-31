import { useState } from "react";

function ProviderCard({ name, desc, onConnect, connected }: { name: string; desc: string; onConnect: () => void; connected: boolean }) {
  return (
    <div className="glass rounded-2xl p-4 card-glow">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium">{name}</h3>
        <span className={`text-xs ${connected ? "text-emerald-400" : "text-muted-foreground"}`}>{connected ? "Connected" : "Not connected"}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{desc}</p>
      <div className="flex gap-2">
        <button onClick={onConnect} className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">
          {connected ? "Reconnect" : "Connect"}
        </button>
        {connected && (
          <button onClick={() => alert("Sync started")} className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Sync now</button>
        )}
      </div>
    </div>
  );
}

export default function ConnectDevices() {
  const [state, setState] = useState({ googleFit: false, appleHealth: false, garmin: false, fitbit: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-futuristic tracking-widest">Connect Devices</h1>
        <p className="text-sm text-muted-foreground">Link your smartwatch and fitness apps to sync vitals & lifestyle data</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ProviderCard
          name="Google Fit"
          desc="Android devices and supported wearables"
          connected={state.googleFit}
          onConnect={() => setState((s) => ({ ...s, googleFit: true }))}
        />
        <ProviderCard
          name="Apple Health"
          desc="iPhone and Apple Watch"
          connected={state.appleHealth}
          onConnect={() => setState((s) => ({ ...s, appleHealth: true }))}
        />
        <ProviderCard
          name="Garmin"
          desc="Garmin watches and fitness trackers"
          connected={state.garmin}
          onConnect={() => setState((s) => ({ ...s, garmin: true }))}
        />
        <ProviderCard
          name="Fitbit"
          desc="Fitbit watches and bands"
          connected={state.fitbit}
          onConnect={() => setState((s) => ({ ...s, fitbit: true }))}
        />
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="font-medium mb-2">Notes</h3>
        <p className="text-sm text-muted-foreground">For production, connect via provider OAuth and store tokens securely (e.g., server + DB). If helpful, we can integrate SSO or device provider APIs next.</p>
      </div>
    </div>
  );
}
