import ApplicationModel from "../models/application-model";
import { ResponsePages, mapPagesToResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

type RequestApplicationParams = {
  name: string;
  description?: string;
};

export default class AdminApplicationsService {
  static async all({ page, per }: { page: number; per: number }): Promise<{
    pages: ResponsePages;
    records: ApplicationModel[];
  }> {
    const instance = await AuthenticatedApiService.default();
    const params = new URLSearchParams({
      page: page.toString(),
      per: per.toString(),
    });

    const {
      data: { records, pages },
    } = await instance.get(`admin/applications?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map((record: any) => new ApplicationModel(record)),
    };
  }

  static async create(params: RequestApplicationParams) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.post("admin/applications", {
      application: params,
    });

    return new ApplicationModel(data);
  }

  static async delete(applicationId: number) {
    const instance = await AuthenticatedApiService.default();

    return await instance.delete(`admin/applications/${applicationId}`);
  }

  static async toggleStatus(applicationId: number) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.put(
      `admin/applications/${applicationId}/toggle_status`,
    );

    return new ApplicationModel(data);
  }
}
