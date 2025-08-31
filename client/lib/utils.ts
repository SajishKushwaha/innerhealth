import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function signOut() {
  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) {
      if (k.startsWith("bt_") || k === "theme") localStorage.removeItem(k);
    }
  } catch {}
  window.location.href = "/";
}
