import React from "react";
import { Theme } from "../consts/colors";

const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: () => void;
}>({
  theme: Theme.Light,
  setTheme: () => {},
});

export default ThemeContext;
