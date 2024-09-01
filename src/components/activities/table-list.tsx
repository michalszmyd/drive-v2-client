import { Descriptions, Row, TablePaginationConfig, Tag } from "antd";
import TableItemsList from "../files/table-list";
import ResourceTag from "./resource-tag";
import Column from "antd/es/table/Column";
import ActivityModel from "../../models/activity-model";
import ActionTag from "./action-tag";
import { css } from "@emotion/css";

export default function ActivitiesTableList({
  isLoading,
  pagination,
  onTableChange,
  tableItems,
}: {
  isLoading: boolean;
  pagination: TablePaginationConfig;
  onTableChange: ({ current, pageSize }: TablePaginationConfig) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableItems: any;
}) {
  return (
    <TableItemsList
      isLoading={isLoading}
      pagination={pagination}
      onChange={onTableChange}
      dataSource={tableItems}
      expandable={{
        expandedRowRender: (record: ActivityModel) => (
          <Row className={styles.descriptions}>
            <Descriptions
              className={styles.descriptions}
              title="Additional info"
            >
              <Descriptions.Item label="User ID">
                <p>{record.user?.id}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Resource ID">
                <p>{record.resourceId}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Request info">
                <code>{record.requestInfo}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Metadata">
                <code>{record.metadata}</code>
              </Descriptions.Item>
            </Descriptions>
          </Row>
        ),
      }}
    >
      <Column
        key="resource"
        title="Resource"
        dataIndex="resource"
        render={(_: string, record: ActivityModel) => (
          <ResourceTag
            resourceId={record.resourceId}
            resource={record.resource}
          />
        )}
      />
      <Column
        key="action"
        title="Action"
        dataIndex="action"
        render={(_: string, record: ActivityModel) => (
          <ActionTag action={record.action} />
        )}
      />
      <Column
        key="tags"
        title="Tags"
        dataIndex="tags"
        render={(_: string, record: ActivityModel) =>
          record.applicationId ? <Tag color="magenta-inverse">APP</Tag> : <></>
        }
      />
      <Column key="user-name" title="Name" dataIndex="userName" />
      <Column key="created-at" title="Created At" dataIndex="createdAt" />
    </TableItemsList>
  );
}

const styles = {
  descriptions: css(`
    tr.ant-descriptions-row {
      display: flex;
      flex: row;
      flex-direction: column;
    },
    .ant-descriptions-item-container {
      align-items: center;
    }
  `),
};
