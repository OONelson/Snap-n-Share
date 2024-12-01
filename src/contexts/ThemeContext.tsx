import { createContext, ReactNode, useEffect, useState } from "react";

export const themeOptions = ["light", "dark", "system"] as const;

export type Theme = (typeof themeOptions)[number];

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
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const darkModePrefernce = window.matchMedia("(prefers-color-scheme: dark ");

    if (theme === "system") {
      darkModePrefernce.matches
        ? document.body.classList.add("dark")
        : document.body.classList.remove("dark");
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
      setTheme(selectedTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
