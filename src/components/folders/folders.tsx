import { Badge, Button, Col, Row } from "antd";
import FolderModel from "../../models/folder-model";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { colors } from "../../consts/colors";
import { css } from "@emotion/css";

export function Folders({
  folders,
  onFavoriteClick,
}: {
  folders: FolderModel[];
  onFavoriteClick?: (item: FolderModel) => void;
}) {
  return (
    <Row gutter={[24, 24]} align="middle" justify="start">
      {folders.map((folder) => (
        <Col className={styles.col} xxl={4} xl={6} md={8} sm={12} xs={24}>
          <Folder onFavoriteClick={onFavoriteClick} folder={folder} />
        </Col>
      ))}
    </Row>
  );
}

export function Folder({
  folder,
  onFavoriteClick,
}: {
  folder: FolderModel;
  onFavoriteClick?: (item: FolderModel) => void;
}) {
  const onFavClick = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (onFavoriteClick) onFavoriteClick(folder);
  };

  const content = (
    <Link to={`/folders/${folder.id}`}>
      <div className={styles.favoriteFolder}>
        <Button
          shape="circle"
          type="link"
          onClick={onFavClick}
          className={styles.favoriteStar}
        >
          {folder.favorite ? <StarFilled /> : <StarOutlined />}
        </Button>
        <div className={styles.folderRow}>
          <div className={styles.folderLabel}>Items count</div>
          <div className={styles.folderRowDescription}>
            {folder.driveFilesCount}
          </div>
          <div className={styles.folderLabel}>Created at</div>
          <div className={styles.folderRowDescription}>{folder.createdAt}</div>
        </div>
        <div className={styles.folderRow}>
          <div className={styles.folderLabel}>Folder</div>
          <span className={styles.folderRowDescription}>{folder.name}</span>
        </div>
      </div>
    </Link>
  );

  return folder.folderPrivate ? (
    <Badge.Ribbon
      className={styles.ribbon}
      color={colors.warning}
      text="Private"
    >
      {content}
    </Badge.Ribbon>
  ) : (
    content
  );
}

const styles = {
  ribbon: css(`
    bottom: 10%;
    top: auto;
  `),
  folderText: css({
    textAlign: "center",
  }),
  col: css({
    textAlign: "center",
  }),
  folderIcon: css({
    fontSize: 64,
    fontWeight: 200,
    padding: 24,
  }),
  star: css({
    color: colors.main,
    fontSize: 16,
  }),
  starButton: css({
    position: "absolute",
    zIndex: 1,
    top: 0,
    right: 0,
  }),
  favoriteFolder: css(`
    width: auto;
    min-height: 200px;
    margin: 0 auto;
    margin-top: 50px;
    position: relative;
    background-color: ${colors.white};
    border-radius: 0 6px 6px 6px;
    cursor: pointer;
    padding: 20px;

    flex-direction: column;
    align-items: flex-start;

    transition-duration: 0.3s;

    -webkit-box-shadow: 0px 0px 10px -5px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 10px -5px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 10px -5px rgba(0,0,0,0.75);

    justify-content: space-between;
    display: flex;

    color: #0c0c0c;

    &:hover {
      background-color: ${colors.main};
      color: ${colors.white};

      .ant-btn {
        color: ${colors.white};
        &:hover {
          color: ${colors.secondary};
        }
      }
    }

    &:hover:before {
      background-color: ${colors.main}
    }

    &:before {
      -webkit-box-shadow: 0px -18px 37px -8px rgba(0,0,0,0.75);
      -moz-box-shadow: 0px -18px 37px -8px rgba(0,0,0,0.75);
      box-shadow: 0px -18px 37px -8px rgba(0,0,0,0.75);

      transition-duration: 0.3s;
      content: '';
      width: 50%;
      height: 12px;
      border-radius: 40px 100px 0 0;
      background-color: ${colors.white};
      position: absolute;
      top: -12px;
      left: 0px;
    }
`),
  folderLabel: css({
    color: "#a6abe3",
    textTransform: "uppercase",
    fontSize: 11,
  }),
  folderRow: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  }),
  folderRowDescription: css(`
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  `),
  favoriteStar: css(`
    position: absolute;
    right: 5%;
    top: 5%;
    color: ${colors.secondary};
  `),
};
