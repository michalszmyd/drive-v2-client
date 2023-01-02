import RequestInstance from "./api/request-instance";

const API_PREFIX = "api/v1/";

export interface ResponsePages {
  currentPage: number;
  totalPages: number;
  per: number;
}

export function mapPagesToResponsePages({
  current_page,
  per,
  total_pages,
}: {
  current_page: number;
  per: number;
  total_pages: number;
}): ResponsePages {
  return {
    currentPage: current_page,
    per: per,
    totalPages: total_pages,
  }
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
