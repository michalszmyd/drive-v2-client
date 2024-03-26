import {
  LeftOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/css";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  Space,
} from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppTheme, colors, resolveThemeColor, Theme } from "../consts/colors";
import ThemeContext from "../contexts/theme-context";
import ReactHelper from "../helpers/react-helper";
import FolderModel from "../models/folder-model";
import CreateFolderModalForm from "./folders/create-folder-modal-form";
import { H1 } from "./shared/text-components";
import CurrentUserContext from "../contexts/current-user-context";
import Loading from "./shared/loading";
import { MobileOnlyView } from "react-device-detect";
import OverflowButton from "./shared/overflow-button";
import Leftbar from "./navigation/left-bar";
import {
  Route,
  adminAppRoutes,
  buildAppRoutes,
  defaultAppRoutesLabelsDescribed,
  mainAppRoutes,
} from "./navigation/router";
import ObjectHelper from "../helpers/object-helper";
import Search from "./shared/search";

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

  defaultAppRoutesLabelsDescribed.createFolder.label = (
    <a onClick={openModal}>Create Folder</a>
  );

  const appRoutesLabels = ObjectHelper.values(
    defaultAppRoutesLabelsDescribed,
  ) as Route[];

  const resolvedRoutes = currentUser?.admin
    ? mainAppRoutes.concat(adminAppRoutes)
    : mainAppRoutes;

  const { flatRoutes, menuItems } = buildAppRoutes(
    resolvedRoutes,
    appRoutesLabels,
  );

  const selectedKey = flatRoutes.find(
    (e) => e.route === window.location.pathname,
  );

  const lowerMenuItems: MenuProps["items"] = menuItems;

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      <CreateFolderModalForm
        onCreate={onCreateFolder}
        opened={isCreateFolderModalOpened}
        onCloseModal={closeModal}
      />
      <Layout style={{ display: "flex", flex: 1, minHeight: "100vh" }}>
        <Leftbar
          selectedKey={selectedKey?.key || "1"}
          theme={theme}
          leftBarMenuCollapsed={leftBarMenuCollapsed}
          setLeftBarMenuCollapsed={setLeftBarMenuCollapsed}
          lowerMenuItems={lowerMenuItems}
        />
        <Layout
          style={{ background: themeColors.background }}
          className={styles.innerLayout}
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

const styles = {
  content: css(`
    padding: 0 12px;
    min-height: 280px;
    margin-bottom: 15px;
  `),
  innerLayout: css({
    padding: "0 14px 0",
    flex: 1,
    display: "flex",
  }),
  menuRight: css({
    justifyContent: "right",
    flex: 1,
    display: "flex",
    alignItems: "center",
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
