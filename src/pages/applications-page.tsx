import { useEffect, useState } from "react";
import ApplicationsService from "../services/applications-service";
import ApplicationModel, {
  ApplicationStatus,
} from "../models/application-model";
import MainAppWrapper from "../components/main-app-wrapper";
import {
  Button,
  Col,
  Popover,
  Row,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
} from "antd";
import Column from "antd/es/table/Column";
import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SlidersOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { H1 } from "../components/shared/text-components";
import CreateApplicationModal from "../components/applications/create-application-modal";
import { toast } from "react-toastify";
import { css } from "@emotion/css";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import tableStyles from "../styles/table";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationModel[]>([]);
  const [isAddApplicationModalOpen, setIsAddApplicationModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = ({ page, per }: { page: number; per: number }) => {
    ApplicationsService.all({ page, per })
      .then(({ records, pages }) => {
        setApplications(records);
        setTableParams({
          pagination: {
            current: pages.currentPage,
            pageSize: pages.per,
            total: pages.total,
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onTableChange = ({ current, pageSize }: TablePaginationConfig) => {
    const defaultParams = {
      page: current || 1,
      per: pageSize || 10,
    };

    return fetchData(defaultParams);
  };

  useEffect(() => {
    fetchData({ page: 1, per: 10 });
  }, []);

  const userToTableItem = (application: ApplicationModel) => {
    const {
      id,
      status,
      name,
      description,
      privateKey,
      publicKey,
      createdAt,
      updatedAt,
      lastUsedAt,
    } = application;

    return {
      key: id,
      id,
      status,
      name,
      description,
      privateKey,
      publicKey,
      lastUsedAt,
      createdAt,
      updatedAt,
    };
  };

  const tableItems = applications.map(userToTableItem);

  const updateApplicationsElement = (
    record: ApplicationModel,
    {
      attribute,
      value,
    }: {
      attribute: string;
      value: unknown;
    },
  ) => {
    setApplications((state) => {
      return state.map((element) => {
        if (element.id === record.id) {
          element[attribute] = value;

          return element;
        }

        return element;
      });
    });
  };

  const onToggleAddApplicationModal = () => {
    setIsAddApplicationModalOpen((state) => !state);
  };

  const onApplicationFormSubmit = (application: ApplicationModel) => {
    ApplicationsService.create(application.toParams())
      .then((createdApplication: ApplicationModel) => {
        toast.success("Application created.");

        setApplications((state) => [createdApplication].concat(state));
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  const onReloadPrivateApiKey = (record: ApplicationModel) => {
    if (!record.id) return;

    ApplicationsService.regeneratePrivateApiKey(record.id)
      .then((updatedApplicationModel: ApplicationModel) => {
        toast.success("Application updated.");

        updateApplicationsElement(record, {
          attribute: "privateKey",
          value: updatedApplicationModel.privateKey,
        });
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  const onRemoveApplication = (record: ApplicationModel) => {
    if (!record.id) return;

    ApplicationsService.delete(record.id)
      .then(() => {
        toast.success("Application removed.");

        setApplications((state) =>
          state.filter((element) => element.id !== record.id),
        );
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  const onStatusToggleApplication = (record: ApplicationModel) => {
    if (!record.id) return;

    const currentStatus = record.status;

    updateApplicationsElement(record, {
      attribute: "status",
      value: ApplicationStatus.Waiting,
    });

    ApplicationsService.toggleStatus(record.id)
      .then((updatedApplicationModel: ApplicationModel) => {
        toast.success("Application updated.");

        updateApplicationsElement(record, {
          attribute: "status",
          value: updatedApplicationModel.status,
        });
      })
      .catch((e) => {
        const { data } = JSON.parse(e.message);

        updateApplicationsElement(record, {
          attribute: "status",
          value: currentStatus,
        });

        toast.error(`Error: ${JSON.stringify(data)}`);
      });
  };

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={["Applications", "Your applications"]}>
        <CreateApplicationModal
          onSubmit={onApplicationFormSubmit}
          onCancel={onToggleAddApplicationModal}
          open={isAddApplicationModalOpen}
        />
        <Row align="middle">
          <Col className={styles.titleContainer}>
            <H1>Applications</H1>
          </Col>
          <Col>
            <Button
              icon={<ApiOutlined />}
              onClick={onToggleAddApplicationModal}
            >
              Add
            </Button>
          </Col>
        </Row>
        <Table
          className={tableStyles.table}
          onChange={onTableChange}
          loading={isLoading}
          pagination={tableParams.pagination}
          dataSource={tableItems}
        >
          <Column
            key="application-status"
            title="Status"
            dataIndex="status"
            render={(_: string, record: ApplicationModel) => (
              <StatusTag status={record.status} />
            )}
          />
          <Column key="application-name" title="Name" dataIndex="name" />
          <Column
            key="application-description"
            title="Description"
            dataIndex="description"
          />
          <Column
            key="application-publicKey"
            title="Public key"
            dataIndex="publicKey"
          />
          <Column
            key="application-privateKey"
            title="Private key"
            dataIndex="privateKey"
          />
          <Column
            key="application-lastUsedAt"
            title="Last used at"
            dataIndex="lastUsedAt"
          />
          <Column
            key="application-createdAt"
            title="Created At"
            dataIndex="createdAt"
          />
          <Column
            key="application-updatedAt"
            title="Updated At"
            dataIndex="updatedAt"
          />
          <Column
            title="Action"
            key="action"
            render={(_: string, record: ApplicationModel) => (
              <Space size="middle">
                <Popover title="Recreate private key">
                  <Button
                    onClick={() => onReloadPrivateApiKey(record)}
                    shape="circle"
                    icon={<ReloadOutlined />}
                  />
                </Popover>
                <Popover title="Toggle app status">
                  <Button
                    onClick={() => onStatusToggleApplication(record)}
                    shape="circle"
                    icon={<SlidersOutlined />}
                  />
                </Popover>
                <Popover title="Delete app">
                  <Button
                    onClick={() => onRemoveApplication(record)}
                    danger
                    shape="circle"
                    icon={<DeleteOutlined />}
                  />
                </Popover>
              </Space>
            )}
          />
        </Table>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

function StatusTag({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case ApplicationStatus.Waiting:
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          Processing
        </Tag>
      );
    case ApplicationStatus.Enabled:
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Enabled
        </Tag>
      );
    case ApplicationStatus.Disabled:
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Disabled
        </Tag>
      );
  }
}

const styles = {
  titleContainer: css({
    flex: 1,
  }),
};
