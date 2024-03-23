import { Col, Image, Row } from "antd";
import { useContext } from "react";
import AuthenticatedRoute from "../components/authenticated/authenticated-route";
import MainAppWrapper from "../components/main-app-wrapper";
import CurrentUserContext from "../contexts/current-user-context";
import TableItemsList from "../components/files/table-list";
import { ItemRow } from "../components/items/item-row";
import { tableHeader } from "../components/items/table-header";
import useItems from "../hooks/items-hook";

export default function ItemsPage() {
  const { items, isLoading, tableParams, onTableChange } = useItems();

  const { currentUser } = useContext(CurrentUserContext);

  return (
    <AuthenticatedRoute>
      <MainAppWrapper title="Recent Files" breadcrumbs={["Dashboard"]}>
        <Row gutter={16}>
          <Col span={24}>
            <Image.PreviewGroup>
              <TableItemsList
                columns={tableHeader}
                isLoading={isLoading}
                onChange={onTableChange}
                pagination={tableParams.pagination}
                dataSource={items.map((item) => ItemRow({ item, currentUser }))}
              />
            </Image.PreviewGroup>
          </Col>
        </Row>
      </MainAppWrapper>
    </AuthenticatedRoute>
  );
}
