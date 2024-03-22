import AuthenticationCurrentUserModel from "../models/authentication-current-user-model";

export default class CurrentUserHelper {
  static async get(): Promise<AuthenticationCurrentUserModel | null> {
    const data = localStorage.getItem("currentUser");

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data);

    return new AuthenticationCurrentUserModel({
      authentication_token: parsedData.authenticationToken,
      refresh_authentication_token: parsedData.refreshAuthenticationToken,
      id: parsedData.id,
    });
  }

  static async set(user: AuthenticationCurrentUserModel): Promise<boolean> {
    localStorage.setItem("currentUser", JSON.stringify(user));

    return true;
  }

  static async destroy(): Promise<boolean> {
    localStorage.removeItem("currentUser");

    return true;
  }
}
