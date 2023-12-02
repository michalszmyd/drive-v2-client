import { Badge, Card, List } from "antd";
import DriveFileModel from "../../../models/drive-file-model";
import { ResolvePreview } from "../../files/resolve-preview";

export function ListItem({item, onClick}: {item: DriveFileModel, onClick: (item: DriveFileModel, event : any) => void}) {
  return (
    <List.Item>
      {item.pinned ? (
        <Badge.Ribbon text="Pinned" color="cyan">
          <Card
            onClick={(e) => onClick(item, e)}
            cover={
              <ResolvePreview item={item} />
            }
            title={<b>{item.name}</b>}
            hoverable
          >
            <span dangerouslySetInnerHTML={{__html: item.body || ''}} />
          </Card>
        </Badge.Ribbon>
      ) : (
        <Card
          onClick={(e) => onClick(item, e)}
          cover={
            <ResolvePreview item={item} />
          }
          title={<b>{item.name}</b>}
          hoverable
        >
          <span dangerouslySetInnerHTML={{__html: item.body || ''}} />
        </Card>
      )}
    </List.Item>
  )
}

