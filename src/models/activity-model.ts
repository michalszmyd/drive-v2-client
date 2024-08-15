import UserModel, { UserModelInit } from "./user-model";

export type ActivityModelInit = {
  id: number;
  resource: string;
  resource_id: number | null;
  action: string;
  metadata: string;
  request_info: string;
  user: UserModelInit | null;
  created_at: string;
  updated_at: string;
};

export default class ActivityModel {
  id: number;
  resource: string;
  resourceId: number | null;
  action: string;
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
