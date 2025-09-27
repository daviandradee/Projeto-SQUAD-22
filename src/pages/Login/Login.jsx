// src/pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [conta, setConta] = useState({
    email: "",
    password: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConta((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: conta.email,
      password: conta.password,
      grant_type: "password"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://yuanqfswhberkoevtmfr.supabase.co/auth/v1//token?grant_type=password", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.access_token) {
          // Login OK
          localStorage.setItem("access_token", result.access_token);
          localStorage.setItem("refresh_token", result.refresh_token);
          navigate("/secretaria/pacientelista");
          console.log(result)
        } else {
          alert(result.error_description || result.msg || "Erro ao fazer login");
        }
      })
      .catch(error => {
        alert("Erro ao conectar ao servidor");
        console.log('error', error);
      });
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

// Estilos simples inline para facilitar customização
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
