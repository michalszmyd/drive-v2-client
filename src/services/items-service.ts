import ItemModel from "../models/item-model";
import { ResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class ItemsService {
  static async all({
    page = 1,
    per = 10,
  }: {
    page?: number | undefined;
    per?: number | undefined;
  }): Promise<{ records: ItemModel[]; pages: ResponsePages }> {
    const instance = await AuthenticatedApiService.default();
    const requestPage = (page || 1).toString();
    const requestPer = (per || 1).toString();

    const params = new URLSearchParams({ page: requestPage, per: requestPer });

    const {
      data: { pages, records },
    } = await instance.get(`items?${params.toString()}`);

    const responsePages: ResponsePages = {
      totalPages: pages.total_pages,
      currentPage: pages.current_page,
      per: pages.per,
      total: pages.total,
    };

    return {
      pages: responsePages,
      records: records.map((record: any) => new ItemModel(record)),
    };
  }

  static async search({
    query,
    page = 1,
    per = 10,
  }: {
    query: string;
    page?: number | undefined;
    per?: number | undefined;
  }): Promise<{ records: ItemModel[]; pages: ResponsePages }> {
    const instance = await AuthenticatedApiService.default();
    const requestPage = (page || 1).toString();
    const requestPer = (per || 1).toString();

    const params = new URLSearchParams({ page: requestPage, per: requestPer });

    const {
      data: { pages, records },
    } = await instance.get(`items/search?q=${query}&${params.toString()}`);

    const responsePages: ResponsePages = {
      totalPages: pages.total_pages,
      currentPage: pages.current_page,
      per: pages.per,
      total: pages.total,
    };

    return {
      pages: responsePages,
      records: records.map((record: any) => new ItemModel(record)),
    };
  }
}
