"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "system" | "light" | "dark";
type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("djstratagem-theme");
    const initial: Theme =
      stored === "system" || stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(initial);
  }, []);

  useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
    setResolvedTheme(resolved);
    window.localStorage.setItem("djstratagem-theme", theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const syncSystemTheme = () => {
      if (theme !== "system") return;
      const resolved = getSystemTheme();
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
      setResolvedTheme(resolved);
    };
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((current) =>
      current === "system" ? "light" : current === "light" ? "dark" : "system",
    );
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const value = useContext(ThemeContext);
  if (!value) return null;

  const { theme, resolvedTheme, cycleTheme } = value;
  const Icon = theme === "system" ? Monitor : resolvedTheme === "light" ? Sun : Moon;
  const label =
    theme === "system" ? "System appearance" : `${resolvedTheme} appearance`;

  return (
    <div className="tooltip tooltip-bottom" data-tip={`${label}. Click to change.`}>
    <Button
      aria-label={`${label}. Change appearance`}
      className="min-h-[34px] min-w-[34px] gap-1.5 px-2 capitalize"
      onClick={cycleTheme}
      size="small"
      variant="ghost"
    >
      <Icon aria-hidden="true" size={17} />
      <span className="hidden font-sans text-[10px] normal-case min-[1101px]:inline">{theme}</span>
    </Button>
    </div>
  );
}
