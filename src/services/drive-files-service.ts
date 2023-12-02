import DriveFileModel from "../models/drive-file-model";
import { mapPagesToResponsePages, ResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class DriveFilesService {
  static async find(id : number | string) : Promise<DriveFileModel> {
    const instance = await AuthenticatedApiService.default();

    const {data} = await instance.get(`files/${id}`);

    return new DriveFileModel(data);
  }

  static async create(form: FormData) {
    const instance = await AuthenticatedApiService.default();

    return instance.post('files', form);
  }

  static async folderFiles(
    folderId : number | string,
    {
      page,
      per,
    }: {
      page: number;
      per: number;
    }
  ): Promise<{
    pages: ResponsePages,
    records: any,
  }> {
    const instance = await AuthenticatedApiService.default();
    const params = new URLSearchParams({page: page.toString(), per: per.toString()});

    const {
      data: {
        records,
        pages,
      }
    } = await instance.get(`folders/${folderId}/files?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map((record: any) => new DriveFileModel(record)),
    }
  }
}
