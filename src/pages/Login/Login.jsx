import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserId, setUserEmail, setUserRole, setDoctorId, setPatientId, setFullName } from "../../utils/userInfo";

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

      localStorage.setItem("access_token", loginResult.access_token);
      localStorage.setItem("refresh_token", loginResult.refresh_token);

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
      console.log("📋 Dados completos do usuário:", userInfo);

      
      const userData = {
        id: userInfo.profile?.id,
        email: userInfo.user?.email,
        role: userInfo.roles || [],
        doctor_id: userInfo.profile?.doctor_id || userInfo.doctor_id || null,
        patient_id: userInfo.profile?.patient_id || userInfo.patient_id || null,
        full_name: userInfo.profile?.full_name || userInfo.user?.user_metadata?.full_name || userInfo.user?.email?.split('@')[0] || null
      };

      if (userData.id) {
        setUserId(userData.id);
        setUserEmail(userData.email);
        
        // Se o usuário for médico, salva o doctor_id
        if (userData.doctor_id) {
          setDoctorId(userData.doctor_id);
          console.log("🩺 Doctor ID salvo:", userData.doctor_id);
        }
        
        // Se o usuário for paciente, salva o patient_id
        if (userData.patient_id) {
          setPatientId(userData.patient_id);
          console.log("👤 Patient ID salvo:", userData.patient_id);
        }
        
        // Salva o nome completo
        if (userData.full_name) {
          setFullName(userData.full_name);
          console.log("📝 Nome completo salvo:", userData.full_name);
        }
        
        console.log("✅ User info salva:", {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          doctor_id: userData.doctor_id || "sem doctor_id",
          patient_id: userData.patient_id || "sem patient_id",
          full_name: userData.full_name || "sem full_name"
        });
      } else {
        console.warn("⚠️ Não foi possível salvar userInfo, id não encontrado", userInfo);
      }

      
      
      
      const roles = userData.role;

      const rolePriority = [
        { role: "admin", path: "/admin/dashboard" },
        { role: "secretaria", path: "/secretaria/" },
        { role: "medico", path: "/medico/dashboard" },
        { role: "user", path: "/patientapp" },
        { role: "paciente", path: "/paciente" },
      ];

      const matchedRole = rolePriority.find(r => roles.includes(r.role));

      if (matchedRole) {
        setUserRole(matchedRole.role); 
        console.log("Role detectada:", matchedRole.role);
        navigate(matchedRole.path);
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

          <button
            type="button"
            onClick={() => navigate("/AcessoUnico")}
            style={styles.magicButton}
          >
            Entrar com acesso único
          </button>

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
    alignItems: "center",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
  magicButton: {
    background: "none",
    border: "none",
    color: "#1976d2",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
    marginBottom: "5px",
  },
};