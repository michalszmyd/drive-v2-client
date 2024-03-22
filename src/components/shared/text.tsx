import { css } from "@emotion/css";
import React, { useContext } from "react";
import { dark, light } from "../../consts/colors";
import ThemeContext from "../../contexts/theme-context";

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

export { lightStyles, darkStyles };

const lightStyles = {
  text: css(`
    color: ${light.textColor};

    href {
      color: ${light.linkColor};
    }
  `),
};

const darkStyles = {
  text: css(`
    color: ${dark.textColor};

    href {
      color: ${dark.linkColor};
    }
  `),
};
