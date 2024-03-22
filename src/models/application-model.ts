import Model from "./model";
import UserModel, { UserModelInit } from "./user-model";

const DEFAULT_PARAMS = {
  name: "",
};

export enum ApplicationStatus {
  Enabled = "enabled",
  Waiting = "waiting",
  Disabled = "disabled",
}

export type ApplicationModelInit = {
  id?: number;
  name: string;
  description?: string;
  public_key?: string;
  private_key?: string;
  created_at?: string;
  updated_at?: string;
  last_used_at?: string;
  status?: ApplicationStatus;
  user?: UserModelInit;
};

export default class ApplicationModel extends Model {
  id?: number;
  name: string;
  description?: string;
  publicKey?: string;
  privateKey?: string;
  createdAt?: string;
  updatedAt?: string;
  lastUsedAt?: string;
  status: ApplicationStatus;
  user?: UserModel;

  constructor({
    id,
    name,
    description,
    public_key,
    private_key,
    created_at,
    updated_at,
    last_used_at,
    status,
    user,
  }: ApplicationModelInit = DEFAULT_PARAMS) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.publicKey = public_key;
    this.privateKey = private_key;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.lastUsedAt = last_used_at;
    this.status = status || ApplicationStatus.Disabled;
    this.user = new UserModel(user);
  }

  toParams() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}
