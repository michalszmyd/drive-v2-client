export default class FolderModel {
  id: number;
  name: string;
  userId: number;
  folderPrivate: boolean;
  parentFolderId: number | null;
  updatedAt: string;
  createdAt: string;
  driveFilesCount: number | null;
  userName: string | null;

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
  }: {
    id: number;
    name: string;
    user_id: number;
    folder_private: boolean;
    parent_folder_id: number | null;
    created_at: string;
    updated_at: string;
    drive_files_count: number | null;
    user_name: string | null;
  }) {
    this.id = id;
    this.name = name;
    this.userId = user_id;
    this.folderPrivate = folder_private;
    this.parentFolderId = parent_folder_id;
    this.updatedAt = updated_at;
    this.createdAt = created_at;
    this.userName = user_name;
    this.driveFilesCount = drive_files_count;
  }
}
