import { CodepenOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Image, Popover } from "antd";
import DriveFileModel from "../../models/drive-file-model";

export function ResolvePreview({item}: {item: DriveFileModel}) {
  if (!item.sourceUrl) {
    return null;
  }

  if (item.isVideo) {
    return <video onClick={() => {}} controls className={`item-video ${styles.videoPreview}`} src={item.sourceUrl} />
  }

  if (item.isImage) {
    return <Image src={item.sourceUrl} />
  }

  return (
    <div className={styles.noPreview}>
      <Popover title="No preview available">
        <CodepenOutlined className={styles.icon} />
      </Popover>
    </div>
  )
}

const styles = {
  videoPreview: css({
    maxHeight: '300px',
    width: 'auto',
    maxWidth: '100%',
  }),
  noPreview: css({
    padding: 12,
    display: 'flex !important',
    flex: 1,
    alignSelf: 'center',
    justifySelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  icon: css({
    fontSize: 48,
  })
}
