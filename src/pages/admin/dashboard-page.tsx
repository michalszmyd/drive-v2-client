import { Col, Descriptions, Row, Tag } from "antd";
import AuthenticatedAdminRoute from "../../components/authenticated/authenticated-admin-route";
import MainAppWrapper from "../../components/main-app-wrapper";
import useActivities from "../../hooks/admin/activites-hook";
import TableItemsList from "../../components/files/table-list";
import ActivityModel from "../../models/activity-model";
import Column from "antd/es/table/Column";
import { css } from "@emotion/css";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { activities, isLoading, tableParams, onTableChange } = useActivities();

  const activityToTableItem = (activity: ActivityModel) => {
    const {
      id,
      resource,
      resourceId,
      action,
      metadata,
      requestInfo,
      createdAt,
      updatedAt,
      user,
      user: { name: userName = "", id: userId = "" } = {},
    } = activity;

    return {
      key: id,
      id,
      user,
      userName,
      userId,
      resource,
      resourceId,
      action,
      metadata,
      requestInfo,
      createdAt,
      updatedAt,
    };
  };

  const tableItems = activities.map(activityToTableItem);

  return (
    <AuthenticatedAdminRoute>
      <MainAppWrapper title="Dashboard" breadcrumbs={["Admin Dashboard"]}>
        <Row gutter={[16, 16]} justify="end">
          <Col span={24}>
            <TableItemsList
              isLoading={isLoading}
              pagination={tableParams.pagination}
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
              <Column key="user-name" title="Name" dataIndex="userName" />
              <Column
                key="created-at"
                title="Created At"
                dataIndex="createdAt"
              />
            </TableItemsList>
          </Col>
        </Row>
      </MainAppWrapper>
    </AuthenticatedAdminRoute>
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

function ResourceTag({
  resource,
  resourceId,
}: {
  resource: string;
  resourceId?: number | null;
}) {
  if (resource === "folder") {
    return (
      <Tag color={resourceTagColor(resource)}>
        <Link to={`/folders/${resourceId}`}>{resource.toUpperCase()}</Link>
      </Tag>
    );
  }

  if (resource === "file") {
    return (
      <Tag color={resourceTagColor(resource)}>
        <Link to={`/files/${resourceId}`}>{resource.toUpperCase()}</Link>
      </Tag>
    );
  }

  return <Tag color={resourceTagColor(resource)}>{resource.toUpperCase()}</Tag>;
}

function resourceTagColor(resource: string) {
  switch (resource) {
    case "folder":
      return "volcano";
    case "file":
      return "cyan";
    case "session":
      return "geekblue";
    case "user":
      return "magenta";
    default:
      return "black";
  }
}

function ActionTag({ action }: { action: string }) {
  return <Tag color={actionTagColor(action)}>{action.toUpperCase()}</Tag>;
}

function actionTagColor(action: string) {
  switch (action) {
    case "visit":
      return "blue";
    case "create":
      return "green";
    case "update":
      return "yellow";
    case "delete":
      return "red";
    case "restore":
      return "purple";
    default:
      return "black";
  }
}
