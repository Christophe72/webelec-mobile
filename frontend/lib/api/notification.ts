import { api } from "./base";
import { EmailDTO, SmsDTO } from "@/types";

export function sendEmail(token: string, data: EmailDTO): Promise<void> {
  return api(token, "/notifications/email", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function sendSms(token: string, data: SmsDTO): Promise<void> {
  return api(token, "/notifications/sms", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
