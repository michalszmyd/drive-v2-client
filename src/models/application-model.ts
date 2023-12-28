import Model from "./model";

const DEFAULT_PARAMS = {
  name: '',
}

export enum ApplicationStatus {
  Enabled = 'enabled',
  Waiting = 'waiting',
  Disabled = 'disabled',
}

export default class ApplicationModel extends Model {
  id?: number;
  name: string;
  description?: string;
  publicKey?: string;
  privateKey?: string;
  createdAt?: string;
  updatedAt?: string;
  status: ApplicationStatus;

  constructor({
    id,
    name,
    description,
    public_key,
    private_key,
    created_at,
    updated_at,
    status,
  }: {
    id?: number,
    name: string;
    description?: string;
    public_key?: string;
    private_key?: string;
    created_at?: string;
    updated_at?: string;
    status?: ApplicationStatus;
  } = DEFAULT_PARAMS) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.publicKey = public_key;
    this.privateKey = private_key;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.status = status || ApplicationStatus.Disabled;
  }

  toParams() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}
