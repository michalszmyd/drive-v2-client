import FolderModel from "./folder-model";
import UserModel from "./user-model";

const ImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
const VideoExtensions = ['mp4', 'mp3', 'mpeg'];

export default class DriveFileModel {
  id: number;
  archived: boolean;
  body: string | null;
  fileName: string | null;
  folderId: number | null;
  name: string;
  pinned: boolean;
  sourceUrl: string | null;
  userId: number;
  vibrantColor: string | null;
  folder: FolderModel | null;
  user: UserModel | null;
  createdAt: string;
  updatedAt: string;

  constructor({
    archived,
    body,
    file_name,
    folder_id,
    id,
    name,
    pinned,
    source_url,
    user_id,
    vibrant_color,
    folder,
    user,
    created_at,
    updated_at,
  }: {
    id: number;
    archived: boolean;
    body: string | null;
    file_name: string | null;
    folder_id: number | null;
    name: string;
    pinned: boolean;
    source_url: string | null;
    user_id: number;
    vibrant_color: string | null;
    folder: null | any;
    user: null | any;
    created_at: string;
    updated_at: string;
  }) {
    this.archived = archived;
    this.body = body;
    this.fileName = file_name;
    this.folderId = folder_id;
    this.id = id;
    this.name = name;
    this.pinned = pinned;
    this.sourceUrl = source_url;
    this.userId = user_id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.vibrantColor = vibrant_color;
    this.folder = folder ? new FolderModel(folder) : null;
    this.user = user ? new UserModel(user) : null;
  }

  get isImage() : boolean {
    if (!this.fileType) {
      return false
    }

    return ImageExtensions.includes(this.fileType);
  }

  isOwner(userId : number) : boolean {
    return this.userId === userId;
  }

  get isVideo() : boolean {
    if (!this.fileType) {
      return false
    }

    return VideoExtensions.includes(this.fileType);
  }

  get fileType(): null | string {
    const source = this.sourceUrl;

    if (!source) {
      return null;
    }

    const regex = /(?:\.([^.]+))?$/;
    const result = regex.exec(source);

    return result && result[1];
  }
}
