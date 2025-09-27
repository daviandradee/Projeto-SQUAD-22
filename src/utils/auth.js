export function getAccessToken() {
  return localStorage.getItem("access_token");
}

export  function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

export async function refreshAccessToken() {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;

  const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token", {
    method: "POST",
    headers: {
      "apikey": "SUA_API_KEY_ANONIMA", // substitua pela sua chave real
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token
    })
  });

  if (!response.ok) {
    console.error("Erro ao atualizar token:", response.status, await response.text());
    return null;
  }

  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
    return data.access_token;
  }

  return null;
}
