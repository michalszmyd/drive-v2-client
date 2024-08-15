import { Col, Descriptions, Row, Tag } from "antd";
import AuthenticatedAdminRoute from "../../components/authenticated/authenticated-admin-route";
import MainAppWrapper from "../../components/main-app-wrapper";
import useActivities from "../../hooks/admin/activites-hook";
import TableItemsList from "../../components/files/table-list";
import ActivityModel, {
  ActivityActionType,
  ActivityResourceType,
} from "../../models/activity-model";
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
  resource: ActivityResourceType;
  resourceId?: number | null;
}) {
  if (resource === ActivityResourceType.Folder) {
    return (
      <Tag color={resourceTagColor(resource)}>
        <Link to={`/folders/${resourceId}`}>
          {resource.toString().toUpperCase()}
        </Link>
      </Tag>
    );
  }

  if (
    resource === ActivityResourceType.File ||
    resource === ActivityResourceType.FileShare
  ) {
    return (
      <Tag color={resourceTagColor(resource)}>
        <Link to={`/files/${resourceId}`}>
          {resource.toString().toUpperCase()}
        </Link>
      </Tag>
    );
  }

  return (
    <Tag color={resourceTagColor(resource)}>
      {resource.toString().toUpperCase()}
    </Tag>
  );
}

function resourceTagColor(resource: ActivityResourceType) {
  switch (resource) {
    case ActivityResourceType.Folder:
      return "volcano";
    case ActivityResourceType.File:
      return "cyan";
    case ActivityResourceType.Session:
      return "geekblue";
    case ActivityResourceType.User:
      return "magenta";
    case ActivityResourceType.FileShare:
      return "purple";
    default:
      return "black";
  }
}

function ActionTag({ action }: { action: ActivityActionType }) {
  return <Tag color={actionTagColor(action)}>{action.toUpperCase()}</Tag>;
}

function actionTagColor(action: ActivityActionType) {
  switch (action) {
    case ActivityActionType.Visit:
      return "blue";
    case ActivityActionType.Create:
      return "green";
    case ActivityActionType.Update:
      return "yellow";
    case ActivityActionType.Delete:
      return "red";
    case ActivityActionType.Restore:
      return "purple";
    default:
      return "black";
  }
}
