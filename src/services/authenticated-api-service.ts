import CurrentUserHelper from "../helpers/current-user-helper";
import ApiService from "./api-service";

export default class AuthenticatedApiService {
  static async default() {
    const user = await CurrentUserHelper.get();

    if (!user) {
      throw new Error('Missing user session');
    }

    const headers = {
      'Authorization': user.authenticationToken,
    }

    return await ApiService.default({headers});
  }
}
