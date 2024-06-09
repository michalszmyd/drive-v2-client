import ObjectHelper from "../helpers/object-helper";
import ItemModel, { ItemModelInit } from "../models/item-model";
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
      records: records.map((record: ItemModelInit) => new ItemModel(record)),
    };
  }

  static async search({
    query,
    createdAtFrom,
    createdAtTo,
    isExcludeFolders,
    isIncludePrivateFolders,
    languages,
    filterUsersIds,
    page = 1,
    per = 10,
  }: {
    query: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    isExcludeFolders?: boolean;
    isIncludePrivateFolders?: boolean;
    languages?: string[];
    filterUsersIds?: number[];
    page?: number | undefined;
    per?: number | undefined;
  }): Promise<{ records: ItemModel[]; pages: ResponsePages }> {
    const instance = await AuthenticatedApiService.default();
    const requestPage = (page || 1).toString();
    const requestPer = (per || 1).toString();

    const filters = {
      created_at_from: createdAtFrom,
      created_at_to: createdAtTo,
      exclude_folders: isExcludeFolders,
      private_folders: isIncludePrivateFolders,
    };

    const paramLanguages = languages?.map((language) => `languages[]=${language}`).join("&");
    const userIds = filterUsersIds?.map((uid) => `user_ids[]=${uid}`).join("&");
    const queryFilters = ObjectHelper.rejectBlank(filters);

    const params = new URLSearchParams({
      page: requestPage,
      per: requestPer,
      ...queryFilters,
     });

    const {
      data: { pages, records },
    } = await instance.get(`search?q=${query}&${params.toString()}&${userIds}&${paramLanguages}`);

    const responsePages: ResponsePages = {
      totalPages: pages.total_pages,
      currentPage: pages.current_page,
      per: pages.per,
      total: pages.total,
    };

    return {
      pages: responsePages,
      records: records.map((record: ItemModelInit) => new ItemModel(record)),
    };
  }
}
