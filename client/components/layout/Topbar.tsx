import { Bell, Moon, Search, Sun, Menu, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import MobileNav from "./MobileNav";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";


function ProfileChip() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      try {
        setName(JSON.parse(localStorage.getItem("bt_name") || '""'));
      } catch { setName(""); }
      try {
        const v = localStorage.getItem("bt_avatar");
        setAvatar(v ? (JSON.parse(v) as string | null) : null);
      } catch { setAvatar(null); }
    };
    load();
    const onStorage = (e: StorageEvent) => {
      if (["bt_name","bt_avatar"].includes(e.key || "")) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const initial = (name || "").trim().charAt(0).toUpperCase() || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 pl-2 pr-3 h-10 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <div className="h-8 w-8 rounded-lg overflow-hidden border border-white/10 grid place-items-center bg-white/5">
            {avatar ? (
              <img src={avatar} alt="profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-muted-foreground">{initial || ""}</span>
            )}
          </div>
          <span className="hidden sm:inline text-sm max-w-[120px] truncate">{name || "Profile"}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md overflow-hidden border border-white/10 grid place-items-center bg-white/5">
            {avatar ? <img src={avatar} alt="profile" className="h-full w-full object-cover" /> : <span className="text-[10px] text-muted-foreground">{initial}</span>}
          </div>
          <span className="max-w-[160px] truncate">{name || "User"}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2"><SettingsIcon className="h-4 w-4" /> Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="gap-2 text-red-400 focus:text-red-400"><LogOut className="h-4 w-4" /> Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [hasAlert, setHasAlert] = useState(true);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    document.documentElement.classList.toggle("nav-open", mobileOpen);
    return () => { document.body.style.overflow = prev || ""; document.documentElement.classList.remove("nav-open"); };
  }, [mobileOpen]);

  useEffect(() => {
    const t = setInterval(() => setHasAlert((p) => !p), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-background/90 lg:bg-background/60">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={() => setMobileOpen(true)} className="h-10 w-10 grid place-items-center rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5">
            <Menu className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-lg bg-[radial-gradient(circle_at_30%_30%,hsla(var(--neon-aqua)/.9),transparent_60%),radial-gradient(circle_at_70%_70%,hsla(var(--neon-violet)/.9),transparent_60%)]" />
        </div>

        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search labs, vitals, insights..."
              className="w-full pl-10 pr-4 py-2 rounded-xl dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10 outline-none focus:ring-2 focus:ring-neon-aqua/50 focus:border-transparent placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 grid place-items-center rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-neon-aqua" />
            ) : (
              <Moon className="h-5 w-5 text-violet-600" />
            )}
          </button>

          <button
            className="relative h-10 w-10 grid place-items-center rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {hasAlert && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border border-white" />
            )}
          </button>

          <ProfileChip />
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
