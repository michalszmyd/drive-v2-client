import { Button, Col, Image, Input, Row, Select, Switch, TablePaginationConfig, Typography } from "antd";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import { useContext, useEffect, useState } from "react";
import { colors } from "../consts/colors";
import UserModel from "../models/user-model";
import UsersService from "../services/users-service";
import ItemsService from "../services/items-service";
import { ResponsePages } from "../services/api-service";
import ItemModel from "../models/item-model";
import { tableHeader } from "../components/items/table-header";
import TableItemsList from "../components/files/table-list";
import { ItemRow } from "../components/items/item-row";
import CurrentUserContext from "../contexts/current-user-context";
import { css } from "@emotion/css";

const AVAILABLE_SEARCH_LANGUAGES = ['pl', 'en'];
const AVAILABLE_SEARCH_LANGUAGES_DATA = [
  {
    label: "Polish",
    value: "pl",
  },
  {
    label: "English",
    value: "en",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const [createdAtFrom, setCreatedAtFrom] = useState<string>("");
  const [createdAtTo, setCreatedAtTo] = useState<string>("");
  const [isExcludeFolders, setIsExcludeFolders] = useState<boolean>(false);
  const [isIncludePrivateFolders, setIsIncludePrivateFolders] = useState<boolean>(false);
  const [languages, setLanguages] = useState<string[]>(AVAILABLE_SEARCH_LANGUAGES);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [filterUsersIds, setFilterUsersIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{records: ItemModel[], pages: ResponsePages}>({
    records: [],
    pages: {currentPage: 1, totalPages: 0, per: 10, total: 0}
  });

  const {currentUser} = useContext(CurrentUserContext);

  useEffect(() => {
    UsersService.all().then(({records}) => setUsers(records))
  }, []);

  const onQueryChange = ({target: {value}}: {target: {value: string}}) => {
    setQuery(value);
  };

  const onCreatedAtFromChange = ({target: {value}}: {target: {value: string}}) => {
    setCreatedAtFrom(value);
  };

  const onCreatedAtToChange = ({target: {value}}: {target: {value: string}}) => {
    setCreatedAtTo(value);
  };

  const onToggleExcludeFolders = () => {
    setIsExcludeFolders((state) => !state);
  };

  const onToggleIncludePrivateFolders = () => {
    setIsIncludePrivateFolders((state) => !state);
  };

  const onLanguagesChange = (value: string[]) => {
    setLanguages(value);
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement, MouseEvent>) => {
    setIsLoading(true);

    e.preventDefault();

    const data = {
      query,
      createdAtFrom,
      createdAtTo,
      isExcludeFolders,
      isIncludePrivateFolders,
      languages,
      filterUsersIds,
      page: 1,
      per: searchResults.pages.per,
    };

    ItemsService.search(data).then(setSearchResults).finally(() => setIsLoading(false));
  };

  const onTableChange = ({ current, pageSize }: TablePaginationConfig) => {
    const data = {
      query,
      createdAtFrom,
      createdAtTo,
      isExcludeFolders,
      isIncludePrivateFolders,
      languages,
      filterUsersIds,
      page: current,
      per: pageSize,
    };

    ItemsService.search(data).then(setSearchResults).finally(() => setIsLoading(false));
  }

  const {records, pages} = searchResults;
  const pagination = {
    current: pages.currentPage,
    pageSize: pages.per,
    total: pages.total,
  };

  return (
    <AuthenticatedRoute>
      <MainAppWrapper title="Advanced search" breadcrumbs={["Search"]}>
        <Row>
          <Col span={12} className={styles.searchContainer}>
            <form onSubmit={onSubmit}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <label>
                    <Typography.Title level={5}>Search phrase*</Typography.Title>
                    <Input
                      placeholder='ex. searched "exact" -excluded'
                      value={query}
                      onChange={onQueryChange}
                      name="query"
                    />
                  </label>
                </Col>
                <Col span={12}>
                  <label>
                    <Typography.Title level={5}>Created at from</Typography.Title>
                    <Input type="date" name="createdAtFrom" onChange={onCreatedAtFromChange}></Input>
                  </label>
                </Col>
                <Col span={12}>
                  <label>
                    <Typography.Title level={5}>Created at to</Typography.Title>
                    <Input type="date" name="createdAtTo" onChange={onCreatedAtToChange}></Input>
                  </label>
                </Col>
                <Col span={12}>
                  <label>
                    <Typography.Title level={5}>Include your private folders</Typography.Title>
                    <Switch onChange={onToggleIncludePrivateFolders} checked={isIncludePrivateFolders} />
                  </label>
                </Col>
                <Col span={12}>
                  <label>
                    <Typography.Title level={5}>Exclude folders</Typography.Title>
                    <Switch onChange={onToggleExcludeFolders} checked={isExcludeFolders} />
                  </label>
                </Col>
                <Col span={24}>
                  <label>
                    <Typography.Title level={5}>Languages</Typography.Title>
                    <Select
                      onChange={onLanguagesChange}
                      mode="multiple"
                      allowClear
                      className={styles.selectInput}
                      placeholder="Please select"
                      value={languages}
                      options={AVAILABLE_SEARCH_LANGUAGES_DATA}
                    />
                  </label>
                </Col>
                <Col span={24}>
                  <label>
                    <Typography.Title level={5}>Uploaded by</Typography.Title>
                    <Select
                      onChange={setFilterUsersIds}
                      mode="multiple"
                      allowClear
                      className={styles.selectInput}
                      placeholder="Select Users"
                      value={filterUsersIds}
                      options={users.map((user) => ({label: user.name, value: user.id}))}
                    />
                  </label>
                </Col>
                <Col span={24}>
                  <Typography.Title level={5}>Results: <b>{pages.total}</b></Typography.Title>
                  <Button htmlType="submit" onClick={onSubmit} type="primary">Search</Button>
                </Col>
              </Row>
            </form>
          </Col>
          <Col span={12} className={styles.container}>
            <Row gutter={[0, 0]}>
              <Col span={24}>
                <Image.PreviewGroup>
                  <TableItemsList
                    columns={tableHeader}
                    isLoading={isLoading}
                    onChange={onTableChange}
                    pagination={pagination}
                    dataSource={records.map((item) => ItemRow({ item, currentUser }))}
                  />
                </Image.PreviewGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

const styles = {
  searchContainer: css({backgroundColor: colors.darkWhite, padding:24, boxSizing: 'border-box'}),
  container: css({ padding: '0px 24px', boxSizing: 'border-box'}),
  selectInput: css({ width: '100%' }),
}
