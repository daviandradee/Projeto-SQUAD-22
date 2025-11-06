import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { withMask } from "use-mask-input";
import { getAccessToken } from "../../utils/auth";

export default function Cadastro(){
    const navigate = useNavigate();

    const [form, setForm] = useState({
  email: "",
  full_name: "",
  phone_mobile: "",
  cpf: "",
  birth_date: "",
  redirect_url: ""
});

function handleChange(e) {
  setForm({ ...form, [e.target.name]: e.target.value });
}

async function handleRegister(e) {
  e.preventDefault();

  const tokenUsuario = getAccessToken()
  const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenUsuario}`,
    apikey: ANON_KEY,
  };

  try {
    const response = await fetch(
      "https://mock.apidog.com/m1/1053378-0-default/functions/v1/register-patient",
      {
        method: "POST",
        headers,
        body: JSON.stringify(form)
      }
    );

    const result = await response.json();

    // ⚠️ Se a API retornar erro (ex: CPF duplicado)
    if (!response.ok) {
      if (result.message?.toLowerCase().includes("cpf")) {
        alert("Já existe um paciente cadastrado com este CPF.");
      } else {
        alert(`Erro ao cadastrar: ${result.message || "Tente novamente."}`);
      }
      return;
    }

    console.log(result)

    navigate("/patientapp")

  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert("Erro inesperado.");
  }
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
  }}

    return(
        <div style={styles.container}>
  <div style={styles.card}>
    <h2 style={styles.title}>Cadastrar-se</h2>
    <form style={styles.form} onSubmit={handleRegister}>
      {/* Nome completo */}
      <input
        type="text"
        name="full_name"
        placeholder="Nome completo"
        value={form.full_name}
        onChange={handleChange}
        required
        style={styles.input}
      />

      {/* E-mail */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        style={styles.input}
      />

      {/* Senha */}
      <input
        type="password"
        name="password"
        placeholder="Senha"
        required
        style={styles.input}
      />

      {/* Telefone */}
      <input
        type="tel"
        name="phone_mobile"
        placeholder="Celular"
        value={form.phone_mobile}
        onChange={handleChange}
        required
        style={styles.input}
        ref={withMask('+55 (99) 99999-9999')}
      />

      {/* CPF */}
      <input
        type="text"
        name="cpf"
        placeholder="CPF"
        value={form.cpf}
        onChange={handleChange}
        required
        style={styles.input}
        ref={withMask('cpf')}
      />

      {/* Data de nascimento */}
      <input
        type="date"
        name="birth_date"
        placeholder="Data de Nascimento"
        value={form.birth_date}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <button type="submit" style={styles.button}>
        Criar conta
      </button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
          <p style={{ margin: 0 }}>Já tem uma conta?</p>
          <button
            type="button"
            onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            fontSize: "inherit"
          }}
  >
    Entrar
  </button>
</div>
    </form>
  </div>
</div>

    )
}