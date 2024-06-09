import FolderModel, { FolderModelInit } from "./folder-model";
import { getFileExt } from "./helpers/methods";
import UserModel, { UserModelInit } from "./user-model";

export enum ItemModelRecordType {
  Folder = "folder",
  DriveFile = "drive_file",
}

const ImageExtensions = ["jpg", "jpeg", "png", "gif"];
const VideoExtensions = ["mp4"];

export type ItemModelInit = {
  id: number;
  name: string;
  source_url: string;
  folder_id?: number | null;
  pinned: boolean;
  user_id: number;
  record_type: ItemModelRecordType;
  folder: FolderModelInit;
  user: UserModelInit;
  updated_at: string;
  created_at: string;
};

export default class ItemModel {
  id: number;
  name: string;
  sourceUrl: string | null | undefined;
  folderId: number | null;
  pinned: boolean;
  recordType: ItemModelRecordType;
  createdAt: string;
  updatedAt: string;
  userId: number;

  folder: FolderModel;
  user: UserModel;

  constructor({
    id,
    name,
    source_url,
    folder_id,
    user_id,
    pinned,
    record_type,
    updated_at,
    created_at,
    user,
    folder,
  }: ItemModelInit) {
    this.id = id;
    this.name = name;
    this.sourceUrl = source_url || "";
    this.userId = user_id;
    this.folderId = folder_id || null;
    this.pinned = pinned;
    this.recordType = record_type;
    this.createdAt = created_at;
    this.updatedAt = updated_at;

    this.user = user ? new UserModel(user) :  new UserModel();
    this.folder = folder ? new FolderModel(folder) : new FolderModel();
  }

  get folderName(): string {
    return this.folder.name;
  }

  get userName(): string {
    return this.user.name;
  }

  get isImage(): boolean {
    if (!this.fileType) {
      return false;
    }

    return ImageExtensions.includes(this.fileType);
  }

  get isVideo(): boolean {
    if (!this.fileType) {
      return false;
    }

    return VideoExtensions.includes(this.fileType);
  }

  get fileType(): null | string {
    const source = this.sourceUrl;

    return getFileExt(source);
  }
}
