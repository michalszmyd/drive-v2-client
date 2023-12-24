import UserModel from "../models/user-model";
import ApiService from "./api-service";
import AuthenticatedApiService from "./authenticated-api-service";

export default class UsersService {
  static async resetPassword({token, password, passwordConfirmation}: {token: string; password: string; passwordConfirmation: string}) {
    const instance = await ApiService.default();

    return await instance.post(`users/reset_password/${token}`, {
      user: {
        password,
        password_confirmation: passwordConfirmation,
      }
    })
  }

  static async signIn({email, password}: {email: string; password: string}) {
    const instance = await ApiService.default();

    return await instance.post('sessions', {
      email,
      password,
    })
  }

  static async me() {
    const instance = await AuthenticatedApiService.default();

    const {data} = await instance.get('users/me');

    return new UserModel(data);
  }

  static async updateCurrentUser(user: UserModel) {
    const instance = await AuthenticatedApiService.default();

    const {name} = user;

    const {data} = await instance.put('users/me', {
      user: {
        name,
      }
    });

    return new UserModel(data);
  }
}
