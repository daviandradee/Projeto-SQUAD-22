import { getAccessToken } from "../utils/auth";

export async function sendSMS(phoneNumber, message, patientId) {
  const token = getAccessToken();

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    phone_number: phoneNumber,
    message,
    patient_id: patientId,
  });

  const response = await fetch(
    "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/send-sms",
    { method: "POST", headers, body }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Falha ao enviar SMS (${response.status}) ${text}`);
  }

  return response.json();
}