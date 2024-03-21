import { Col, Divider, Image, Row, TablePaginationConfig } from "antd";
import { useContext, useEffect, useState } from "react";
import AuthenticatedRoute from "../components/authenticated/authenticated-route"
import MainAppWrapper from "../components/main-app-wrapper";
import ItemModel from "../models/item-model";
import ItemsService from "../services/items-service";
import Search from "antd/es/input/Search";
import CurrentUserContext from "../contexts/current-user-context";
import TableItemsList, { TableParams } from "../components/files/table-list";
import { ItemRow, tableHeader } from "../components/activities/item-row";
import { useSearchParams } from "react-router-dom";
import StringHelper from "../helpers/string-helper";

export default function ActivitiesPage() {
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

  const [params] = useSearchParams();

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
    const querySearch = params.get("q");

    if (querySearch && StringHelper.isPresent(querySearch)) {
      fetchSearchData({page: 1, per: 10, query: querySearch})
    } else {
      fetchData({page: 1, per: 10});
    }
  }, [params]);

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
              <TableItemsList
                columns={tableHeader}
                isLoading={isLoading}
                onChange={onTableChange}
                pagination={tableParams.pagination}
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
