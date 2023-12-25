import SETTINGS from "../consts/settings";
import RequestInstance from "./api/request-instance";

const API_PREFIX = SETTINGS.API_PREFIX;

export interface ResponsePages {
  currentPage: number;
  totalPages: number;
  per: number;
  total: number;
}

export function mapPagesToResponsePages({
  current_page,
  per,
  total_pages,
  total,
}: {
  current_page: number;
  per: number;
  total_pages: number;
  total: number;
}): ResponsePages {
  return {
    currentPage: current_page,
    per: per,
    totalPages: total_pages,
    total: total,
  }
}

export default class ApiService {
  static async default({headers = {}}: {headers?: object} = {}): Promise<RequestInstance> {
    const baseUrl = `${SETTINGS.API_URL}/${API_PREFIX}`;

    return new RequestInstance({
      baseUrl,
      headers,
    });
  }
}
