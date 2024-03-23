import { useEffect, useState } from "react";
import ItemModel from "../models/item-model";
import ItemsService from "../services/items-service";
import { TableParams } from "../components/files/table-list";
import { useSearchParams } from "react-router-dom";
import { TablePaginationConfig } from "antd";

const DEFAULT_PER_PAGE = 10;

export default function useItems() {
  const [items, setItems] = useState<ItemModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: DEFAULT_PER_PAGE,
    },
  });
  const [params] = useSearchParams();

  const searchQuery = params.get("q");

  const onTableChange = ({ current, pageSize }: TablePaginationConfig) => {
    fetchItems({ current, pageSize });
  };

  const fetchItems = ({ current, pageSize }: TablePaginationConfig) => {
    setIsLoading(true);

    const querySearch = params.get("q");

    const promise = querySearch
      ? ItemsService.search({
          page: current,
          per: pageSize,
          query: searchQuery || "",
        })
      : ItemsService.all({ page: current, per: pageSize });

    promise
      .then(({ records, pages }) => {
        setItems(records);
        setTableParams({
          pagination: {
            current: pages.currentPage,
            pageSize: pages.per,
            total: pages.total,
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchItems({ current: 1, pageSize: DEFAULT_PER_PAGE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return { items, isLoading, tableParams, onTableChange };
}
