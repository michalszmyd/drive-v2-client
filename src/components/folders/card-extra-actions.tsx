import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { colors } from "../../consts/colors";
import { css } from "@emotion/css";
import { toast } from "react-toastify";
import DriveFilesService from "../../services/drive-files-service";
import SETTINGS from "../../consts/settings";

export default function CardExtraActions({
  fileId,
  editLinkTo,
  editTitle = "Edit",
  manageActionsEnabled = false,
  downloadOnClick,
  deleteOnClick,
  deleteTitle = "Delete",
}: {
  fileId?: number | null;
  editLinkTo: string;
  editTitle?: string;
  manageActionsEnabled?: boolean;
  downloadOnClick?: () => void;
  deleteOnClick?: () => void;
  deleteTitle?: string;
}) {
  const copyToClipboard = () => {
    if (fileId) {
      DriveFilesService.share(fileId).then((data) => {
        const url =
          SETTINGS.API_ORIGIN +
          "/files/embed?" +
          new URLSearchParams(data).toString();

        navigator.clipboard.writeText(url);

        toast.success("Copied to clipboard!");
      });
    }
  };

  return (
    <Space>
      {downloadOnClick && (
        <Tooltip title="Download">
          <Button onClick={downloadOnClick} shape="circle" type="link">
            <DownloadOutlined />
          </Button>
        </Tooltip>
      )}
      <Tooltip title="Embed">
        <Button onClick={copyToClipboard} shape="circle" type="link">
          <CopyOutlined />
        </Button>
      </Tooltip>
      {manageActionsEnabled && (
        <Link to={editLinkTo}>
          <Tooltip title={editTitle}>
            <Button shape="circle" type="link">
              <EditOutlined />
            </Button>
          </Tooltip>
        </Link>
      )}
      {deleteOnClick && manageActionsEnabled && (
        <Tooltip title={deleteTitle}>
          <Button
            disabled={!manageActionsEnabled}
            onClick={deleteOnClick}
            shape="circle"
            type="link"
            icon={<DeleteOutlined className={styles.deleteIcon} />}
          />
        </Tooltip>
      )}
    </Space>
  );
}

const styles = {
  deleteIcon: css({
    color: colors.redDelete,
  }),
};
