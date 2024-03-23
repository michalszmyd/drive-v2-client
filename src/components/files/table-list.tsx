import { Table } from "antd";
import { TablePaginationConfig, TableProps } from "antd/es/table";
import { colors } from "../../consts/colors";
import { css } from "@emotion/css";
import tableStyles from "../../styles/table";

export interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function TableItemsList({
  columns,
  isLoading,
  onChange = () => {},
  pagination = false,
  dataSource,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any;
  isLoading: boolean;
  onChange?: ({ current, pageSize }: TablePaginationConfig) => void;
  pagination?: TableParams["pagination"] | false;
  dataSource: TableProps["dataSource"];
}) {
  return (
    <Table
      size="middle"
      scroll={{ x: "100%" }}
      columns={columns}
      loading={isLoading}
      onChange={onChange}
      pagination={pagination}
      className={`${tableStyles.table} ${styles.table}`}
      dataSource={dataSource}
    />
  );
}

const styles = {
  table: css(`
    img, .ant-image-mask, video {
      max-height: 100px;
      max-width: 100px;
      border-radius: 10px;
      .ant-image-mask {
        border-radius: 10px;
      }
    }
    .ant-table-cell {
      max-width: 100px;
    }
  `),
  folderLink: css({
    fontWeight: 700,
    color: colors.main,
  }),
};
