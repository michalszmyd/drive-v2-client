import StringHelper from "../helpers/string-helper";
import Model from "./model";

const DEFAULT_PARAMS = {
  id: null,
  name: "",
  email: "",
  admin: null,
  created_at: "",
  updated_at: "",
};

export type UserModelInit = {
  id: number | null;
  name?: string;
  admin?: boolean | null;
  email?: string;
  updated_at?: string;
  created_at?: string;
};

export default class UserModel extends Model {
  id: number | null;
  name: string;
  email: string;
  admin: boolean | null;
  updatedAt: string;
  createdAt: string;

  constructor({
    id,
    name = "",
    email = "",
    admin = null,
    updated_at = "",
    created_at = "",
  }: UserModelInit = DEFAULT_PARAMS) {
    super();

    this.id = id;
    this.name = name;
    this.email = email;
    this.admin = admin;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  get displayName() {
    if (StringHelper.isBlank(this.name)) {
      return this.email;
    }

    return this.name;
  }
}
