import Validator from "./validator";

export default class FolderModelForm {
  id: number | null;
  name: string;
  folderPrivate: boolean;
  validator: Validator;

  constructor({
    id = null,
    name = "",
    folderPrivate = false,
  }: {
    id?: number | null;
    name?: string;
    folderPrivate?: boolean;
  } = {}) {
    this.id = id || null;
    this.name = name || "";
    this.folderPrivate = folderPrivate || false;

    this.validator = new Validator();
  }

  isValid = () => {
    this.validator.validatePresenceOf("name", this.name);

    return this.validator.isValid();
  };

  toParams = () => {
    return {
      folderPrivate: this.folderPrivate,
      name: this.name,
    };
  };
}
