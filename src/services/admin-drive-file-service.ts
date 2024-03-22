import ObjectHelper from "../helpers/object-helper";
import DriveFileModel from "../models/drive-file-model";
import { mapPagesToResponsePages, ResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class AdminDriveFilesService {
  static async deleted({ page, per }: { page: number; per: number }): Promise<{
    pages: ResponsePages;
    records: DriveFileModel[];
  }> {
    const instance = await AuthenticatedApiService.default();
    const params = new URLSearchParams({
      page: page.toString(),
      per: per.toString(),
    });

    const {
      data: { records, pages },
    } = await instance.get(`admin/files/deleted?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map((record: any) => new DriveFileModel(record)),
    };
  }

  static async erase(id: number) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.delete(`admin/files/deleted/${id}/erase`);

    return data;
  }

  static async eraseAll() {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.delete(`admin/files/deleted/erase`);

    return data;
  }

  static async restore(id: number) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.put(`admin/files/deleted/${id}/restore`);

    return new DriveFileModel(data);
  }
}
