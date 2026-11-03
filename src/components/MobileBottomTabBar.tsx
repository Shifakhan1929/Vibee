import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Plus, Zap, User } from "lucide-react";

export interface MobileBottomTabBarProps {
  onOpenSearch: () => void;
}

export function MobileBottomTabBar({ onOpenSearch }: MobileBottomTabBarProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isHome = pathname === "/" || pathname === "";
  const isVibeInstant = pathname.startsWith("/vibe-instant");
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-[#07133A]/95 backdrop-blur-xl border-t border-[#112255] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] select-none"
      style={{
        paddingBottom: "max(6px, env(safe-area-inset-bottom, 6px))",
      }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {/* TAB 1: HOME */}
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-w-[56px] ${
            isHome ? "text-[#00D2FF]" : "text-slate-400 hover:text-slate-200"
          }`}
          aria-current={isHome ? "page" : undefined}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">Home</span>
        </Link>

        {/* TAB 2: SEARCH */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-200 transition-colors min-w-[56px] cursor-pointer"
          aria-label="Open Search"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">Search</span>
        </button>

        {/* TAB 3: HOST (+ Center Elevated Button) */}
        <Link
          to="/create"
          className="flex-1 flex flex-col items-center justify-center min-w-[56px] relative -top-3 group"
          title="Host an Event"
          aria-label="Host an Event"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00D2FF] via-[#007BFF] to-[#0038A8] text-white flex items-center justify-center shadow-lg shadow-[#007BFF]/45 border-2 border-[#07133A] group-active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[10px] font-bold text-white mt-0.5 tracking-tight">Host</span>
        </Link>

        {/* TAB 4: VIBE INSTANT */}
        <Link
          to="/vibe-instant"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-w-[56px] ${
            isVibeInstant ? "text-[#00D2FF]" : "text-slate-400 hover:text-slate-200"
          }`}
          aria-current={isVibeInstant ? "page" : undefined}
        >
          <Zap className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">Instant</span>
        </Link>

        {/* TAB 5: PROFILE */}
        <Link
          to="/dashboard"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-w-[56px] ${
            isDashboard ? "text-[#00D2FF]" : "text-slate-400 hover:text-slate-200"
          }`}
          aria-current={isDashboard ? "page" : undefined}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
