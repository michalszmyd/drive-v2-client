import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import { Button, Divider, Image, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import FoldersService from "../services/folders-service";
import FolderModel from "../models/folder-model";
import { Link } from "react-router-dom";
import { css } from "@emotion/css";
import ItemsService from "../services/items-service";
import ItemModel from "../models/item-model";
import TableItemsList from "../components/files/table-list";
import { ItemRow } from "../components/activities/item-row";
import CurrentUserContext from "../contexts/current-user-context";
import { Folders } from "../components/folders/folders";
import useFolders from "../hooks/folders";
import { tableHeader } from "../components/activities/table-header";

export default function DashboardPage() {
  const [favoriteFolders, setFavoriteFolders, toggleFavorites] = useFolders([]);
  const [items, setItems] = useState<ItemModel[]>([]);
  const [itemsLoading, setItemsLoading] = useState<boolean>(true);

  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    FoldersService.favorites({ page: 1, per: 30 }).then(
      ({ records }: { records: FolderModel[] }) => {
        setFavoriteFolders(records);
      },
    );

    ItemsService.all({ page: 1, per: 10 })
      .then(({ records }) => {
        setItems(records);
      })
      .finally(() => {
        setItemsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthenticatedRoute>
      <MainAppWrapper
        isLoading={itemsLoading}
        title="Drive"
        breadcrumbs={["Dashboard"]}
      >
        <Divider orientation="left">Your favorite folders</Divider>
        <Folders folders={favoriteFolders} onFavoriteClick={toggleFavorites} />
        <Divider orientation="left">Recent files</Divider>
        <Row justify="end">
          <Link to="/activities">
            <Button shape="round" className={styles.viewAllButton}>
              View all
            </Button>
          </Link>
        </Row>
        <Image.PreviewGroup>
          <TableItemsList
            columns={tableHeader}
            isLoading={false}
            dataSource={items.map((item) => ItemRow({ item, currentUser }))}
          />
        </Image.PreviewGroup>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}

const styles = {
  viewAllButton: css({
    backgroundColor: "transparent",
    marginBottom: 14,
  }),
};
