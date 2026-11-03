import React from "react";
import { Sun, Moon } from "lucide-react";
import { useVibeTheme } from "../lib/theme";

export function GlobalThemeToggle() {
  const [theme, setTheme] = useVibeTheme();
  const isDark = theme === "dark";

  return (
    <aside
      aria-label="Theme Switcher"
      className="fixed bottom-6 right-6 z-[9999] select-none"
    >
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide border cursor-pointer backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl ${
          isDark
            ? "bg-[#07133A]/90 text-[#F0F6FF] border-[#112255] hover:border-[#00D2FF]/60 hover:bg-[#0c1f56] shadow-[0_0_24px_rgba(0,210,255,0.25)]"
            : "bg-white/95 text-[#07133A] border-slate-200/90 hover:border-blue-400 hover:bg-slate-50 shadow-slate-300/50"
        }`}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-pressed={isDark}
      >
        {isDark ? (
          <>
            <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#00D2FF]/15 text-[#00D2FF] group-hover:rotate-45 transition-transform duration-300">
              <Sun className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold tracking-normal text-[#F0F6FF]">Light</span>
          </>
        ) : (
          <>
            <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-[#0038A8] group-hover:-rotate-12 transition-transform duration-300">
              <Moon className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold tracking-normal text-[#07133A]">Dark</span>
          </>
        )}
      </button>
    </aside>
  );
}

