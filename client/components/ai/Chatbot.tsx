import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageSquare, Send, X } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; content: string; ts: number };

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue] as const;
}

function addMedicineReminder(example?: { name: string; time: string; dose?: string }) {
  try {
    const key = "bt_meds";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({ id: Math.random().toString(36).slice(2), name: example?.name || "Vitamin D", time: example?.time || "08:00", dose: example?.dose || "1000 IU" });
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

function generateReply(text: string) {
  const t = text.toLowerCase();
  if (/help|hi|hello/.test(t)) {
    return "Hi! I can summarize vitals, suggest meals for glucose/heart, set medicine reminders (e.g., 'add med Metformin at 08:00 dose 500mg'), or navigate to pages (Vitals, Labs, Lifestyle, Simulator, Organ Health, Doctor/Share, Connect Devices, Upload Imaging).";
  }
  if (/vital|hr|heart|spo2|glucose|sleep|steps|stress/.test(t)) {
    return "Latest snapshot: HR ~72 bpm, SpO₂ ~98%, Glucose ~105 mg/dL, Sleep ~7.5h, Steps ~6.8k, Stress ~3/5. Open Vitals for detailed charts.";
  }
  if (/food|diet|meal|nutrition|keto|gi|glucose/.test(t)) {
    return "Try low‑GI options: oats+berries, lentil soup+salad, Greek yogurt+nuts, grilled salmon+greens. Use Food Suggestions filters (heart, glucose, weight, keto, veg).";
  }
  if (/medicine|remind|reminder|pill/.test(t)) {
    return "To add a reminder, type: add med <Name> at HH:MM dose <Dose>. Example: add med Metformin at 08:00 dose 500mg.";
  }
  if (/doctor|share|pdf|export/.test(t)) {
    return "Go to Doctor/Share to generate a secure link and export a print‑ready PDF report.";
  }
  if (/connect|device|watch|smartwatch/.test(t)) {
    return "Open Connect Devices to link Google Fit, Apple Health, Garmin, or Fitbit. Then sync to pull steps/HR/sleep.";
  }
  if (/upload|mri|ct|dicom|nifti|imaging/.test(t)) {
    return "Use Upload Imaging to drag‑drop MRI/CT scans (DICOM, NIfTI) or images. You can also print as PDF.";
  }
  if (/organ|brain|heart|lungs|liver/.test(t)) {
    return "Open Organ Health, click an organ to view score trends and contributing factors.";
  }
  return "Got it. I can help with vitals, labs, lifestyle tips, simulations, organ health, share/export, devices, and uploads. Ask me anything specific.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useLocalStorage<Msg[]>("bt_chat", [
    { id: "w", role: "assistant", content: "Hello! I’m your BioTwin assistant. How can I help today?", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const quick = useMemo(() => [
    "Today's vitals", "Food for glucose", "Add med at 08:00", "Share with doctor", "Connect smartwatch", "Upload MRI"
  ], []);

  const onSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setMsgs((m) => [...m, { id: Math.random().toString(36).slice(2), role: "user", content, ts: Date.now() }]);
    setInput("");

    // Action: add med command
    const match = content.match(/add\s+med\s+([^@]+)\s+at\s+(\d{1,2}:\d{2})(?:.*dose\s+(.+))?/i);
    if (match) {
      const ok = addMedicineReminder({ name: match[1].trim(), time: match[2], dose: (match[3] || "").trim() });
      const reply = ok ? `Added reminder: ${match[1].trim()} at ${match[2]} ${match[3] ? "(" + match[3].trim() + ")" : ""}.` : "Could not save reminder.";
      setTimeout(() => setMsgs((m) => [...m, { id: Math.random().toString(36).slice(2), role: "assistant", content: reply, ts: Date.now() }]), 400);
      return;
    }

    const reply = generateReply(content);
    setTimeout(() => setMsgs((m) => [...m, { id: Math.random().toString(36).slice(2), role: "assistant", content: reply, ts: Date.now() }]), 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="glass w-[92vw] max-w-md h-[70vh] max-h-[560px] rounded-2xl p-3 flex flex-col bg-background/85">
          <div className="flex items-center justify-between px-1 py-1.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 grid place-items-center rounded-md dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10"><Bot className="h-4 w-4 text-neon-aqua" /></div>
              <div className="text-sm font-medium">BioTwin Chat</div>
            </div>
            <button onClick={() => setOpen(false)} className="h-8 w-8 grid place-items-center rounded-lg dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10"><X className="h-4 w-4" /></button>
          </div>

          <div ref={viewportRef} className="flex-1 overflow-y-auto space-y-2 mt-2 pr-1">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm border ${
                  m.role === "assistant"
                    ? "bg-white/6 border-white/12 text-white mr-auto"
                    : "bg-primary/15 border-primary/25 text-white ml-auto"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {quick.map((q) => (
              <button key={q} onClick={() => onSend(q)} className="px-2.5 py-1.5 rounded-lg text-xs border bg-white/5 border-white/10 hover:bg-white/10 hover:ring-1 hover:ring-primary/40">{q}</button>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about vitals, food, meds, share..."
              className="flex-1 px-3 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10 outline-none"
              onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
            />
            <button onClick={() => onSend()} className="h-10 w-10 grid place-items-center rounded-xl border border-primary/30 bg-primary/20 hover:bg-primary/25"><Send className="h-4 w-4 text-primary" /></button>
          </div>
        </div>
      )}

      {!open && (
        <button onClick={() => setOpen(true)} className="h-12 w-12 rounded-2xl border border-primary/30 bg-primary/20 hover:bg-primary/25 grid place-items-center">
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
