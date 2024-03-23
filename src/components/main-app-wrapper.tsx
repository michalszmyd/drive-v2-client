import {
  ApiOutlined,
  BankOutlined,
  CompassOutlined,
  ControlOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  LeftOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  RightOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/css";
import {
  Breadcrumb,
  Button,
  Col,
  Drawer,
  Dropdown,
  Input,
  Layout,
  Menu,
  MenuProps,
  Row,
  Space,
  Tag,
} from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider, { SiderTheme } from "antd/es/layout/Sider";
import React, { useContext, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppTheme, colors, resolveThemeColor, Theme } from "../consts/colors";
import ThemeContext from "../contexts/theme-context";
import ReactHelper from "../helpers/react-helper";
import FolderModel from "../models/folder-model";
import CreateFolderModalForm from "./folders/create-folder-modal-form";
import { H1 } from "./shared/text-components";
import CurrentUserContext from "../contexts/current-user-context";
import Loading from "./shared/loading";
import { MobileOnlyView } from "react-device-detect";
import { isMobile } from "react-device-detect";
import OverflowButton from "./shared/overflow-button";

interface MainAppWrapperParams {
  children: React.ReactElement | React.ReactElement[];
  breadcrumbs?: Array<string | BreadcrumbElement>;
  title?: string | React.ReactElement;
  isLoading?: boolean;
}

type BreadcrumbElement = {
  href?: string;
  title: string;
};

export default function MainAppWrapper({
  children,
  breadcrumbs = [],
  title = undefined,
  isLoading = false,
}: MainAppWrapperParams) {
  const [leftBarMenuCollapsed, setLeftBarMenuCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const [isCreateFolderModalOpened, setIsCreateFolderModalOpened] =
    useState(false);
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const toggleTheme = () =>
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);

  const themeColors = resolveThemeColor(theme);

  const closeModal = () => {
    setIsCreateFolderModalOpened(false);
  };
  const openModal = () => {
    setIsCreateFolderModalOpened(true);
  };
  const onCreateFolder = (folder: FolderModel) => {
    navigate(`/folders/${folder.id}`);
    closeModal();
  };

  const lowerMenuItems: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/dashboard">My drive</Link>,
      icon: <CompassOutlined />,
    },
    {
      key: "2",
      label: "Folders",
      children: [
        {
          key: "2.1",
          label: <Link to="/folders">Folders</Link>,
        },
        {
          key: "2.2",
          label: <Link to="/my-folders">My Folders</Link>,
        },
        {
          key: "2.3",
          label: <a onClick={openModal}>Create folder</a>,
          icon: <FolderAddOutlined />,
        },
      ],
      icon: <FolderOpenOutlined />,
    },
    {
      key: "3",
      label: "Applications",
      icon: <ApiOutlined />,
      children: [
        {
          key: "3.1",
          label: (
            <Link to="/applications">
              <Space>
                Applications
                <Tag color="cyan">API</Tag>
              </Space>
            </Link>
          ),
        },
        {
          key: "3.2",
          label: <Link to="/applications/api-docs">API Docs</Link>,
        },
      ],
    },
    {
      key: "4",
      label: <Link to="/deleted-files">Deleted Files</Link>,
      icon: <DeleteOutlined />,
    },
  ];

  const adminPanelMenuItems = {
    key: "5",
    label: "Admin",
    icon: <BankOutlined />,
    children: [
      {
        key: "5.1",
        label: <Link to="/admin/users">Users</Link>,
        icon: <UserSwitchOutlined />,
      },
      {
        key: "5.2",
        label: <Link to="/admin/applications">Applications</Link>,
        icon: <ControlOutlined />,
      },
      {
        key: "5.3",
        label: "Files",
        icon: <ProfileOutlined />,
        children: [
          {
            key: "5.3.1",
            label: <Link to="/admin/deleted-files">Deleted files</Link>,
            icon: <DeleteOutlined />,
          },
        ],
      },
    ],
  };

  currentUser?.admin && lowerMenuItems.push(adminPanelMenuItems);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      <CreateFolderModalForm
        onCreate={onCreateFolder}
        opened={isCreateFolderModalOpened}
        onCloseModal={closeModal}
      />
      <Layout style={{ display: "flex", flex: 1, minHeight: "100vh" }}>
        <Leftbar
          theme={theme}
          leftBarMenuCollapsed={leftBarMenuCollapsed}
          setLeftBarMenuCollapsed={setLeftBarMenuCollapsed}
          lowerMenuItems={lowerMenuItems}
        />
        <Layout
          style={{
            background: themeColors.background,
            padding: "0 14px 0",
            flex: 1,
            display: "flex",
          }}
        >
          <AppHeader theme={themeColors}>
            <Space>
              <Breadcrumb
                items={breadcrumbList(breadcrumbs)}
                style={{ margin: "16px 0" }}
              ></Breadcrumb>
            </Space>
          </AppHeader>
          <Content
            className={ReactHelper.arrayToClassName(styles.content)}
            style={{ background: themeColors.background }}
          >
            {title && <H1>{title}</H1>}
            {isLoading ? <Loading color={colors.textBlack} /> : children}
          </Content>
          <MobileOnlyView>
            <OverflowButton
              onClick={() => setLeftBarMenuCollapsed(true)}
              icon={<MenuUnfoldOutlined />}
            />
          </MobileOnlyView>
        </Layout>
      </Layout>
    </ThemeContext.Provider>
  );
}

