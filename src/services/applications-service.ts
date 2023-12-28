import ApplicationModel from "../models/application-model";
import { mapPagesToResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

type RequestApplicationParams = {
  name: string;
  description?: string;
}

export default class ApplicationsService {
  static async all() {
    const instance = await AuthenticatedApiService.default();

    const {
      data: {
        records,
        pages,
      }
    } = await instance.get('applications');

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map((record: any) => new ApplicationModel(record)),
    }
  }

  static async create(params: RequestApplicationParams) {
    const instance = await AuthenticatedApiService.default();

    const {data} = await instance.post('applications', {application: params});

    return new ApplicationModel(data);
  }

  static async delete(applicationId: number) {
    const instance = await AuthenticatedApiService.default();

    return await instance.delete(`applications/${applicationId}`);
  }

  static async toggleStatus(applicationId: number) {
    const instance = await AuthenticatedApiService.default();

    const {data} = await instance.put(`applications/${applicationId}/toggle_status`);

    return new ApplicationModel(data);
  }

  static async regeneratePrivateApiKey(applicationId: number) {
    const instance = await AuthenticatedApiService.default();

    const {data} = await instance.put(`applications/${applicationId}/regenerate_private_api_key`);

    return new ApplicationModel(data);
  }
}
