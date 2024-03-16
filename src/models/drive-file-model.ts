import FolderModel from "./folder-model";
import { getFileExt, resolveBaseURL } from "./helpers/methods";
import Model from "./model";
import UserModel from "./user-model";

const ImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
const VideoExtensions = ['mp4', 'mp3', 'mpeg', 'm4a'];

const DEFAULT_PARAMS = {
  id: null,
  deleted_at: null,
  body: null,
  file_name: null,
  folder_id: null,
  name: '',
  pinned: false,
  source_url: null,
  user_id: null,
  vibrant_color: null,
  folder: null,
  user: null,
  created_at: '',
  updated_at: '',
  hosting_source: null,
}

export default class DriveFileModel extends Model {
  id: number | null;
  deletedAt?: string | null;
  body: string | null;
  fileName: string | null;
  folderId: number | null;
  name: string;
  pinned: boolean;
  sourceUrl: string | null;
  userId: number | null;
  vibrantColor: string | null;
  folder: FolderModel | null;
  user: UserModel | null;
  createdAt: string;
  updatedAt: string;
  fileSourceName: string;
  hostingSource: string | null;

  constructor({
    deleted_at,
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
    hosting_source,
  }: {
    id: number | null;
    deleted_at: string | null;
    body: string | null;
    file_name: string | null;
    folder_id: number | null;
    name: string;
    pinned: boolean;
    source_url: string | null;
    user_id: number| null;
    vibrant_color: string | null;
    folder: null | any;
    user: null | any;
    created_at: string;
    updated_at: string;
    hosting_source: string | null;
  } = DEFAULT_PARAMS) {
    super();

    this.deletedAt = deleted_at;
    this.body = body;
    this.fileName = file_name;
    this.folderId = folder_id;
    this.id = id;
    this.name = name;
    this.pinned = pinned;
    this.sourceUrl = source_url || '';
    this.fileSourceName = resolveBaseURL(source_url) || '';
    this.userId = user_id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.vibrantColor = vibrant_color;
    this.folder = folder ? new FolderModel(folder) : null;
    this.user = user ? new UserModel(user) : null;
    this.hostingSource = hosting_source;
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
    const source = this.fileSourceName;

    return getFileExt(source);
  }
}
