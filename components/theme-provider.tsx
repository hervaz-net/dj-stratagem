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
      stored === "system" || stored === "light" || stored === "dark"
        ? stored
        : "dark";
    setTheme(initial);
    setResolvedTheme(initial === "system" ? getSystemTheme() : initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      root.removeAttribute("data-theme");
      setResolvedTheme(getSystemTheme());
    } else {
      root.dataset.theme = theme;
      setResolvedTheme(theme);
    }
    root.style.colorScheme = theme === "system" ? "light dark" : theme;
    window.localStorage.setItem("djstratagem-theme", theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const syncSystemTheme = () => {
      if (theme === "system") setResolvedTheme(getSystemTheme());
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
    <Button
      aria-label={`${label}. Change appearance`}
      className="theme-toggle"
      onClick={cycleTheme}
      size="small"
      title={`${label} — click to change`}
      variant="ghost"
    >
      <Icon aria-hidden="true" size={17} />
      <span className="theme-toggle-label">{theme}</span>
    </Button>
  );
}
