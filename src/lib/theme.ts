import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("vibe_theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {}
  return "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
  try {
    localStorage.setItem("vibe_theme", theme);
  } catch {}
  window.dispatchEvent(
    new CustomEvent("vibe:theme_changed", { detail: { theme } })
  );
}

export function useVibeTheme(): [Theme, (nextTheme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Sync initial state
    const current = getInitialTheme();
    setThemeState(current);
    applyTheme(current);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: Theme }>;
      if (customEvent.detail?.theme) {
        setThemeState(customEvent.detail.theme);
      }
    };

    window.addEventListener("vibe:theme_changed", handleThemeChange);
    return () =>
      window.removeEventListener("vibe:theme_changed", handleThemeChange);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    applyTheme(next);
  };

  return [theme, setTheme];
}

