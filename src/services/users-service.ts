import UserModel, { UserModelInit } from "../models/user-model";
import UserSessionModel, {
  UserSessionModelInit,
} from "../models/user-session-model";
import ApiService, { ResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class UsersService {
  static async all({
    page = 1,
    per = 10,
  }: {
    page?: number | undefined;
    per?: number | undefined;
  } = {}): Promise<{ records: UserModel[]; pages: ResponsePages }> {
    const instance = await AuthenticatedApiService.default();
    const requestPage = (page || 1).toString();
    const requestPer = (per || 1).toString();

    const params = new URLSearchParams({ page: requestPage, per: requestPer });

    const {
      data: { pages, records },
    } = await instance.get(`users?${params.toString()}`);

    const responsePages: ResponsePages = {
      totalPages: pages.total_pages,
      currentPage: pages.current_page,
      per: pages.per,
      total: pages.total,
    };

    return {
      pages: responsePages,
      records: records.map((record: UserModelInit) => new UserModel(record)),
    };
  }

  static async resetPassword({
    token,
    password,
    passwordConfirmation,
  }: {
    token: string;
    password: string;
    passwordConfirmation: string;
  }) {
    const instance = await ApiService.default();

    return await instance.post(`users/reset_password/${token}`, {
      user: {
        password,
        password_confirmation: passwordConfirmation,
      },
    });
  }

  static async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const instance = await ApiService.default();

    return await instance.post("sessions", {
      email,
      password,
    });
  }

  static async me() {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.get("users/me");

    return new UserModel(data);
  }

  static async userSessions() {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.get("me/sessions");

    return data.map(
      (element: UserSessionModelInit) => new UserSessionModel(element),
    );
  }

  static async deleteUserSession(session: UserSessionModel) {
    const instance = await AuthenticatedApiService.default();

    return await instance.delete(`me/sessions/${session.id}`);
  }

  static async updateCurrentUser(user: UserModel) {
    const instance = await AuthenticatedApiService.default();

    const { name } = user;

    const { data } = await instance.put("users/me", {
      user: {
        name,
      },
    });

    return new UserModel(data);
  }
}
