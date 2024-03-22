import { getFileExt } from "./helpers/methods";

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
  folder_name: string | null;
  user_name: string;
  user_id: number;
  record_type: ItemModelRecordType;
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
  folderName: string | null;
  userName: string;
  userId: number;

  constructor({
    id,
    name,
    source_url,
    folder_id,
    user_name,
    user_id,
    folder_name,
    pinned,
    record_type,
    updated_at,
    created_at,
  }: ItemModelInit) {
    this.id = id;
    this.name = name;
    this.sourceUrl = source_url || "";
    this.folderName = folder_name;
    this.userName = user_name;
    this.userId = user_id;
    this.folderId = folder_id || null;
    this.pinned = pinned;
    this.recordType = record_type;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
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
