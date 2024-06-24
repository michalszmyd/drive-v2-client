import Column from "antd/es/table/Column";
import TableItemsList from "../files/table-list";
import { Button, Space, Tooltip } from "antd";
import UserSessionModel from "../../models/user-session-model";
import {
  AndroidOutlined,
  AppleFilled,
  DeleteOutlined,
  DesktopOutlined,
  MobileOutlined,
  QuestionOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

export default function UserSessionsTable({
  userSessions,
  onDeleteSession,
}: {
  userSessions: UserSessionModel[];
  onDeleteSession: (record: UserSessionModel) => void;
}) {
  const tableDataSource = userSessions.map(sessionToTableItem);

  return (
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
  );
}

const sessionToTableItem = (userSession: UserSessionModel) => {
  const {
    id,
    userId,
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
    userId,
    createdAt,
    updatedAt,
    lastUsedAt,
    clientIp,
    operatingSystem,
    userAgent,
    deviceType,
  };
};

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
