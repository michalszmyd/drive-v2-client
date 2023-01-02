import { DownloadOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Button, Card, List, Popover, Space } from "antd";
import { colors } from "../../consts/colors";
import FolderModel from "../../models/folder-model";

export function ListItem({item, onItemClick}: {item: FolderModel, onItemClick: (item: FolderModel) => void}) {
  return (
    <List.Item onClick={() => onItemClick(item)}>
      <Card title={
        item.folderPrivate ? <b style={{color: colors.secondary}}>{item.name}</b> : item.name
      } hoverable extra={
        <Space>
          <Popover title="Download" trigger="hover">
            <Button disabled>
              <DownloadOutlined />
            </Button>
          </Popover>
          {item.folderPrivate ? (
            <Popover title="Private" trigger="hover">
              <LockOutlined />
            </Popover>
          ) : (
            <Popover title="Public" trigger="hover">
              <UnlockOutlined />
            </Popover>
          )}
        </Space>
      }>
        <p>
          Files: <b>{item.driveFilesCount}</b>
        </p>
        <p>
          Last updated at: <b>{item.updatedAt}</b>
        </p>
        <p>
          Created at: <b>{item.createdAt}</b>
        </p>
        <p>
          Creator: <b>{item.userName}</b>
        </p>
      </Card>
    </List.Item>
  );
}
