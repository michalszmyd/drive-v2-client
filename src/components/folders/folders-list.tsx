import { List } from "antd";
import FolderModel from "../../models/folder-model";
import { ListItem } from "./list-item";

export default function FoldersList({
  folders,
  onItemClick,
}: {
  folders: FolderModel[];
  onItemClick: (item: FolderModel) => void;
}) {
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 4,
      }}
      dataSource={folders}
      rowKey='id'
      renderItem={(item) => (
        <ListItem onItemClick={onItemClick} item={item} />
      )}
    />
  )
}
