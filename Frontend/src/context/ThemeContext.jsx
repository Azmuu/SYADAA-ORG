import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme_mode") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme_mode", isDark ? "dark" : "light");
  }, [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((v) => !v),
      setTheme: (mode) => setIsDark(mode === "dark"),
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
