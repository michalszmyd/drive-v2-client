import ActivityModel, { ActivityModelInit } from "../models/activity-model";
import { mapPagesToResponsePages, ResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class AdminDashboardService {
  static async activityLogs({ page = 1, per = 10 }: { page?: number; per?: number }): Promise<{
    pages: ResponsePages;
    records: ActivityModel[];
  }> {
    const instance = await AuthenticatedApiService.default();
    const params = new URLSearchParams({
      page: page.toString(),
      per: per.toString(),
    });

    const {
      data: { records, pages },
    } = await instance.get(`admin/activities?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map(
        (record: ActivityModelInit) => new ActivityModel(record),
      ),
    };
  }
}