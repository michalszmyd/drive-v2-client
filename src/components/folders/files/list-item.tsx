import { Card, List, Tag } from "antd";
import DriveFileModel from "../../../models/drive-file-model";
import { ResolvePreview } from "../../files/resolve-preview";
import CardExtraActions from "../card-extra-actions";

export function ListItem({
  item,
  onClick,
  onDelete,
}: {
  item: DriveFileModel;
  onClick: (item: DriveFileModel, event : any) => void;
  onDelete: () => void;
}) {
  const title = <b>{item.pinned && <Tag color="yellow">Pinned</Tag>}{item.name}</b>

  return (
    <List.Item>
      <Card
        onClick={(e) => onClick(item, e)}
        cover={
          <ResolvePreview item={item} />
        }
        title={title}
        hoverable
        extra={
          <CardExtraActions
            editLinkTo={`/files/${item.id}/edit`}
            deleteOnClick={onDelete}
          />
        }
      >
        <span dangerouslySetInnerHTML={{__html: item.body || ''}} />
      </Card>
    </List.Item>
  );
}

