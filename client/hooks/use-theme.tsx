import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return { theme, setTheme } as const;
}
