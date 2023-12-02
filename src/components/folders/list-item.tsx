import { Badge, Card, List } from "antd";
import { colors } from "../../consts/colors";
import FolderModel from "../../models/folder-model";

export function ListItem({item, onItemClick}: {item: FolderModel, onItemClick: (item: FolderModel) => void}) {
  return (
    <List.Item onClick={() => onItemClick(item)}>
      {item.folderPrivate ? (
        <Badge.Ribbon  placement="end" color="magenta" text="Private">
          <ElementCard item={item} />
        </Badge.Ribbon>
      ) : <ElementCard item={item} />}
    </List.Item>
  );
}

function ElementCard({item} : {item: FolderModel}) {
  return (
    <Card
      title={
        item.folderPrivate ? <b style={{color: colors.secondary}}>{item.name}</b> : item.name
      } hoverable>
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
  )
}
