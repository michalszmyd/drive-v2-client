import { CopyOutlined, DeleteOutlined, DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { colors } from "../../consts/colors";
import { css } from "@emotion/css";
import { toast } from "react-toastify";
import StringHelper from "../../helpers/string-helper";

export default function CardExtraActions({
  editLinkTo,
  editTitle = "Edit",
  sourceUrl,
  manageActionsEnabled = false,
  downloadOnClick,
  deleteOnClick,
  deleteTitle = "Delete",
}: {
  editLinkTo: string;
  editTitle?: string;
  sourceUrl?: string | null;
  manageActionsEnabled?: boolean;
  downloadOnClick?: () => void;
  deleteOnClick?: () => void;
  deleteTitle?: string;
}) {
  const copyToClipboard = () => {
    if (sourceUrl && StringHelper.isPresent(sourceUrl)) {
      navigator.clipboard.writeText(sourceUrl);

      toast.success("Copied to clipboard!")
    }
  }

  return (
    <Space>
      {downloadOnClick && (
        <Tooltip title="Download">
          <Button onClick={downloadOnClick} shape="circle" type="link">
            <DownloadOutlined />
          </Button>
        </Tooltip>
      )}
      {StringHelper.isPresent(sourceUrl) && (
        <Tooltip title="Embed">
          <Button onClick={copyToClipboard} shape="circle" type="link">
            <CopyOutlined />
          </Button>
        </Tooltip>
      )}
      {manageActionsEnabled && <Link to={editLinkTo}>
        <Tooltip title={editTitle}>
          <Button shape="circle" type="link">
            <EditOutlined />
          </Button>
        </Tooltip>
      </Link>}
      {deleteOnClick && manageActionsEnabled && <Tooltip title={deleteTitle}>
        <Button
          disabled={!manageActionsEnabled}
          onClick={deleteOnClick}
          shape="circle"
          type="link"
          icon={<DeleteOutlined className={styles.deleteIcon} />}
        />
      </Tooltip>}
    </Space>
  )
}

const styles = {
  deleteIcon: css({
    color: colors.redDelete,
  })
}
