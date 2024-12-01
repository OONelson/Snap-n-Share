import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};

export default useTheme;
