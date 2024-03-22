import { Image } from "antd";
import DriveFileModel from "../../models/drive-file-model";
import ItemModel from "../../models/item-model";

export function ItemPreview({ item }: { item: ItemModel | DriveFileModel }) {
  if (!item.sourceUrl) {
    return null;
  }

  if (item.isImage) {
    return <Image src={item.sourceUrl} />;
  }
  if (item.isVideo) {
    return <video src={item.sourceUrl} controls controlsList="play" />;
  }

  return null;
}
