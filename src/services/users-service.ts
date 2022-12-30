import ApiService from "./api-service";

export default class UsersService {
  static async resetPassword({token, password, passwordConfirmation}: {token: string; password: string; passwordConfirmation: string}) {
    const instance = await ApiService.default();

    return await instance.post(`reset_password/${token}`, {
      password,
      password_confirmation: passwordConfirmation,
    })
  }

  static async signIn({email, password}: {email: string; password: string}) {
    const instance = await ApiService.default();

    return await instance.post('sessions', {
      email,
      password,
    })
  }
}
