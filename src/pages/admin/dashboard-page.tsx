import { Col, Row } from "antd";
import AuthenticatedAdminRoute from "../../components/authenticated/authenticated-admin-route";
import MainAppWrapper from "../../components/main-app-wrapper";
import useActivities from "../../hooks/admin/activites-hook";
import { activityToTableItem } from "../../helpers/activities/activity-to-table-item";
import ActivitiesTableList from "../../components/activities/table-list";

export default function DashboardPage() {
  const { activities, isLoading, tableParams, onTableChange } = useActivities();

  const tableItems = activities.map(activityToTableItem);

  return (
    <AuthenticatedAdminRoute>
      <MainAppWrapper title="Dashboard" breadcrumbs={["Admin Dashboard"]}>
        <Row gutter={[16, 16]} justify="end">
          <Col span={24}>
            <ActivitiesTableList
              isLoading={isLoading}
              pagination={tableParams.pagination}
              onTableChange={onTableChange}
              tableItems={tableItems}
            />
          </Col>
        </Row>
      </MainAppWrapper>
    </AuthenticatedAdminRoute>
  );
}