function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [q, setQ] = useState<string>(params.get("q") || "");

  const onSubmit = () => {
    navigate(`/activities?q=${q}`);
  };

  return (
    <Input.Search
      value={q}
      placeholder="Type to search"
      onChange={({ target: { value } }) => setQ(value)}
      onSearch={onSubmit}
    />
  );
}

function AppHeader({
  theme,
  children,
  rightMenuChildren,
}: {
  theme: AppTheme;
  children?: React.ReactNode;
  rightMenuChildren?: React.ReactNode;
}) {
  return (
    <Header
      style={{ padding: "0 24px 0 0", backgroundColor: theme.background }}
    >
      <Row justify="start" align="middle">
        <Col span={6} className={styles.menuLeft}>
          {children ? (
            children
          ) : (
            <Space>
              <Button shape="circle" type="link">
                <LeftOutlined />
              </Button>
              <Button type="link">
                <RightOutlined />
              </Button>
            </Space>
          )}
        </Col>
        <Col style={{ display: "flex" }} span={14}>
          <Search />
        </Col>
        <Col span={4} className={styles.menuRight}>
          <Space>
            {rightMenuChildren}
            <Dropdown
              menu={{
                items: [
                  {
                    key: "menu-right-profile-1",
                    label: <Link to="/profile">My profile</Link>,
                  },
                  {
                    key: "menu-right-logout-2",
                    label: <Link to="/settings">Settings</Link>,
                  },
                  {
                    key: "menu-right-logout-3",
                    label: <Link to="/profile">Log out</Link>,
                  },
                ],
              }}
              placement="bottom"
              arrow
            >
              <Button
                type="primary"
                shape="circle"
                className={styles.avatar}
                size="large"
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </Header>
  );
}

function breadcrumbList(
  breadcrumbs: Array<BreadcrumbElement | string>,
): BreadcrumbElement[] {
  if (!breadcrumbs) return [];

  return breadcrumbs.map((breadcrumbItem) => {
    if (breadcrumbItem instanceof Object) {
      const { title, href }: { title: string; href?: string } = breadcrumbItem;

      return { title, href };
    } else {
      return {
        title: breadcrumbItem.toString(),
      };
    }
  });
}

function Leftbar({
  theme,
  leftBarMenuCollapsed,
  setLeftBarMenuCollapsed,
  lowerMenuItems,
}: {
  theme: SiderTheme | undefined;
  leftBarMenuCollapsed: boolean;
  setLeftBarMenuCollapsed: (value: boolean) => void;
  lowerMenuItems: MenuProps["items"];
}) {
  if (!isMobile) {
    return (
      <Sider
        theme={theme}
        width={200}
        collapsible
        collapsed={leftBarMenuCollapsed}
        onCollapse={setLeftBarMenuCollapsed}
      >
        <Row justify="center" align="middle">
          <Col>
            <ul
              style={{
                border: 0,
                listStyleType: "none",
                margin: 0,
                padding: 0,
              }}
              className="ant-menu ant-menu-root ant-menu-inline ant-menu-light"
            >
              <li>
                <img
                  className={styles.logoImage}
                  src="/favicon.ico"
                  alt="image"
                />
              </li>
            </ul>
          </Col>
        </Row>
        <Menu
          theme={theme}
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ borderRight: 0 }}
          items={lowerMenuItems}
        />
      </Sider>
    );
  }

  return (
    <Drawer
      title="Menu"
      placement="left"
      onClose={() => setLeftBarMenuCollapsed(false)}
      open={leftBarMenuCollapsed}
      key="left"
    >
      <Menu
        theme={theme}
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
        items={lowerMenuItems}
      />
    </Drawer>
  );
}

const styles = {
  content: css(`
    padding: 0 12px;
    min-height: 280px;
    margin-bottom: 15px;
  `),
  menuRight: css({
    justifyContent: "right",
    flex: 1,
    display: "flex",
    alignItems: "center",
  }),
  logoImage: css({
    width: "64px",
    height: "64px",
    justifyContent: "center",
    padding: "12px",
  }),
  menuLeft: css({
    justifyContent: "left",
    flex: 1,
    display: "flex",
    alignItems: "center",
  }),
  avatar: css({
    backgroundColor: colors.main,
  }),
};
