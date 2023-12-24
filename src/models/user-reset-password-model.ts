export default class UserResetPasswordModel {
  id: number;
  resetPasswordToken: string;
  resetPasswordSentAt: string;
  oneTimeToken: string;

  constructor({
    id,
    reset_password_token,
    reset_password_sent_at,
    one_time_token,
  }: {
    id: number;
    reset_password_token: string;
    reset_password_sent_at: string;
    one_time_token: string;
  }) {
    this.id = id;
    this.resetPasswordToken = reset_password_token;
    this.resetPasswordSentAt = reset_password_sent_at;
    this.oneTimeToken = one_time_token;
  }
}
