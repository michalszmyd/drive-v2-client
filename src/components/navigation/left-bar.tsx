import { css } from "@emotion/css";
import { Col, Drawer, Menu, MenuProps, Row } from "antd";
import Sider, { SiderTheme } from "antd/es/layout/Sider";
import { isMobile } from "react-device-detect";

export default function Leftbar({
  theme,
  leftBarMenuCollapsed,
  setLeftBarMenuCollapsed,
  lowerMenuItems,
  selectedKey,
}: {
  theme: SiderTheme | undefined;
  leftBarMenuCollapsed: boolean;
  setLeftBarMenuCollapsed: (value: boolean) => void;
  lowerMenuItems: MenuProps["items"];
  selectedKey: string;
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
          defaultOpenKeys={[selectedKey.split(".")[0]]}
          selectedKeys={[selectedKey]}
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
  logoImage: css({
    width: "64px",
    height: "64px",
    justifyContent: "center",
    padding: "12px",
  }),
};
