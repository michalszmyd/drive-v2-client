export enum ItemModelRecordType {
  Folder = 'folder',
  DriveFile = 'drive_file',
}

const ImageExtensions = ['jpg', 'jpeg', 'png'];

export default class ItemModel {
  id: number;
  name: string;
  sourceUrl: string;
  folderId: number | null;
  pinned: boolean;
  recordType: ItemModelRecordType;
  createdAt: string;
  updatedAt: string;
  folderName: string | null;
  userName: string;

  constructor(
    {
      id,
      name,
      source_url,
      folder_id,
      user_name,
      folder_name,
      pinned,
      record_type,
      updated_at,
      created_at,
    } : {
      id: number;
      name: string;
      source_url: string;
      folder_id?: number | null;
      pinned: boolean;
      folder_name: string | null;
      user_name: string;
      record_type: ItemModelRecordType;
      updated_at: string;
      created_at: string;
    }
  ) {
    this.id = id;
    this.name = name;
    this.sourceUrl = source_url;
    this.folderName = folder_name;
    this.userName = user_name;
    this.folderId = folder_id || null;
    this.pinned = pinned;
    this.recordType = record_type;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  get isImage() : boolean {
    if (!this.fileType) {
      return false
    }

    return ImageExtensions.includes(this.fileType);
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
