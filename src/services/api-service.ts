import RequestInstance from "./api/request-instance";

const API_PREFIX = "api/v1/";

export interface ResponsePages {
  currentPage: number;
  totalPages: number;
  per: number;
}

export default class ApiService {
  static async default({headers = {}}: {headers?: object} = {}): Promise<RequestInstance> {
    const baseUrl = `http://localhost:3000/${API_PREFIX}`;

    return new RequestInstance({
      baseUrl,
      headers,
    });
  }
}
