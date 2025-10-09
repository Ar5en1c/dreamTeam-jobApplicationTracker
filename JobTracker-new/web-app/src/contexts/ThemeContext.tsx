import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme";

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "system";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (!stored) {
    return "system";
  }
  return stored;
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    theme === "system" ? getSystemTheme() : theme
  );

  // Sync resolved theme with system preference when theme is system.
  useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }

    const updateResolvedTheme = () =>
      setResolvedTheme(getSystemTheme());

    updateResolvedTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateResolvedTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateResolvedTheme);
    };
  }, [theme]);

  // Persist explicit theme choice.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  // Update DOM class/attribute when resolved theme changes.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const effective =
        current === "system" ? getSystemTheme() : current;
      return effective === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
