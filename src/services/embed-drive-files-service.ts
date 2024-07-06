
import DriveFileModel from "../models/drive-file-model";
import ApiService from "./api-service";

export default class EmbedDriveFilesService {
  static async find({
    id,
    expires,
    date,
    algorithm,
    signature,
  }: {
    id: string;
    expires: string;
    date: string;
    algorithm: string;
    signature: string;
  }) {
    const searchParams = new URLSearchParams({
      id,
      expires,
      date,
      algorithm,
      signature,      
    }).toString();

    const instance = await ApiService.default();

    const { data } = await instance.get(`files/embed?${searchParams}`);

    return new DriveFileModel(data);
  }
}