import { NavLink } from "react-router-dom";
import {
  Activity,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Settings,
  Share2,
  Brain,
  FolderTree,
  LucideIcon,
  Watch,
  CloudUpload,
  Scan,
} from "lucide-react";

export const navItems: { label: string; to: string; icon: LucideIcon }[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Vitals", to: "/vitals", icon: HeartPulse },
  { label: "Labs", to: "/labs", icon: FlaskConical },
  { label: "Lifestyle", to: "/lifestyle", icon: Activity },
  { label: "Simulator", to: "/simulator", icon: FolderTree },
  { label: "Organ Health", to: "/organ-health", icon: Brain },
  { label: "Doctor / Share", to: "/doctor-share", icon: Share2 },
  { label: "Connect Devices", to: "/connect-devices", icon: Watch },
  { label: "Upload Imaging", to: "/upload-imaging", icon: CloudUpload },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex h-screen sticky top-0 flex-col w-64 p-4 gap-4 border-r border-white/10 bg-sidebar">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="h-9 w-9 rounded-xl bg-[radial-gradient(circle_at_30%_30%,hsla(var(--neon-aqua)/.9),transparent_60%),radial-gradient(circle_at_70%_70%,hsla(var(--neon-violet)/.9),transparent_60%)] shadow-neon-aqua" />
        <div>
          <div className="font-futuristic tracking-widest text-sm text-neon-aqua">BIOTWIN</div>
          <div className="text-xs text-muted-foreground">AI Health Twin</div>
        </div>
      </div>
      <nav className="mt-2 flex-1">
        <ul className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
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
      <div className="mt-auto text-xs text-muted-foreground px-2">
        <div className="opacity-80">Recreating tomorrow's care</div>
        <div className="opacity-60">v1.0</div>
      </div>
    </aside>
  );
}
