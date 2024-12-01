import useTheme from "@/hooks/useTheme";
import { Theme, themeOptions } from "@/contexts/ThemeContext";
import * as React from "react";

interface IThemeSelectProps {}

const ThemeSelect: React.FunctionComponent<IThemeSelectProps> = () => {
  const { theme, handleToggleTheme } = useTheme();

  return (
    <select
      defaultValue={theme}
      onChange={(e) => {
        const selectedTheme = e.target.value as Theme;
        handleToggleTheme(selectedTheme);
      }}
    >
      {themeOptions.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default ThemeSelect;
