import { css } from "@emotion/css";

const tableStyles = {
  table: css(`
    @media (max-width:801px)  {
      overflow-x: scroll !important;
      td * {
        word-break: break-all !imporant;
      }
      tr * {
        width: auto !imporant;
      }
    }
  `)
}

export default tableStyles;
