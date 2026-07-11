import { useEffect, useState } from "react";
import type { AppTheme } from "../types";

const THEME_STORAGE_KEY = "treino-diario-theme";

const THEME_COLORS: Record<AppTheme, string> = {
  light: "#f7f8fa",
  dark: "#334155",
};

const isAppTheme = (value: string | null): value is AppTheme => {
  return value === "light" || value === "dark";
};

const loadStoredTheme = (): AppTheme => {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isAppTheme(storedTheme) ? storedTheme : "light";
  } catch {
    return "light";
  }
};

export const useThemePreference = () => {
  const [theme, setTheme] = useState<AppTheme>(loadStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}

    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );

    if (themeColor) {
      themeColor.content = THEME_COLORS[theme];
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      return currentTheme === "light" ? "dark" : "light";
    });
  };

  return {
    theme,
    toggleTheme,
  };
};
