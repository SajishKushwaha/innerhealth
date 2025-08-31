import { useEffect, useRef, useState } from "react";

export default function CountUp({
  to,
  from = 0,
  duration = 1200,
  decimals = 0,
  suffix = "",
  prefix = "",
}: {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [value, setValue] = useState(from);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    startRef.current = start;
    const diff = to - from;
    let raf = 0;
    const step = (ts: number) => {
      const elapsed = ts - (startRef.current || start);
      const pct = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(from + diff * eased);
      if (pct < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, from, duration]);

  const formatted = value.toFixed(decimals);
  return <span>{prefix}{formatted}{suffix}</span>;
}
