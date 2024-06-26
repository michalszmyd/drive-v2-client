import CurrentUserHelper from "../helpers/current-user-helper";
import AuthenticationCurrentUserModel from "../models/authentication-current-user-model";
import ApiService from "./api-service";
import RequestInstance from "./api/request-instance";

export default class AuthenticatedApiService {
  static async refreshToken({
    user,
    headers,
  }: {
    user: AuthenticationCurrentUserModel;
    headers: { [key: string]: string };
  }) {
    const { id, authenticationToken, refreshAuthenticationToken } = user;
    const refreshTokenInstance = await ApiService.default({ headers });

    refreshTokenInstance.isRefreshToken = true;

    const { data } = await refreshTokenInstance.post("users/refresh_token", {
      user_session: {
        user_id: id,
        refresh_token: refreshAuthenticationToken,
        authentication_token: authenticationToken,
      },
    });

    return new AuthenticationCurrentUserModel(data);
  }

  static async default() {
    const user = await CurrentUserHelper.get();

    if (!user) {
      throw new Error("Missing user session");
    }

    const headers = {
      Authorization: user.authenticationToken,
    };

    const instance = await ApiService.default({ headers });

    instance.refreshTokenAction = async () => {
      if (!RequestInstance._queue.findByUrl("users/refresh_token")) {
        return await AuthenticatedApiService.refreshToken({
          headers,
          user,
        }).then((newUserAuthentication) => {
          RequestInstance._queue.updateQueueHeaders({
            Authorization: newUserAuthentication.authenticationToken,
          });
          instance.headers = {
            ...instance.headers,
            Authorization: newUserAuthentication.authenticationToken,
          };
          CurrentUserHelper.set(newUserAuthentication);

          return newUserAuthentication;
        });
      }
    };

    return instance;
  }
}
