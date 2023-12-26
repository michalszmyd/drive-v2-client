import { FileOutlined, FolderOpenOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Image, Input, Row, Space, Table, TablePaginationConfig, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated/authenticated-route"
import MainAppWrapper from "../components/main-app-wrapper";
import Text from "../components/shared/text";
import ItemModel from "../models/item-model";
import ItemsService from "../services/items-service";
import Search from "antd/es/input/Search";
import { css } from "@emotion/css";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchData = ({page, per}: {page: number; per: number}) => {
    ItemsService
      .all({page, per})
      .then(({records, pages}) => {
        setItems(records);
        setTableParams({
          pagination: {
            current: pages.currentPage,
            pageSize: pages.per,
            total: pages.total,
          }
        })
      }).finally(() => {
        setIsLoading(false);
      });
  }

  const fetchSearchData = ({page, per, query}: {page: number, per: number, query: string}) => {
    setIsLoading(true);

    ItemsService
      .search({page, per, query})
      .then(({records, pages}) => {
        setItems(records);
        setTableParams({
          pagination: {
            current: pages.currentPage,
            pageSize: pages.per,
            total: pages.total,
          }
        })
      }).finally(() => {
        setIsLoading(false);
      });
  }

  const onTableChange = ({current, pageSize}: TablePaginationConfig) => {
    const defaultParams = {
      page: current || 1,
      per: pageSize || 10
    }

    if (isSearching) {
      return fetchSearchData({...defaultParams, query: searchQuery});
    }

    return fetchData(defaultParams);
  }

  const onSearch = () => {
    setIsSearching(true);

    fetchSearchData(
      {page: 1, per: 10, query: searchQuery}
    )
  }

  useEffect(() => {
    fetchData({page: 1, per: 10});
  }, []);

  return (
    <AuthenticatedRoute>
      <MainAppWrapper title="Recent Files" breadcrumbs={['Dashboard']}>
        <Divider orientation="left">Search Files</Divider>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
              onChange={({target: {value}}) => setSearchQuery(value)}
            />
          </Col>
        </Row>
        <Divider orientation="left">Files list</Divider>
        <Row gutter={16}>
          <Col span={24}>
            <Table
              columns={tableHeader}
              loading={isLoading}
              onChange={onTableChange}
              pagination={tableParams.pagination}
              dataSource={items.map((item) => (
                ItemRow({item})
              ))}
            />
          </Col>
        </Row>
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
      pinned: <></>,
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
    pinned: item.pinned && <Tag color="yellow">Pinned</Tag>,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function ItemPreview({item}: {item: ItemModel}) {
  if (!item.sourceUrl) {
    return null;
  }

  if (item.isImage) {
    return <Image
      className={styles.filePreview}
      src={item.sourceUrl}
    />
  }
  if (item.isVideo) {
    return <video className={styles.filePreview} src={item.sourceUrl} controls />
  }

  return null;
}

const styles = {
  filePreview: css({
    maxHeight: '100px',
    maxWidth: '100px',
  })
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
    title: 'Pinned',
    dataIndex: 'pinned',
    key: 'pinned',
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
