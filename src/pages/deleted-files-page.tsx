import { useEffect, useState } from "react";
import DriveFileModel from "../models/drive-file-model";
import {
  Alert,
  Button,
  Col,
  Row,
  TablePaginationConfig,
  Tag,
  Tooltip,
} from "antd";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import DriveFilesService from "../services/drive-files-service";
import { ItemPreview } from "../components/files/item-preview";
import { css } from "@emotion/css";
import TableItemsList from "../components/files/table-list";
import { RollbackOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { colors } from "../consts/colors";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function DeletedFilesPage() {
  const [files, setFiles] = useState<DriveFileModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    fetchData({ page: 1, per: 10 });
  }, []);

  const onRestore = (restoredFile: DriveFileModel) => {
    if (restoredFile.id) {
      DriveFilesService.restore(restoredFile.id)
        .then(() => {
          setFiles((state) => {
            return state.filter(
              (file: DriveFileModel) => file.id !== restoredFile.id,
            );
          });
          setTotalFiles((state) => state - 1);
          toast.success("File restored");
        })
        .catch(() => {
          toast.error(
            `There was an error while trying to restore ${restoredFile.name}`,
          );
        });
    }
  };

  const fetchData = ({ page, per }: { page: number; per: number }) => {
    DriveFilesService.deleted({ page, per })
      .then(({ records, pages }) => {
        setFiles(records);
        setTableParams({
          pagination: {
            current: pages.currentPage,
            pageSize: pages.per,
            total: pages.total,
          },
        });
        setTotalFiles(pages.total);
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

  return (
    <AuthenticatedRoute>
      <MainAppWrapper title="Deleted files" breadcrumbs={["Deleted files"]}>
        <Row>
          <Col span={24}>
            <Alert
              className={styles.alertContainer}
              message="Files are permanently deleted after 7 days."
              description={
                <div>
                  Total number to delete:{" "}
                  <span className={styles.deletedAt}>{totalFiles}</span>
                </div>
              }
              type="warning"
              showIcon
              closable
            />
          </Col>
        </Row>
        <TableItemsList
          columns={tableHeader}
          isLoading={isLoading}
          onChange={onTableChange}
          pagination={tableParams.pagination}
          dataSource={files.map((file) =>
            FileRow({ file, onRestore: () => onRestore(file) }),
          )}
        />
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

function FileRow({
  file,
  onRestore,
}: {
  file: DriveFileModel;
  onRestore: () => void;
}) {
  return {
    key: file.id,
    preview: <ItemPreview item={file} />,
    name: file.name,
    pinned: file.pinned && <Tag color="yellow">Pinned</Tag>,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
    deletedAt: <span className={styles.deletedAt}>{file.deletedAt}</span>,
    actions: (
      <Tooltip title="Restore">
        <Button onClick={onRestore} shape="circle" type="link">
          <RollbackOutlined />
        </Button>
      </Tooltip>
    ),
  };
}

const styles = {
  alertContainer: css({
    marginBottom: 15,
  }),
  deletedAt: css({
    color: colors.redDelete,
    fontWeight: 600,
  }),
  description: css({
    color: "#555",
  }),
  warning: css({
    color: colors.warning,
  }),
};

const tableHeader = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Preview",
    dataIndex: "preview",
    key: "preview",
  },
  {
    title: "Created at",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Updated at",
    dataIndex: "updatedAt",
    key: "updatedAt",
  },
  {
    title: "Deleted at",
    dataIndex: "deletedAt",
    key: "deletedAt",
  },
  {
    title: "Pinned",
    dataIndex: "pinned",
    key: "pinned",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
  },
];
