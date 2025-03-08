import { createContext, ReactNode, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export const themeOptions = ["light", "dark", "system"] as const;

export type Theme = "light" | "dark" | "system";

type InitialState = {
  theme: Theme;
  handleToggleTheme: (selectedTheme: Theme) => void;
};

const DEFAULT_THEME = "system";

const initialState: InitialState = {
  theme: DEFAULT_THEME,
  handleToggleTheme: () => {},
};
export const ThemeContext = createContext(initialState);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);

      if (
        savedTheme &&
        (savedTheme === "light" ||
          savedTheme === "dark" ||
          savedTheme === "system")
      )
        return savedTheme as Theme;
    } catch (error) {
      console.warn("localstorage error", error);
    }

    return "system";
  });

  useEffect(() => {
    const darkModePrefernce = window.matchMedia("(prefers-color-scheme: dark ");

    if (theme === "system") {
      darkModePrefernce.matches
        ? document.body.classList.add("dark")
        : document.body.classList.remove("dark");

      const handleSystemChange = (e: MediaQueryListEvent) => {
        e.matches
          ? document.body.classList.add("dark")
          : document.body.classList.remove("dark");
      };

      darkModePrefernce.addEventListener("change", handleSystemChange);
      return () => {
        darkModePrefernce.removeEventListener("change", handleSystemChange);
      };
    }

    if (theme === "dark") {
      document.body.classList.add("dark");
    }
    if (theme === "light") {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const value = {
    theme,
    handleToggleTheme: (selectedTheme: Theme) => {
      try {
        localStorage.setItem(STORAGE_KEY, selectedTheme);
      } catch (error) {
        console.warn("error", error);
      }
      setTheme(selectedTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
