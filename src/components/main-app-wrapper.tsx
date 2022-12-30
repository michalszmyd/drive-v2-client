import { css } from "@emotion/css";
import { Breadcrumb, Layout, Menu, MenuProps } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { colors, resolveThemeColor, Theme } from "../consts/colors";
import ThemeContext from "../contexts/theme-context";
import ReactHelper from "../helpers/react-helper";

interface MainAppWrapperParams {
  children: React.ReactElement | React.ReactElement[];
  breadcrumbs?: string[];
}

export default function MainAppWrapper({
  children,
  breadcrumbs = []
}: MainAppWrapperParams) {
  const [leftBarMenuCollapsed, setLeftBarMenuCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.Light);

  const toggleTheme = () => setTheme(theme == Theme.Light ? Theme.Dark : Theme.Light);

  const themeColors = resolveThemeColor(theme);

  return (
    <ThemeContext.Provider value={{theme, setTheme: toggleTheme}}>
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
                <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <Content className={ReactHelper.arrayToClassName(styles.content)} style={{background: themeColors.background}}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ThemeContext.Provider>
  );
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

const lowerMenuItems : MenuProps['items'] = [
  {
    key: 1,
    label: 'My drive',
  },
  {
    key: 2,
    label: 'Folders',
    children: [
      {
        key: 2.1,
        label: 'My folders'
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

]

const upperMenuItems : MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));
