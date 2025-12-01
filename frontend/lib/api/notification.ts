import { api } from "./base";
import { EmailDTO, SmsDTO } from "@/types";

export function sendEmail(data: EmailDTO): Promise<void> {
  return api("/notifications/email", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function sendSms(data: SmsDTO): Promise<void> {
  return api("/notifications/sms", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
