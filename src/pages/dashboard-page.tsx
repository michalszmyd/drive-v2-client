import { FileOutlined, FolderOpenOutlined } from "@ant-design/icons";
import userEvent from "@testing-library/user-event";
import { Image, Space, Table, TablePaginationConfig } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated/authenticated-route"
import MainAppWrapper from "../components/main-app-wrapper";
import Text from "../components/shared/text";
import ItemModel from "../models/item-model";
import ItemsService from "../services/items-service";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function DashboardPage() {
  const [items, setItems] = useState<ItemModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = ({page, per}: {page: number; per: number}) => {
    ItemsService
      .all({page, per})
      .then(({records, pages}) => {
        setItems(records);
        setTableParams({
          pagination: {
            current: pages.currentPage,
            pageSize: pages.per,
            total: pages.totalPages,
          }
        })
      }).finally(() => {
        setIsLoading(false);
      });
  }

  const onTableChange = ({current, pageSize}: TablePaginationConfig) => {
    fetchData({page: current || 1, per: pageSize || 10});
  }

  useEffect(() => {
    fetchData({page: 1, per: 10});
  }, []);

  return (
    <AuthenticatedRoute>
      <MainAppWrapper breadcrumbs={['Dashboard']}>
        <Text>
          <h1>Recent files</h1>
        </Text>
        <Table
          columns={tableHeader}
          loading={isLoading}
          onChange={onTableChange}
          pagination={tableParams.pagination}
          dataSource={items.map((item) => (
            ItemRow({item})
          ))}
        />
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

function ItemRow({item}: {item: ItemModel}) {
  if (item.recordType === 'folder') {
    return              {
      key: item.id,
      type: <ItemLabel item={item} />,
      preview: <ItemPreview item={item} />,
      userName: item.userName,
      name: <Link to={`/folders/${item.id}`}>{item.name}</Link>,
      folderName: <Link to={`/folders/${item.folderId}`}>{item.folderName}</Link>,
      folder: <b>{item.folderId}</b>,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  return {
    key: item.id,
    type: <ItemLabel item={item} />,
    preview: <ItemPreview item={item} />,
    name: <Link to={`/files/${item.id}`}>{item.name}</Link>,
    userName: item.userName,
    folderName: <Link to={`/folders/${item.folderId}`}>{item.folderName}</Link>,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function ItemPreview({item}: {item: ItemModel}) {
  if (!item.isImage) {
    return null;
  }

  return <Image
    width={200}
    src={item.sourceUrl}
  />
}

function ItemLabel({item}: {item: ItemModel}) {
  if (item.recordType === 'folder') {
    return (
      <Space>
        <FolderOpenOutlined />
        <b>Folder</b>
      </Space>
    )
  }

  return (
    <FileOutlined />
  )
}

const tableHeader = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
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
    title: 'Created by',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: 'Folder',
    dataIndex: 'folderName',
    key: 'folderName',
  },
  {
    title: 'Created at',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Updated at',
    dataIndex: 'updatedAt',
    key: 'updatedAt'
  }
]
