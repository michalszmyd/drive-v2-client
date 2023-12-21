import { FolderAddOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Breadcrumb, Layout, Menu, MenuProps } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors, resolveThemeColor, Theme } from "../consts/colors";
import ThemeContext from "../contexts/theme-context";
import ReactHelper from "../helpers/react-helper";
import { uuid } from "../helpers/uuid-helper";
import FolderModel from "../models/folder-model";
import CreateFolderModalForm from "./folders/create-folder-modal-form";
import { H1 } from "./shared/text-components";

interface MainAppWrapperParams {
  children: React.ReactElement | React.ReactElement[];
  breadcrumbs?: Array<string | BreadcrumbElement>;
  title?: string;
}

type BreadcrumbElement = {
  href?: string;
  title: string;
}

export default function MainAppWrapper({
  children,
  breadcrumbs = [],
  title = undefined,
}: MainAppWrapperParams) {
  const [leftBarMenuCollapsed, setLeftBarMenuCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const [isCreateFolderModalOpened, setIsCreateFolderModalOpened] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);

  const themeColors = resolveThemeColor(theme);

  const closeModal = () => { setIsCreateFolderModalOpened(false) };
  const openModal = () => {
    setIsCreateFolderModalOpened(true);
  }
  const onCreateFolder = (folder: FolderModel) => {
    navigate(`/folders/${folder.id}`);
    closeModal();
  }

  const lowerMenuItems: MenuProps['items'] = [
    {
      key: 1,
      label:  <Link to="/dashboard">My drive</Link>,
    },
    {
      key: 2,
      label: <Link to="/folders">Folders</Link>,
      children: [
        {
          key: 2.1,
          label: <Link to="/my-folders">My Folders</Link>,
        }
      ]
    },
    {
      key: 3,
      label: 'Files',
      children: [
        {
          key: 3.1,
          label: 'My files'
        }
      ]
    },
    {
      key: 3,
      label: <a onClick={openModal}>Create folder</a>,
      icon: <FolderAddOutlined />
    }
  ]

  return (
    <ThemeContext.Provider value={{theme, setTheme: toggleTheme}}>
      <CreateFolderModalForm onCreate={onCreateFolder} opened={isCreateFolderModalOpened} onCloseModal={closeModal} />
      <Layout style={{display: 'flex', flex: 1, minHeight: '100vh'}}>
        <Header className="header light">
          <div className="logo" />
          <button onClick={toggleTheme}>theme</button>
        </Header>
        <Layout>
          <Sider theme={theme} width={200} collapsible collapsed={leftBarMenuCollapsed} onCollapse={setLeftBarMenuCollapsed}>
            <Menu
              theme={theme}
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
              items={lowerMenuItems}
            />
          </Sider>
          <Layout style={{ background: themeColors.backgroundSecondary, padding: '0 14px 14px', flex: 1, display: 'flex' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {breadcrumbs.map((breadcrumb) => (
                <BreadcrumbItem breadcrumbItem={breadcrumb} />
              ))}
            </Breadcrumb>
            <Content className={ReactHelper.arrayToClassName(styles.content)} style={{background: themeColors.background}}>
              {title && <H1>{title}</H1>}
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ThemeContext.Provider>
  );
}

function BreadcrumbItem({
  breadcrumbItem,
}: {
  breadcrumbItem: string | BreadcrumbElement;
}) {
  if (typeof breadcrumbItem === 'string') {
    return (
      <Breadcrumb.Item key={breadcrumbItem}>{breadcrumbItem}</Breadcrumb.Item>
    )
  }

  return (
    <Breadcrumb.Item key={breadcrumbItem.title}>
      {
        breadcrumbItem.href ? <Link to={breadcrumbItem.href}>{breadcrumbItem.title}</Link> : breadcrumbItem.title
      }

    </Breadcrumb.Item>
  )
}

const styles = {
  content: css(`
    padding: 24px;
    margin: 0;
    min-height: 280px;
    background: ${colors.white};
    -webkit-box-shadow: 0px 0px 26px -16px rgba(66, 68, 90, 1);
    -moz-box-shadow: 0px 0px 26px -16px rgba(66, 68, 90, 1);
    box-shadow: 0px 0px 26px -16px rgba(66, 68, 90, 1);
  `)
}
