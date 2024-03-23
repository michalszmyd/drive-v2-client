import { useEffect, useState } from "react";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import UserSessionModel from "../models/user-session-model";
import UsersService from "../services/users-service";
import { Button, Collapse, Space, Tooltip } from "antd";
import Column from "antd/es/table/Column";
import {
  AndroidOutlined,
  AppleFilled,
  DeleteOutlined,
  DesktopOutlined,
  MobileOutlined,
  QuestionOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import TableItemsList from "../components/files/table-list";

export default function SettingsPage() {
  const [userSessions, setUserSessions] = useState<UserSessionModel[]>([]);

  useEffect(() => {
    UsersService.userSessions().then(setUserSessions);
  }, []);

  const onDeleteSession = (userSession: UserSessionModel) => {
    UsersService.deleteUserSession(userSession).then(() => {
      setUserSessions((state) =>
        state.filter((element) => element.id !== userSession.id),
      );

      toast.success("Session removed");
    });
  };

  const sessionToTableItem = (userSession: UserSessionModel) => {
    const {
      id,
      clientIp,
      operatingSystem,
      userAgent,
      deviceType,
      createdAt,
      updatedAt,
      lastUsedAt,
    } = userSession;

    return {
      key: `userSession-${id}`,
      id,
      createdAt,
      updatedAt,
      lastUsedAt,
      clientIp,
      operatingSystem,
      userAgent,
      deviceType,
    };
  };

  const tableDataSource = userSessions.map(sessionToTableItem);

  return (
    <AuthenticatedRoute>
      <MainAppWrapper title="Settings">
        <Collapse>
          <Collapse.Panel header="User sessions" key="user-sessions-1">
            <TableItemsList dataSource={tableDataSource}>
              <Column
                key="session-device"
                title="Device"
                dataIndex="device"
                render={(_, record: UserSessionModel) => (
                  <Space>
                    <DeviceType deviceType={record.deviceType} />
                    <OperatingSystem operatingSystem={record.operatingSystem} />
                  </Space>
                )}
              />
              <Column key="session-clientIp" title="IP" dataIndex="clientIp" />
              <Column
                key="session-userAgent"
                title="User Agent"
                dataIndex="userAgent"
              />
              <Column
                key="session-createdAt"
                title="Created At"
                dataIndex="createdAt"
              />
              <Column
                key="session-lastUsedAt"
                title="Last used at"
                dataIndex="lastUsedAt"
              />
              <Column
                key="session-actions"
                title="Actions"
                render={(_, record: UserSessionModel) => (
                  <Space>
                    <Tooltip title="Delete session">
                      <Button
                        onClick={() => onDeleteSession(record)}
                        danger
                        shape="circle"
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Space>
                )}
              />
            </TableItemsList>
          </Collapse.Panel>
        </Collapse>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

function DeviceType({ deviceType }: { deviceType?: string }) {
  switch (deviceType && deviceType.toLowerCase()) {
    case "mobile":
      return <MobileOutlined />;
    default:
      return <DesktopOutlined />;
  }
}

function OperatingSystem({ operatingSystem }: { operatingSystem?: string }) {
  switch (operatingSystem && JSON.parse(operatingSystem).toLowerCase()) {
    case "windows":
      return <WindowsOutlined />;
    case "macos":
      return <AppleFilled />;
    case "android":
      return <AndroidOutlined />;
    default:
      return <QuestionOutlined />;
  }
}
