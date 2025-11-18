import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/auth.js";
import { useResponsive } from '../../utils/useResponsive';

export default function MagicLink() {

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [serverSucsess, setServerSucsess] = useState('');
  const tokenUsuario =getAccessToken()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);

     if (emailValidation) {
        // Se houver erros locais, para a execução antes do fetch
        return;
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("apikey", supabaseAK);
      myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        email: email,
        options: {
          emailRedirectTo: "https://mediconnect-neon.vercel.app/"
        }
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      const response = await fetch(
        `${supabaseUrl}/auth/v1/otp`, requestOptions
      );

      const result = await response.json();
      console.log("🔗 Retorno da API de acesso único:", result);

      serverSucsess("Se o e-mail estiver cadastrado, enviamos um link de acesso!");
      setEmail("");

    } catch (error) {
      console.error("❌ Erro ao enviar magic link:", error);
      serverError("Erro ao enviar o link de acesso. Tente novamente.");
    }
  };

  const validateEmail = (emailValue) => {
    let error = '';

    if (emailValue.trim() === '') {
        error = 'O e-mail não pode ficar vazio.';
    } else if (!emailValue.includes('@') || !emailValue.includes('.')) {
        error = 'O e-mail deve conter o símbolo "@" e um ponto (".") seguido por uma extensão.';
    }
    
    // Atualiza o estado de erro específico para o email
    setEmailError(error); 
    return error;
};

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
    if (isTouched) {
        validateEmail(newValue); // Valida em tempo real
    }

    const { name, value } = e.target;
    setConta((prev) => ({
      ...prev,
      [name]: value
    }));
};

  const handleEmailBlur = (e) => {
    setIsTouched(true);
    validateEmail(e.target.value); // Valida ao perder o foco
};

  return (
    <div class="login-body">
    <div class="container">
        <div class="image-section">
            <div class="content-section doctor-info">
            <div class="image-box doctor-box">
                <div class="doctor-image"></div>
            </div>
            <div class="text-box doctor-text">
            <h3>Você mais próximo de seu médico</h3>
            <p>Consultas online e acompanhamento em tempo real.</p>
        </div>
        </div>
        <div class="content-section patient-info">
            <div class="image-box patient-box">
                <div class="patient-image"></div>
            </div>
            <div class="text-box patient-text">
            <h3>Agende sem sair de casa</h3>
            <p>O seu atendimento, na medida da sua agenda.</p>
        </div>
        </div>
        </div>

        <div class="login-section">
            <header class="app-header">
                <span class="app-name">MediConnect</span>
            </header>

            <div class="login-form-container">
                <h1 class="login-title">Entre para iniciar a sessão.</h1>
                <p class="login-subtitle">Digite seu e-mail para receber um link de acesso seguro.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <label for="email" class="input-label">E-mail</label>
                    <div class="input-group phone-input">
                        <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} onBlur={handleEmailBlur} placeholder="seuemail@dominio.com" required></input>
                    </div>
                    {emailError && <p style={{ color: 'red', margin: '5px 0' }}>{emailError}</p>}
                    {serverError && <p style={{ color: 'green', margin: '5px 0' }}>{serverSucsess}</p>}
                    {serverError && <p style={{ color: 'red', margin: '5px 0' }}>{serverError}</p>}

                    <button id="button" type="submit" class="login-button">Enviar Link Mágico</button>
                    
                    <a href="#" class="login-with-code" onClick={() => navigate("/Login")}>Entrar com Senha</a>
                </form>
            </div>
        </div>
    </div>
    </div>
  );
};