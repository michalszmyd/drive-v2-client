import { css } from "@emotion/css";

const tableStyles = {
  table: css(`
    @media (max-width:1020px)  {
      td.ant-table-cell {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 150px;
      }
    }
  `)
}

export default tableStyles;
