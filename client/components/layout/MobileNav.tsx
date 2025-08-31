import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { navItems } from "./Sidebar";

export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] lg:hidden">
      <div className="absolute inset-0 bg-black" onClick={onClose} aria-hidden="true" />
      <aside className="absolute left-0 top-0 h-full w-72 p-4 bg-sidebar border-r border-white/10 shadow-neon-violet">
        <div className="flex items-center justify-between mb-4">
          <div className="font-futuristic tracking-widest text-sm text-neon-aqua">BIOTWIN</div>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-lg dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10"><X className="h-5 w-5" /></button>
        </div>
        <nav>
          <ul className="space-y-1">
            {navItems.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors border ${
                      isActive
                        ? "dark:bg-primary/15 dark:border-primary/25 dark:text-white dark:shadow-neon-violet bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent"
                        : "text-muted-foreground border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:bg-white/[0.04] dark:hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
