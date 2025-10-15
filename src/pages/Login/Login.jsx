import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [conta, setConta] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConta((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

    try {
      // 1) Login
      const loginResp = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token?grant_type=password",
        {
          method: "POST",
          headers: {
            "apikey": ANON_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: conta.email,
            password: conta.password,
            grant_type: "password"
          }),
          redirect: "follow"
        }
      );

      const loginResult = await loginResp.json();
      console.log(" Retorno /auth token:", loginResult);

      if (!loginResult.access_token) {
        alert(loginResult.error_description || loginResult.msg || "Erro ao fazer login");
        return;
      }

      // salvar tokens
      localStorage.setItem("access_token", loginResult.access_token);
      localStorage.setItem("refresh_token", loginResult.refresh_token);

      // 2) Chamada da função /user-info
      const userInfoRes = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/user-info",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${loginResult.access_token}`,
            "apikey": ANON_KEY,
            "Content-Type": "application/json"
          },
          redirect: "follow"
        }
      );

      if (!userInfoRes.ok) {
        const text = await userInfoRes.text();
        console.error("Erro user-info:", userInfoRes.status, text);
        alert(`Erro ao buscar informações do usuário (status ${userInfoRes.status}). Veja console.`);
        return;
      }

      const userInfo = await userInfoRes.json();
      console.log(" Dados retornados da API /user-info:", userInfo);

      localStorage.setItem("user_id", userInfo.id);

      // 3) Pegar role do array roles
      const role = userInfo.roles?.[0];
      console.log(" Role detectado:", role);

      // 4) Redirecionamento conforme o role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "secretaria") {
        navigate("/secretaria/secretariadashboard");
      } else if (role === "medico") {
        navigate("/doctor/dashboard");
      } else if (role === "user" || role === "paciente") {
        navigate("/patientapp");
      } else {
        alert("Usuário sem função atribuída. Contate o administrador.");
        console.warn("⚠️ Role não reconhecido:", userInfo);
      }

    } catch (error) {
      console.error("❌ Erro no processo de login/user-info:", error);
      alert("Erro ao conectar ao servidor. Veja console para mais detalhes.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={conta.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            name="password"
            value={conta.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

