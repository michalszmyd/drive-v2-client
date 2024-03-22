import { Button, Card, Tag } from "antd";
import DriveFileModel from "../../../models/drive-file-model";
import { ResolvePreview } from "../../files/resolve-preview";
import CardExtraActions from "../card-extra-actions";
import { css } from "@emotion/css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { colors } from "../../../consts/colors";
import CurrentUserContext from "../../../contexts/current-user-context";

const MAX_HEIGHT_CARD = 600;

export function ListItem({
  item,
  onClick,
  onDelete,
}: {
  item: DriveFileModel;
  onClick: (item: DriveFileModel, event: React.SyntheticEvent) => void;
  onDelete: () => void;
}) {
  const cardItemRef = useRef<HTMLDivElement>(null);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const { currentUser } = useContext(CurrentUserContext);
  const onCardClick = (e: React.MouseEvent) => {
    const { target } = e;

    if (target instanceof HTMLElement) {
      const classList = target.classList;

      if (classList[0] === "item-video") {
        return;
      }
    }

    onClick(item, e);
  };

  useEffect(() => {
    setLoadMore((cardItemRef?.current?.clientHeight || 0) >= MAX_HEIGHT_CARD);
  }, [cardItemRef]);

  const title = (
    <b>
      {item.pinned && <Tag color="yellow">Pinned</Tag>}
      {item.name}
    </b>
  );

  return (
    <Card
      className={styles.card}
      ref={cardItemRef}
      onClick={onCardClick}
      cover={<ResolvePreview item={item} />}
      title={title}
      hoverable
      extra={
        <CardExtraActions
          sourceUrl={item.sourceUrl}
          editLinkTo={`/files/${item.id}/edit`}
          manageActionsEnabled={item.userId === currentUser?.id}
          deleteOnClick={onDelete}
        />
      }
    >
      <span dangerouslySetInnerHTML={{ __html: item.body || "" }} />
      {loadMore && (
        <div className={styles.loadMore}>
          <Button type="link" className={styles.loadMoreButton}>
            Load more
          </Button>
        </div>
      )}
    </Card>
  );
}

const styles = {
  card: css({
    minHeight: 300,
    maxHeight: `${MAX_HEIGHT_CARD}px`,
    overflow: "hidden",
  }),
  loadMore: css({
    backgroundImage: "linear-gradient(transparent, white)",
    position: "absolute",
    bottom: 0,
    textAlign: "center",
    width: "100%",
    left: 0,
    zIndex: 1,
    padding: "24px 0",
  }),
  loadMoreButton: css({
    padding: "20px 0",
    cursor: "pointer",
    textShadow: `1px 1px 2px ${colors.gray}`,
  }),
};
