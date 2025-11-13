import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/auth.js";
import { useResponsive } from "../../utils/useResponsive";

export default function MagicLink() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSucsess, setServerSucsess] = useState("");
  const tokenUsuario = getAccessToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      return; // impede envio se houver erro
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append(
        "apikey",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"
      );
      myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: email,
        options: {
          emailRedirectTo: "https://mediconnect-neon.vercel.app/",
        },
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/otp",
        requestOptions
      );

      const result = await response.json();
      console.log("🔗 Retorno da API de acesso único:", result);

      setServerSucsess(
        "Se o e-mail estiver cadastrado, enviamos um link de acesso!"
      );
      setEmail("");
    } catch (error) {
      console.error("❌ Erro ao enviar magic link:", error);
      setServerError("Erro ao enviar o link de acesso. Tente novamente.");
    }
  };

  const validateEmail = (emailValue) => {
    let error = "";

    if (emailValue.trim() === "") {
      error = "O e-mail não pode ficar vazio.";
    } else if (!emailValue.includes("@") || !emailValue.includes(".")) {
      error =
        'O e-mail deve conter o símbolo "@" e um ponto (".") seguido por uma extensão.';
    }

    setEmailError(error);
    return error;
  };

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
    if (isTouched) {
      validateEmail(newValue);
    }
  };

  const handleEmailBlur = (e) => {
    setIsTouched(true);
    validateEmail(e.target.value);
  };

  return (
    <div className="login-container">
      {/* ==== SEÇÃO DE IMAGENS ==== */}
      <div className="login-image-section">
        <div className="login-content-section login-doctor-info">
          <div className="login-image-box login-doctor-box">
            <div className="login-doctor-image"></div>
          </div>
          <div className="login-text-box login-doctor-text">
            <h3>Você mais próximo de seu médico</h3>
            <p>Consultas online e acompanhamento em tempo real.</p>
          </div>
        </div>

        <div className="login-content-section login-patient-info">
          <div className="login-image-box login-patient-box">
            <div className="login-patient-image"></div>
          </div>
          <div className="login-text-box login-patient-text">
            <h3>Agende sem sair de casa</h3>
            <p>O seu atendimento, na medida da sua agenda.</p>
          </div>
        </div>
      </div>

      {/* ==== SEÇÃO DE LOGIN ==== */}
      <div className="login-section">
        <header className="login-app-header">
          <span className="login-app-name">MediConnect</span>
        </header>

        <div className="login-form-container">
          <h1 className="login-title">Entre para iniciar a sessão.</h1>
          <p className="login-subtitle">
            Digite seu e-mail para receber um link de acesso seguro.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-email" className="login-input-label">
              E-mail
            </label>
            <div className="login-input-group login-phone-input">
              <input
                type="email"
                id="login-email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="seuemail@dominio.com"
                required
              />
            </div>

            {emailError && (
              <p style={{ color: "red", margin: "5px 0" }}>{emailError}</p>
            )}
            {serverSucsess && (
              <p style={{ color: "green", margin: "5px 0" }}>{serverSucsess}</p>
            )}
            {serverError && (
              <p style={{ color: "red", margin: "5px 0" }}>{serverError}</p>
            )}

            <button
              id="login-button"
              type="submit"
              className="login-button"
            >
              Enviar Link Mágico
            </button>

            <a
              href="#"
              className="login-with-code"
              onClick={() => navigate("/Login")}
            >
              Entrar com Senha
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
