import ApiService from "./api-service";

export default class FoldersService {
  static async all() {
    const instance = await ApiService.default();

    return await instance.get('folders');
  }
}
