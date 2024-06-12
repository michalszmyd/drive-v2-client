import { Affix, Button, Col, Drawer, FloatButton, Image, Input, Row, Select, Switch, TablePaginationConfig, Typography } from "antd";
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
import { isMobile } from "react-device-detect";
import { FileSearchOutlined } from "@ant-design/icons";

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
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{records: ItemModel[], pages: ResponsePages}>({
    records: [],
    pages: {currentPage: 1, totalPages: 0, per: 10, total: 0}
  });

  const {currentUser} = useContext(CurrentUserContext);

  useEffect(() => {
    UsersService.all().then(({records}) => setUsers(records))
  }, []);

  const onToggleDrawerVisible = () => {
    setIsDrawerVisible((state) => !state);
  }

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
          {isMobile ? (
            <>
              <Drawer
                bodyStyle={{paddingTop: 0}}
                title="Advanced Search"
                placement="right"
                closable={true}
                onClose={onToggleDrawerVisible}
                open={isDrawerVisible}
                getContainer={false}
              >
                <SearchForm
                  filterUsersIds={filterUsersIds}
                  users={users}
                  query={query}
                  isIncludePrivateFolders={isIncludePrivateFolders}
                  isExcludeFolders={isExcludeFolders}
                  pages={pages}
                  languages={languages}
                  floatSubmit={true}
                  onLanguagesChange={onLanguagesChange}
                  setFilterUsersIds={setFilterUsersIds}
                  onSubmit={onSubmit}
                  onQueryChange={onQueryChange}
                  onCreatedAtFromChange={onCreatedAtFromChange}
                  onCreatedAtToChange={onCreatedAtToChange}
                  onToggleIncludePrivateFolders={onToggleIncludePrivateFolders}
                  onToggleExcludeFolders={onToggleExcludeFolders}
                  className={styles.mobileSearchContainer}
                />
              </Drawer>
              <FloatButton shape="square" description="Filters" icon={<FileSearchOutlined />} onClick={onToggleDrawerVisible} />
            </>
          ) : (
            <SearchForm
              filterUsersIds={filterUsersIds}
              users={users}
              query={query}
              isIncludePrivateFolders={isIncludePrivateFolders}
              isExcludeFolders={isExcludeFolders}
              languages={languages}
              pages={pages}
              floatSubmit={false}
              onLanguagesChange={onLanguagesChange}
              setFilterUsersIds={setFilterUsersIds}
              onSubmit={onSubmit}
              onQueryChange={onQueryChange}
              onCreatedAtFromChange={onCreatedAtFromChange}
              onCreatedAtToChange={onCreatedAtToChange}
              onToggleIncludePrivateFolders={onToggleIncludePrivateFolders}
              onToggleExcludeFolders={onToggleExcludeFolders}
              className={styles.searchContainer}
            />
          )}
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} className={styles.container}>
            <Row gutter={[16, 16]}>
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

function SearchForm({
  filterUsersIds,
  users,
  query,
  isIncludePrivateFolders,
  isExcludeFolders,
  className,
  languages,
  pages,
  floatSubmit,
  onLanguagesChange,
  setFilterUsersIds,
  onSubmit,
  onQueryChange,
  onCreatedAtFromChange,
  onCreatedAtToChange,
  onToggleIncludePrivateFolders,
  onToggleExcludeFolders,
}: {
  filterUsersIds: number[];
  users: UserModel[];
  query: string;
  isIncludePrivateFolders: boolean;
  isExcludeFolders: boolean;
  languages: string[];
  className: string;
  pages: ResponsePages;
  floatSubmit: boolean;
  onLanguagesChange: (value: string[]) => void;
  setFilterUsersIds: (value: number[]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onQueryChange: ({ target: { value } }: { target: { value: string; };}) => void;
  onCreatedAtFromChange: ({ target: { value } }: { target: { value: string; };}) => void;
  onCreatedAtToChange: ({ target: { value } }: { target: { value: string; };}) => void;
  onToggleIncludePrivateFolders: () => void;
  onToggleExcludeFolders: () => void;
}) {
  return (
    <>
      <Col xxl={12} xl={12} lg={12} md={24} sm={24} className={className}>
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
            <Col xxl={12} xl={12} lg={12} md={24} sm={24}>
              <label>
                <Typography.Title level={5}>Created at from</Typography.Title>
                <Input type="date" name="createdAtFrom" onChange={onCreatedAtFromChange}></Input>
              </label>
            </Col>
            <Col xxl={12} xl={12} lg={12} md={24} sm={24}>
              <label>
                <Typography.Title level={5}>Created at to</Typography.Title>
                <Input type="date" name="createdAtTo" onChange={onCreatedAtToChange}></Input>
              </label>
            </Col>
            <Col xxl={12} xl={12} lg={12} md={24} sm={24}>
              <label>
                <Typography.Title level={5}>Include your private folders</Typography.Title>
                <Switch onChange={onToggleIncludePrivateFolders} checked={isIncludePrivateFolders} />
              </label>
            </Col>
            <Col xxl={12} xl={12} lg={12} md={24} sm={24}>
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
              {floatSubmit ? (
                <Affix offsetBottom={45}>
                  <div className={styles.affixBox}>
                    <Typography.Title level={5}>Results: <b>{pages.total}</b></Typography.Title>
                    <Button htmlType="submit" onClick={onSubmit} type="primary">Search</Button>
                  </div>
                </Affix>
              ) : (
                <>
                  <Typography.Title level={5}>Results: <b>{pages.total}</b></Typography.Title>
                  <Button htmlType="submit" onClick={onSubmit} type="primary">Search</Button>
                </>
              )}
            </Col>
          </Row>
        </form>
      </Col>
    </>
  );
}

const styles = {
  searchContainer: css({
    backgroundColor: colors.darkWhite,
    padding: 24,
    boxSizing: 'border-box',
    marginBottom: 24,
  }),
  mobileSearchContainer: css({
    padding: 24,
    boxSizing: 'border-box',
    marginBottom: 24,
  }),
  container: css({
    padding: '0px 24px',
    boxSizing: 'border-box',
  }),
  selectInput: css({
    width: '100%',
  }),
  affixBox: css(`
    -webkit-box-shadow: 0px 0px 43px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 43px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 43px -18px rgba(0,0,0,0.75);
    background-color: ${colors.white};
    display: flex;
    flex-direction: column;
    padding: 24px;
    padding-top: 0;
    border-radius: 8px;
  `),
}
