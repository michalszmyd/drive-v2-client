import { CopyOutlined, DeleteOutlined, DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { colors } from "../../consts/colors";
import { css } from "@emotion/css";

export default function CardExtraActions({
  editLinkTo,
  editTitle = "Edit",
  manageActionsEnabled = false,
  deleteOnClick,
  deleteTitle = "Delete",
}: {
  editLinkTo: string;
  editTitle?: string;
  manageActionsEnabled?: boolean;
  deleteOnClick: () => void;
  deleteTitle?: string;
}) {
  return (
    <Space>
      <Tooltip title="Download">
        <Button disabled shape="circle" type="link">
          <DownloadOutlined />
        </Button>
      </Tooltip>
      <Tooltip title="Embed">
        <Button disabled shape="circle" type="link">
          <CopyOutlined />
        </Button>
      </Tooltip>
      <Link to={editLinkTo}>
        <Tooltip title={editTitle}>
          <Button disabled={!manageActionsEnabled} shape="circle" type="link">
            <EditOutlined />
          </Button>
        </Tooltip>
      </Link>
      <Tooltip title={deleteTitle}>
        <Button
          disabled={!manageActionsEnabled}
          onClick={deleteOnClick}
          shape="circle"
          type="link"
          icon={<DeleteOutlined className={styles.deleteIcon} />}
        />
      </Tooltip>
    </Space>
  )
}

const styles = {
  deleteIcon: css({
    color: colors.redDelete,
  })
}
