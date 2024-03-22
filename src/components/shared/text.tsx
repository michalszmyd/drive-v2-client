import React, { useContext } from "react";
import ThemeContext from "../../contexts/theme-context";
import { darkStyles, lightStyles } from "./text-colors-styles";

export default function Text({
  children,
  className,
}: {
  children: string | React.ReactElement;
  className?: string;
}) {
  const { theme } = useContext(ThemeContext);

  const resolveTheme = theme === "light" ? lightStyles : darkStyles;

  return (
    <span className={`${resolveTheme.text} ${className}`}>{children}</span>
  );
}
