import { useEffect, useState } from "react";
import { Alert, Button, Col, Row, Space, TablePaginationConfig, Tag, Tooltip } from "antd";
import { css } from "@emotion/css";
import { DeleteFilled, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import DriveFileModel from "../../models/drive-file-model";
import MainAppWrapper from "../../components/main-app-wrapper";
import TableItemsList from "../../components/files/table-list";
import { colors } from "../../consts/colors";
import { ItemPreview } from "../../components/files/item-preview";
import AuthenticatedAdminRoute from "../../components/authenticated/authenticated-admin-route";
import AdminDriveFilesService from "../../services/admin-drive-file-service";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function AdminDeletedFilesPage() {
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
    fetchData({page: 1, per: 10});
  }, []);

  const onRestore = (restoredFile: DriveFileModel) => {
    if (!restoredFile.id) {
      return;
    }

    AdminDriveFilesService.restore(restoredFile.id).then(() => {
      setFiles((state) => {
        return state.filter((file : DriveFileModel) => file.id !== restoredFile.id)
      });
      setTotalFiles((state) => state - 1);
      toast.success('File restored');
    }).catch(() => {
      toast.error(`There was an error while trying to restore ${restoredFile.name}`);
    });
  }

  const onErase = (erasedFile: DriveFileModel) => {
    if (!erasedFile.id) {
      return;
    }

    AdminDriveFilesService.erase(erasedFile.id).then(() => {
      setFiles((state) => {
        return state.filter((file : DriveFileModel) => file.id !== erasedFile.id)
      });
      setTotalFiles((state) => state - 1);
      toast.success('File erased');
    }).catch(() => {
      toast.error(`There was an error while trying to erase ${erasedFile.name}`);
    });
  }

  const onEraseAll = () => {
    AdminDriveFilesService.eraseAll().then(() => {
      setFiles([]);
      setTotalFiles(0);
      toast.success('Erased all');
    }).catch(() => {
      toast.error(`There was an error while trying to erase all`);
    });
  }

  const fetchData = ({page, per}: {page: number; per: number}) => {
    AdminDriveFilesService
      .deleted({page, per})
      .then(({records, pages}) => {
        setFiles(records);
        setTableParams({
          pagination: {
            current: pages.currentPage,
            pageSize: pages.per,
            total: pages.total,
          }
        })
        setTotalFiles(pages.total);
      }).finally(() => {
        setIsLoading(false);
      });
  }

  const onTableChange = ({current, pageSize}: TablePaginationConfig) => {
    const defaultParams = {
      page: current || 1,
      per: pageSize || 10
    }

    return fetchData(defaultParams);
  }

  return (
    <AuthenticatedAdminRoute>
      <MainAppWrapper title="Deleted files" breadcrumbs={['Deleted files']}>
        <Row gutter={[16, 16]} justify="end">
          <Col span={24}>
            <Alert
              message="Files are permanently deleted after 7 days."
              description={
                <div>
                  Total number to delete: <span className={styles.deletedAt}>{totalFiles}</span>
                </div>
              }
              type="warning"
              showIcon
              closable
            />
          </Col>
          <Col  className={styles.alertContainer}>
            <Button
              type="primary"
              icon={<DeleteFilled />}
              danger
              onClick={onEraseAll}
            >
              Erase now
            </Button>
          </Col>
        </Row>
        <TableItemsList
          columns={tableHeader}
          isLoading={isLoading}
          onChange={onTableChange}
          pagination={tableParams.pagination}
          dataSource={files.map((file) => (
            FileRow({file, onRestore: () => onRestore(file), onErase: () => onErase(file)})
          ))}
        />
      </MainAppWrapper>
    </AuthenticatedAdminRoute>
  );
}

function FileRow({
  file,
  onRestore,
  onErase
}: {
  file: DriveFileModel,
  onRestore: () => void;
  onErase: () => void;
}) {
  return {
    key: file.id,
    preview: <ItemPreview item={file} />,
    name: file.name,
    pinned: file.pinned && <Tag color="yellow">Pinned</Tag>,
    userId: file.userId,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
    deletedAt: <span className={styles.deletedAt}>{file.deletedAt}</span>,
    actions:
        <Space>
          <Tooltip title="Restore">
            <Button onClick={onRestore} shape="circle" type="link">
              <RollbackOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Erase now">
            <Button onClick={onErase} shape="circle" type="link">
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
  }
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
    color: '#555'
  }),
  warning: css({
    color: colors.warning,
  })
}

const tableHeader = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Preview',
    dataIndex: 'preview',
    key: 'preview',
  },
  {
    title: 'Created at',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Updated at',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: 'Deleted at',
    dataIndex: 'deletedAt',
    key: 'deletedAt',
  },
  {
    title: 'User id',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: 'Pinned',
    dataIndex: 'pinned',
    key: 'pinned',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
]
