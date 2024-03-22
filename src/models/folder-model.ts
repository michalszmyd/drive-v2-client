import Validator from "./forms/validator";
import Model from "./model";
import UserModel from "./user-model";

const DEFAULT_ATTRIBUTES = {
  id: null,
  name: "",
  user_id: null,
  folder_private: false,
  parent_folder_id: null,
  created_at: null,
  updated_at: null,
  drive_files_count: 0,
  user_name: null,
  user: { id: null, name: "" },
  favorite: false,
};

export type FolderModelInit = {
  id: number | null;
  name: string;
  user_id: number | null;
  folder_private: boolean;
  parent_folder_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  drive_files_count: number | null;
  user_name: string | null;
  user?: { id: number | null; name: string };
  favorite: boolean;
};

export default class FolderModel extends Model {
  id: number | null;
  name: string;
  userId: number | null;
  folderPrivate: boolean;
  parentFolderId: number | null;
  updatedAt: string | null;
  createdAt: string | null;
  driveFilesCount: number | null;
  userName: string | null;
  user: UserModel;
  favorite: boolean;

  constructor({
    id,
    name,
    user_id,
    folder_private,
    parent_folder_id,
    created_at,
    updated_at,
    drive_files_count,
    user_name,
    user = { id: null, name: "" },
    favorite = false,
  }: FolderModelInit = DEFAULT_ATTRIBUTES) {
    super();

    this.id = id;
    this.name = name || "";
    this.userId = user_id;
    this.folderPrivate = folder_private || false;
    this.parentFolderId = parent_folder_id;
    this.updatedAt = updated_at;
    this.createdAt = created_at;
    this.favorite = favorite;
    this.userName = user_name;
    this.driveFilesCount = drive_files_count || 0;
    this.user = new UserModel(user);
  }

  get isValid() {
    const validator = new Validator();

    validator.validatePresenceOf("name", this.name);

    this.errors = validator.errors;

    return validator.isValid();
  }
}
