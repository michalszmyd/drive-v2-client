import { FileOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { Col, Divider, Image, Row, Space, Table, TablePaginationConfig, Tag } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated/authenticated-route"
import MainAppWrapper from "../components/main-app-wrapper";
import ItemModel from "../models/item-model";
import ItemsService from "../services/items-service";
import Search from "antd/es/input/Search";
import { css } from "@emotion/css";
import tableStyles from "../styles/table";
import CardExtraActions from "../components/folders/card-extra-actions";
import CurrentUserContext from "../contexts/current-user-context";
import UserModel from "../models/user-model";
import { colors } from "../consts/colors";

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

  const {currentUser} = useContext(CurrentUserContext);

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
            <Image.PreviewGroup>
              <Table
                scroll={{ x: '100%' }}
                columns={tableHeader}
                loading={isLoading}
                onChange={onTableChange}
                pagination={tableParams.pagination}
                className={`${tableStyles.table} ${styles.table}`}
                dataSource={items.map((item) => (
                  ItemRow({item, currentUser})
                ))}
              />
            </Image.PreviewGroup>
          </Col>
        </Row>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

function ItemRow({item, currentUser}: {item: ItemModel, currentUser: UserModel | null}) {
  if (item.recordType === 'folder') {
    return              {
      key: item.id,
      type: <ItemLabel item={item} />,
      preview: <ItemPreview item={item} />,
      userName: item.userName,
      name: <Link className={styles.folderLink} to={`/folders/${item.id}`}>{item.name}</Link>,
      folderName: <Link to={`/folders/${item.folderId}`}>{item.folderName}</Link>,
      folder: <b>{item.folderId}</b>,
      pinned: <></>,
    };
  }

  return {
    key: item.id,
    type: <ItemLabel item={item} />,
    preview: <ItemPreview item={item} />,
    name: <Link to={`/files/${item.id}`}>{item.name}</Link>,
    userName: item.userName,
    folderName: <Link className={styles.folderLink} to={`/folders/${item.folderId}`}>{item.folderName}</Link>,
    pinned: item.pinned && <Tag color="yellow">Pinned</Tag>,
    actions: <CardExtraActions
      manageActionsEnabled={currentUser?.id === item.userId}
      sourceUrl={item.sourceUrl}
      editLinkTo={`/files/${item.id}/edit`}
    />
  }
}

function ItemPreview({item}: {item: ItemModel}) {
  if (!item.sourceUrl) {
    return null;
  }

  if (item.isImage) {
    return <Image
      src={item.sourceUrl}
    />
  }
  if (item.isVideo) {
    return <video  src={item.sourceUrl} controls controlsList="play" />
  }

  return null;
}

const styles = {
  table: css(`
    img, .ant-image-mask, video {
      max-height: 100px;
      max-width: 100px;
      border-radius: 10px;
      .ant-image-mask {
        border-radius: 10px;
      }
    }
  `),
  folderLink: css({
    fontWeight: 700,
    color: colors.main,
  }),
}

function ItemLabel({item}: {item: ItemModel}) {
  if (item.recordType === 'folder') {
    return (
      <FolderOpenOutlined />
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
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions'
  }
]
