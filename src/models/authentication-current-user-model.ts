export default class AuthenticationCurrentUserModel {
  id: number;
  authenticationToken: string;
  refreshAuthenticationToken: string;

  constructor({
    id,
    authentication_token,
    refresh_authentication_token,
  }: {
    id: number;
    authentication_token: string;
    refresh_authentication_token: string;
  }) {
    this.id = id;
    this.authenticationToken = authentication_token;
    this.refreshAuthenticationToken = refresh_authentication_token;
  }
}
