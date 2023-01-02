import { Card, List } from "antd";
import DriveFileModel from "../../../models/drive-file-model";
import { ResolvePreview } from "../../files/resolve-preview";

export function ListItem({item, onClick}: {item: DriveFileModel, onClick: (item: DriveFileModel, event : any) => void}) {
  return (
    <List.Item>
      <Card
        onClick={(e) => onClick(item, e)}
        // bodyStyle={{ justifyContent: 'center', flex: 1,display: 'flex', alignItems: 'center'}}
        cover={
          <ResolvePreview item={item} />
        }
        title={<b>{item.name}</b>}
        hoverable
      >
        <span dangerouslySetInnerHTML={{__html: item.body || ''}} />
      </Card>
    </List.Item>
  )
}

