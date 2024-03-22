import { css } from "@emotion/css";
import { dark, light } from "../../consts/colors";

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
