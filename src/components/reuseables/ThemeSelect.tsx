import useTheme from "@/hooks/useTheme";
import { Theme, themeOptions } from "@/contexts/ThemeContext";
import * as React from "react";

interface IThemeSelectProps {}

const ThemeSelect: React.FunctionComponent<IThemeSelectProps> = () => {
  const { theme, handleToggleTheme } = useTheme();

  return (
    <select
      className="absolute bottom-2 right-2 z-10 dark:bg-slate-600 dark:text-white p-2"
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
  );
};

export default ThemeSelect;
