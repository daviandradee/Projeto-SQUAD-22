import { getAccessToken } from "../utils/auth";

export async function sendSMS(phoneNumber, message, patientId) {
  const token = getAccessToken();

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("apikey", "SUA_ANON_KEY_REAL_DO_SUPABASE"); // substitua pela sua anon key real
  headers.append("Content-Type", "application/json");

  // 🔹 garante formato internacional (+55)
  const formattedNumber = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+55${phoneNumber.replace(/\D/g, "")}`;

  const body = JSON.stringify({
    phone_number: formattedNumber,
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