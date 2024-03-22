import SETTINGS from "../consts/settings";
import ApplicationModel, {
  ApplicationModelInit,
} from "../models/application-model";
import { ResponsePages, mapPagesToResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

type RequestApplicationParams = {
  name: string;
  description?: string;
};

export default class ApplicationsService {
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
    } = await instance.get(`applications?${params.toString()}`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map(
        (record: ApplicationModelInit) => new ApplicationModel(record),
      ),
    };
  }

  static async docs() {
    const instance = await AuthenticatedApiService.default();
    const { data } = await instance.get(`applications/docs`);

    data.host = SETTINGS.API_ORIGIN;

    return data;
  }

  static async create(params: RequestApplicationParams) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.post("applications", {
      application: params,
    });

    return new ApplicationModel(data);
  }

  static async delete(applicationId: number) {
    const instance = await AuthenticatedApiService.default();

    return await instance.delete(`applications/${applicationId}`);
  }

  static async toggleStatus(applicationId: number) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.put(
      `applications/${applicationId}/toggle_status`,
    );

    return new ApplicationModel(data);
  }

  static async regeneratePrivateApiKey(applicationId: number) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.put(
      `applications/${applicationId}/regenerate_private_api_key`,
    );

    return new ApplicationModel(data);
  }
}
