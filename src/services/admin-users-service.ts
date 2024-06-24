import UserModel, { UserModelInit } from "../models/user-model";
import UserResetPasswordModel from "../models/user-reset-password-model";
import { ResponsePages, mapPagesToResponsePages } from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class AdminUsersService {
  static async all() {
    const instance = await AuthenticatedApiService.default();

    const {
      data: { records, pages },
    } = await instance.get(`admin/users`);

    return {
      pages: mapPagesToResponsePages(pages),
      records: records.map((record: UserModelInit) => new UserModel(record)),
    } as {
      pages: ResponsePages;
      records: UserModel[];
    };
  }

  static async deleteSession(userId: number, id: number) {
    const instance = await AuthenticatedApiService.default();

    return instance.delete(`admin/users/${userId}/sessions/${id}`);
  }

  static async resetPassword(id: number) {
    const instance = await AuthenticatedApiService.default();

    const { data } = await instance.post(
      `admin/users/${id}/generate_reset_password_token`,
    );

    return new UserResetPasswordModel(data);
  }
}
