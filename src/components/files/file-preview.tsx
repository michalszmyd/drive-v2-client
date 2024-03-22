import {
  CloseOutlined,
  CodepenOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import DriveFileModelForm from "../../models/forms/drive-file-model-form";
import { Button, Image } from "antd";
import { css } from "@emotion/css";
import { colors } from "../../consts/colors";

export default function FilePreview({
  onRemove,
  fileForm,
  previewSource,
  fileType,
}: {
  onRemove: (fileForm: DriveFileModelForm) => void;
  fileForm: DriveFileModelForm;
  previewSource: string;
  fileType: string;
}) {
  const onRemoveFile = () => onRemove(fileForm);

  return (
    <div>
      <Button
        size="small"
        icon={<CloseOutlined className={styles.closeIcon} />}
        onClick={onRemoveFile}
        shape="circle"
        className={styles.removeButton}
      />
      <LoadPreview previewSource={previewSource} fileType={fileType} />
    </div>
  );
}

function LoadPreview({
  previewSource,
  fileType,
}: {
  previewSource: string;
  fileType: string;
}) {
  switch (fileType) {
    case "video/mp4":
      return <VideoCameraOutlined className={styles.previewIcon} />;
    case "image/png":
    case "image/jpeg":
      return (
        <Image style={{ maxHeight: 140, maxWidth: 140 }} src={previewSource} />
      );
    default:
      return <CodepenOutlined className={styles.previewIcon} />;
  }
}

const styles = {
  previewIcon: css({
    fontSize: "128px",
  }),
  closeIcon: css({
    fontSize: "10px",
  }),
  removeButton: css({
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    left: "5px",
    top: "5px",
    position: "absolute",
    zIndex: 1,
    color: colors.redDelete,
  }),
};
