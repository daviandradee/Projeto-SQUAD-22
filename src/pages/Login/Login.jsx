import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserId, setUserEmail, setUserRole, setDoctorId, setPatientId, setFullName } from "../../utils/userInfo";
import "../../assets/css/login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const [conta, setConta] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    setEmailError('');
    setPasswordError('');

    const emailValidation = validateEmail(conta.email);
    const passwordValidation = validatePassword(conta.password);

    if (emailValidation || passwordValidation) return;

    const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

    try {
      const loginResp = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token?grant_type=password",
        {
          method: "POST",
          headers: {
            "apikey": ANON_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: conta.email,
            password: conta.password,
            grant_type: "password",
          }),
        }
      );

      const loginResult = await loginResp.json();

      if (!loginResult.access_token) {
        const errorMsg = loginResult.error_description || loginResult.msg || "Credenciais inválidas. Verifique seu e-mail e senha.";
        setServerError(errorMsg);
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
          },
        }
      );

      const userInfo = await userInfoRes.json();

      const userData = {
        id: userInfo.profile?.id,
        email: userInfo.user?.email,
        role: userInfo.roles || [],
        doctor_id: userInfo.profile?.doctor_id || userInfo.doctor_id || null,
        patient_id: userInfo.profile?.patient_id || userInfo.patient_id || null,
        full_name:
          userInfo.profile?.full_name ||
          userInfo.user?.user_metadata?.full_name ||
          userInfo.user?.email?.split('@')[0] ||
          null,
      };

      if (userData.id) {
        setUserId(userData.id);
        setUserEmail(userData.email);
        if (userData.doctor_id) setDoctorId(userData.doctor_id);
        if (userData.patient_id) setPatientId(userData.patient_id);
        if (userData.full_name) setFullName(userData.full_name);
      }

      const rolePriority = [
        { role: "admin", path: "/admin/dashboard" },
        { role: "secretaria", path: "/secretaria/" },
        { role: "medico", path: "/medico/dashboard" },
        { role: "user", path: "/patientapp" },
        { role: "paciente", path: "/paciente" },
      ];

      const matchedRole = rolePriority.find(r => userData.role.includes(r.role));

      if (matchedRole) {
        setUserRole(matchedRole.role);
        navigate(matchedRole.path);
      } else {
        setServerError("Usuário sem função atribuída. Contate o administrador.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setServerError("Erro ao conectar ao servidor. Tente novamente.");
    }
  };

  const validateEmail = (emailValue) => {
    let error = '';
    if (emailValue.trim() === '') error = 'O e-mail não pode ficar vazio.';
    else if (!emailValue.includes('@') || !emailValue.includes('.'))
      error = 'O e-mail deve conter "@" e ".".';
    setEmailError(error);
    return error;
  };

  const validatePassword = (passwordValue) => {
    let error = '';
    const MIN_LENGTH = 3;
    if (passwordValue.trim() === '') error = 'A senha não pode ficar vazia.';
    else if (passwordValue.length < MIN_LENGTH)
      error = `A senha deve ter pelo menos ${MIN_LENGTH} caracteres.`;
    setPasswordError(error);
    return error;
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    if (isTouched) validateEmail(value);
    setConta(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(value);
    if (isTouched) validatePassword(value);
    setConta(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e, type) => {
    setIsTouched(true);
    type === "email" ? validateEmail(e.target.value) : validatePassword(e.target.value);
  };

  return (
    <div className="login-container">
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

      <div className="login-section">
        <header className="login-app-header">
          <span className="login-app-name">MediConnect</span>
        </header>

        <div className="login-form-container">
          <h1 className="login-title">Entre para iniciar a sessão.</h1>

          <form onSubmit={handleLogin} noValidate>
            <label htmlFor="email" className="login-input-label">E-mail</label>
            <div className="login-input-group login-email-input">
              <input
                type="email"
                id="email"
                name="email"
                value={conta.email}
                onChange={handleEmailChange}
                onBlur={(e) => handleBlur(e, "email")}
                placeholder="seuemail@dominio.com"
                required
              />
            </div>
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

            <label htmlFor="password" className="login-input-label">Senha</label>
            <div className="login-input-group login-password-input">
              <i className="fas fa-lock login-input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={conta.password}
                onChange={handlePasswordChange}
                onBlur={(e) => handleBlur(e, "password")}
                required
              />
              <i
                onClick={togglePasswordVisibility}
                className={`login-toggle-password fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>

            {passwordError && <p style={{ color: 'red', margin: '5px 0' }}>{passwordError}</p>}
            {serverError && <p style={{ color: 'red', margin: '5px 0' }}>{serverError}</p>}

            <a href="#" className="login-reset-password">Esqueceu a senha?</a>

            <button type="submit" className="login-button">Entrar</button>

            <a href="#" className="login-with-code" onClick={() => navigate("/AcessoUnico")}>
              Entrar com Link de Acesso Único
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
