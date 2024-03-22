export default class UserSessionModel {
  id: number;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string;
  requestInfo: object;
  clientIp?: string;
  operatingSystem?: string;
  userAgent?: string;
  deviceType?: string;

  constructor({
    id,
    created_at,
    updated_at,
    last_used_at,
    request_info,
    client_ip,
    operating_system,
    user_agent,
    device_type,
  }: {
    id: number;
    created_at: string;
    updated_at: string;
    last_used_at: string;
    request_info: object;
    client_ip: string;
    operating_system: string;
    user_agent: string;
    device_type: string;
  }) {
    this.id = id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.lastUsedAt = last_used_at;
    this.requestInfo = request_info;

    this.clientIp = client_ip;
    this.operatingSystem = operating_system;
    this.userAgent = user_agent;
    this.deviceType = device_type;
  }
}
