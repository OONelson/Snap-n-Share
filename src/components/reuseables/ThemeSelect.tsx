import useTheme from "@/hooks/useTheme";
import { Theme, themeOptions } from "@/contexts/ThemeContext";
import * as React from "react";

interface IThemeSelectProps {}

const ThemeSelect: React.FunctionComponent<IThemeSelectProps> = () => {
  const { theme, handleToggleTheme } = useTheme();

  return (
    <main className="relative">
      <select
        className=" bg-slate-300 dark:bg-slate-600 dark:text-white p-2"
        defaultValue={theme}
        onChange={(e) => {
          const selectedTheme = e.target.value as Theme;
          handleToggleTheme(selectedTheme);
        }}
      >
        {themeOptions.map((option) => (
          <option className="dark:bg-black" value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </main>
  );
};

export default ThemeSelect;
