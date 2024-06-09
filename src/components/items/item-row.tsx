import { Tag } from "antd";
import ItemModel from "../../models/item-model";
import UserModel from "../../models/user-model";
import { Link } from "react-router-dom";
import CardExtraActions from "../folders/card-extra-actions";
import { ItemPreview } from "../files/item-preview";
import { colors, fileExtensionsColors } from "../../consts/colors";
import { css } from "@emotion/css";

export function ItemRow({
  item,
  currentUser,
}: {
  item: ItemModel;
  currentUser: UserModel | null;
}) {
  if (item.recordType === "folder") {
    return {
      key: item.id,
      type: <ItemLabel item={item} />,
      preview: <ItemPreview item={item} />,
      userName: item.user.name,
      name: (
        <Link className={styles.folderLink} to={`/folders/${item.id}`}>
          {item.name}
        </Link>
      ),
      folderName: (
        <Link to={`/folders/${item.folderId}`}>{item.folder.name}</Link>
      ),
      folder: <b>{item.folderId}</b>,
      pinned: <></>,
    };
  }

  return {
    key: item.id,
    type: <ItemLabel item={item} />,
    preview: <ItemPreview item={item} />,
    name: <Link to={`/files/${item.id}`}>{item.name}</Link>,
    userName: item.user.name,
    folderName: item.folderId && (
      <Tag color={colors.secondary}>
        <Link className={styles.folderLink} to={`/folders/${item.folderId}`}>
          {item.folder.name}
        </Link>
      </Tag>
    ),
    pinned: item.pinned && <Tag color="yellow">Pinned</Tag>,
    actions: (
      <CardExtraActions
        manageActionsEnabled={currentUser?.id === item.userId}
        sourceUrl={item.sourceUrl}
        editLinkTo={`/files/${item.id}/edit`}
      />
    ),
  };
}

function ItemLabel({ item }: { item: ItemModel }) {
  if (item.recordType === "folder") {
    return <Tag>folder</Tag>;
  }

  if (item.fileType) {
    return (
      <Tag color={fileExtensionsColors[item.fileType] || "#A4F5C5"}>
        {item.fileType}
      </Tag>
    );
  }

  return <Tag color="#88878A">file</Tag>;
}

const styles = {
  table: css(`
    img, .ant-image-mask, video {
      max-height: 100px;
      max-width: 100px;
      border-radius: 10px;
      .ant-image-mask {
        border-radius: 10px;
      }
    }
  `),
  folderLink: css({
    fontWeight: 600,
  }),
};
