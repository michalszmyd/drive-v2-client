import { uuid } from "../../helpers/uuid-helper";
import Validator from "./validator";

export class UploadFile {
  id: string;
  file: File;

  constructor({id, file}: {id?: string; file: File}) {
    this.id = id || uuid();
    this.file = file;
  }
}

export default class DriveFileModelForm {
  id: number | null;
  body: string;
  folderId: number | null;
  name: string;
  pinned: boolean;
  validator: Validator;
  attachment: UploadFile | null;
  uniqueId: string;

  constructor({
    id = null,
    body = '',
    folderId = null,
    name = '',
    pinned = false,
    attachment = null,
    uniqueId = null,
  }: {
    id?: number | null;
    body?: string;
    folderId?: number | null;
    name?: string;
    pinned?: boolean;
    attachment?: UploadFile | null;
    uniqueId?: string | null;
  } = {}) {
    this.id = id;
    this.body = body;
    this.folderId = folderId;
    this.name = name;
    this.pinned = pinned;
    this.attachment = attachment;

    this.uniqueId = uniqueId || uuid();
    this.validator = new Validator();
  }

  isValid = () => {
    this.validator.validatePresenceOf("name", this.name);

    return this.validator.isValid();
  }

  toFormData = () => {
    const form = new FormData();

    form.append('drive_file:name', this.name);
    form.append('drive_file:body', this.body);
    form.append('drive_file:pinned', this.pinned ? '1' : '0');

    if (this.attachment) {
      form.append('drive_file:attachment', this.attachment.file);
    }

    return form;
  }

  toParams = () => {
    return {
      body: this.body,
      folderId: this.folderId,
      name: this.name,
      pinned: this.pinned,
    }
  }
}
