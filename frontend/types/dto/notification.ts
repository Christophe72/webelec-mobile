export interface EmailDTO {
  to: string;
  subject: string;
  body: string;
}

export interface SmsDTO {
  to: string;
  message: string;
}
