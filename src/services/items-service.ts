import ItemModel from "../models/item-model";
import { ResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class ItemsService {
  static async all({page = 1, per = 10}: {page?: number | undefined; per?: number | undefined}): Promise<{records: ItemModel[], pages: ResponsePages}> {
    const instance = await AuthenticatedApiService.default();
    const requestPage = (page || 1).toString();
    const requestPer = (per || 1).toString();

    const params = new URLSearchParams({page: requestPage, per: requestPer});

    const {data: { pages, records }} = await instance.get(`items?${params.toString()}`);

    const responsePages: ResponsePages = {
      totalPages: pages.total_pages,
      currentPage: pages.current_page,
      per: pages.per,
    }

    return {
      pages: responsePages,
      records: records.map((record: any) => new ItemModel(record))
    }
  }
}
