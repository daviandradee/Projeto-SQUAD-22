import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MagicLink() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //  endpoint  do link mágico
      const response = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      console.log("🔗 Retorno da API de acesso único:", result);

      alert("Se o e-mail estiver cadastrado, enviamos um link de acesso!");
      setEmail("");

    } catch (error) {
      console.error("❌ Erro ao enviar magic link:", error);
      alert("Erro ao enviar o link de acesso. Tente novamente.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Acesso Único</h2>
        <p style={styles.subtitle}>
          Digite seu e-mail para receber um link de acesso seguro.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Enviar link mágico
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={styles.backButton}
          >
            Voltar para login
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
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "25px",
    fontSize: "14px",
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
  backButton: {
    background: "none",
    border: "none",
    color: "#1976d2",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: "5px",
  },
};
