import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TablePaginationConfig } from "antd";
import ActivityModel from "../models/activity-model";
import { TableParams } from "../components/files/table-list";
import ApplicationsService from "../services/applications-service";

const DEFAULT_PER_PAGE = 10;

export default function useActivities() {
  const [activities, setActivities] = useState<ActivityModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: DEFAULT_PER_PAGE,
    },
  });
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [params] = useSearchParams();

  useEffect(() => {
    setTableParams({
      pagination: {
        current: 1,
        pageSize: DEFAULT_PER_PAGE,
      },
    });
    fetchItems({ current: 1, pageSize: DEFAULT_PER_PAGE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const onTableChange = ({ current, pageSize }: TablePaginationConfig) => {
    fetchItems({ current, pageSize });
  };

  const fetchItems = ({ current, pageSize }: TablePaginationConfig) => {
    if (!applicationId) {
      return;
    }

    setIsLoading(true);

    ApplicationsService.activityLogs(applicationId, {
      page: current,
      per: pageSize,
    })
      .then(({ records, pages }) => {
        setActivities(records);
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

  return {
    activities,
    isLoading,
    applicationId,
    setApplicationId,
    tableParams,
    onTableChange,
  };
}