import UserModel, { UserModelInit } from "./user-model";

export enum ActivityActionType {
  Visit = 'visit',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Restore = 'restore',
}

export enum ActivityResourceType {
  Folder = 'folder',
  File = 'file',
  Application = 'application',
  Search = 'search',
  Session = 'session',
  User = 'user',
  FileShare = 'file_share',
}

export type ActivityModelInit = {
  id: number;
  resource: ActivityResourceType;
  resource_id: number | null;
  action: ActivityActionType;
  metadata: string;
  request_info: string;
  user: UserModelInit | null;
  created_at: string;
  updated_at: string;
};

export default class ActivityModel {
  id: number;
  resource: ActivityResourceType;
  resourceId: number | null;
  action: ActivityActionType;
  metadata: string;
  requestInfo: string;
  user: UserModel;
  createdAt: string;
  updatedAt: string;

  constructor({
    id,
    resource,
    resource_id,
    action,
    metadata,
    request_info,
    user,
    created_at,
    updated_at,
  }: ActivityModelInit) {
    this.id = id;
    this.resource = resource;
    this.resourceId = resource_id;
    this.action = action;
    this.metadata = JSON.stringify(metadata);
    this.requestInfo = JSON.stringify(request_info);
    this.user = new UserModel(user || undefined);
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}
