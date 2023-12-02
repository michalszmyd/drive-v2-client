import FolderModel from "../models/folder-model";
import { mapPagesToResponsePages, ResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class FoldersService {
  static async all({
    page,
    per,
  }: {
    page: number;
    per: number;
  }): Promise<{
    pages: ResponsePages,
    records: FolderModel[],
  }> {
    const instance = await AuthenticatedApiService.default();
    const params = new URLSearchParams({page: page.toString(), per: per.toString()});

    const {
      data: {
        records,
        pages,
      }
    } = await instance.get(`folders?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map((record: any) => new FolderModel(record)),
    }
  }

  static async me({
    page,
    per,
  }: {
    page: number;
    per: number;
  }): Promise<{
    pages: ResponsePages,
    records: FolderModel[],
  }> {
    const instance = await AuthenticatedApiService.default();
    const params = new URLSearchParams({page: page.toString(), per: per.toString()});

    const {
      data: {
        records,
        pages,
      }
    } = await instance.get(`me/folders?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map((record: any) => new FolderModel(record)),
    }
  }

  static async createDriveFile(folderId: string | number, form: FormData) {
    const instance = await AuthenticatedApiService.default();

    return instance.post(`folders/${folderId}/files`, form);
  }

  static async find(id: number | string) {
    const instance = await AuthenticatedApiService.default();

    const {data} = await instance.get(`folders/${id}`);

    return new FolderModel(data);
  }

  static async create({
    folderPrivate,
    name,
  }: {
    folderPrivate: boolean;
    name: string;
  }): Promise<FolderModel> {
    const instance = await AuthenticatedApiService.default();

    const {data} = await instance.post('folders', {
      folder: {
        folder_private: folderPrivate,
        name
      }
    });

    return new FolderModel(data);
  }
}
