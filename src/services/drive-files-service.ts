import ObjectHelper from "../helpers/object-helper";
import DriveFileModel, { DriveFileModelInit } from "../models/drive-file-model";
import { mapPagesToResponsePages, ResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class DriveFilesService {
  static async find(id: number | string): Promise<DriveFileModel> {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.get(`files/${id}`);

    return new DriveFileModel(data);
  }

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
    } = await instance.get(`files/deleted?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map(
        (record: DriveFileModelInit) => new DriveFileModel(record),
      ),
    };
  }

  static async restore(id: number) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.put(`files/deleted/${id}/restore`);

    return new DriveFileModel(data);
  }

  static async create(form: FormData): Promise<DriveFileModel> {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.post("files", form);

    return new DriveFileModel(data);
  }

  static async share(fileId: number) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.post(`files/${fileId}/share`);

    return data;
  }

  static async update(
    file: DriveFileModel,
    {
      body,
      name,
      folderId,
      pinned,
    }: {
      body?: string | null | undefined;
      name?: string | null | undefined;
      pinned?: boolean;
      folderId?: number;
    },
  ): Promise<DriveFileModel> {
    const instance = await AuthenticatedApiService.default();

    const reducedParams = ObjectHelper.rejectBlank({
      body,
      name,
      pinned,
      folder_id: folderId,
    });

    const { data } = await instance.put(`files/${file.id}`, {
      drive_file: reducedParams,
    });

    return new DriveFileModel(data);
  }
  static async destroy(item: DriveFileModel) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.delete(`files/${item.id}`);

    return new DriveFileModel(data);
  }

  static async folderFiles(
    folderId: number | string,
    {
      page,
      per,
    }: {
      page: number;
      per: number;
    },
  ): Promise<{
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
    } = await instance.get(`folders/${folderId}/files?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map(
        (record: DriveFileModelInit) => new DriveFileModel(record),
      ),
    };
  }
}
