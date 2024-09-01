import { Col, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import ApplicationsService from "../services/applications-service";
import ApplicationModel from "../models/application-model";
import ActivitiesTableList from "../components/activities/table-list";
import MainAppWrapper from "../components/main-app-wrapper";
import { activityToTableItem } from "../helpers/activities/activity-to-table-item";
import useActivities from "../hooks/application-activities-hook";
import { css } from "@emotion/css";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";

export default function ApplicationsDashboardPage() {
  const [applications, setApplications] = useState<ApplicationModel[]>([]);
  const {
    activities,
    applicationId,
    setApplicationId,
    isLoading,
    tableParams,
    onTableChange,
  } = useActivities();

  useEffect(() => {
    ApplicationsService.all({ page: 1, per: 20 }).then(({ records }) =>
      setApplications(records),
    );
  }, []);

  const tableItems = activities.map(activityToTableItem);

  return (
    <AuthenticatedRoute>
      <MainAppWrapper
        title="Dashboard"
        breadcrumbs={["Applications Dashboard"]}
      >
        <Row className={styles.filters} gutter={[16, 16]}>
          <Col span={24}>
            <label>
              <Typography.Title level={5}>Select Application</Typography.Title>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Application"
                onSelect={setApplicationId}
                options={applications.map((application) => ({
                  label: application.name,
                  value: application.id,
                }))}
              />
            </label>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="end">
          <Col span={24}>
            {applicationId && (
              <ActivitiesTableList
                isLoading={isLoading}
                pagination={tableParams.pagination}
                onTableChange={onTableChange}
                tableItems={tableItems}
              />
            )}
          </Col>
        </Row>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

const styles = {
  filters: css({
    marginBottom: 14,
  }),
};
