import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { setUserId, setUserEmail, setUserRole, setDoctorId, setPatientId, setFullName } from "../../utils/userInfo";
import "../../assets/css/login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [serverError, setServerError] = useState('');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const navigate = useNavigate();
  const [conta, setConta] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const recaptchaRef = useRef();

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const validateEmail = (emailValue) => {
    let error = '';
    if (emailValue.trim() === '') error = 'O e-mail não pode ficar vazio.';
    else if (!emailValue.includes('@') || !emailValue.includes('.')) error = 'O e-mail deve conter "@" e um ponto.';
    setEmailError(error);
    return error;
  };

  const validatePassword = (passwordValue) => {
    let error = '';
    const MIN_LENGTH = 3;
    if (passwordValue.trim() === '') error = 'A senha não pode ficar vazia.';
    else if (passwordValue.length < MIN_LENGTH) error = `A senha deve ter pelo menos ${MIN_LENGTH} caracteres.`;
    setPasswordError(error);
    return error;
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setConta(prev => ({ ...prev, [name]: value }));
    setEmail(value);
    if (isTouched) validateEmail(value);
  };

  const handleEmailBlur = (e) => {
    setIsTouched(true);
    validateEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setConta(prev => ({ ...prev, [name]: value }));
    setPassword(value);
    if (isTouched) validatePassword(value);
  };

  const handlePasswordBlur = (e) => {
    setIsTouched(true);
    validatePassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const recaptchaValue = recaptchaRef.current.getValue();
    if (!recaptchaValue) {
      setServerError("Por favor, confirme que você não é um robô.");
      return;
    }

    setServerError('');
    setEmailError('');
    setPasswordError('');

    if (validateEmail(conta.email) || validatePassword(conta.password)) return;

    try {
      const loginResp = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "apikey": supabaseAK, "Content-Type": "application/json" },
        body: JSON.stringify({ email: conta.email, password: conta.password, grant_type: "password" }),
        redirect: "follow"
      });
      const loginResult = await loginResp.json();

      if (!loginResult.access_token) {
        setServerError("Credenciais inválidas. Verifique seu e-mail e senha.");
        return;
      }

      localStorage.setItem("access_token", loginResult.access_token);
      localStorage.setItem("refresh_token", loginResult.refresh_token);

      const userInfoRes = await fetch(`${supabaseUrl}/functions/v1/user-info`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${loginResult.access_token}`, "apikey": supabaseAK, "Content-Type": "application/json" },
        redirect: "follow"
      });
      const userInfo = await userInfoRes.json();

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
      setServerError("Erro ao conectar ao servidor. Tente novamente.");
    }
  };

  return (
    <div className="login-body">
      <div className="container">
        <div className="image-section">
          <div className="content-section doctor-info">
            <div className="image-box doctor-box">
              <div className="doctor-image"></div>
            </div>
            <div className="text-box doctor-text">
              <h3>Você mais próximo de seu médico</h3>
              <p>Consultas online e acompanhamento em tempo real.</p>
            </div>
          </div>
          <div className="content-section patient-info">
            <div className="image-box patient-box">
              <div className="patient-image"></div>
            </div>
            <div className="text-box patient-text">
              <h3>Agende sem sair de casa</h3>
              <p>O seu atendimento, na medida da sua agenda.</p>
            </div>
          </div>
        </div>

        <div className="login-section">
          <header className="app-header">
            <span className="app-name">MediConnect</span>
          </header>

          <div className="login-form-container">
            <h1 className="login-title">Entre para iniciar a sessão.</h1>

            <form onSubmit={handleLogin} noValidate>
              <label htmlFor="email" className="input-label">E-mail</label>
              <div className="input-group phone-input">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={conta.email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="seuemail@dominio.com"
                  required
                />
              </div>
              {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

              <label htmlFor="password" className="input-label">Senha</label>
              <div className="input-group password-input">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={conta.password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  required
                />
                <i
                  onClick={togglePasswordVisibility}
                  className={`toggle-password fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                  style={{ cursor: 'pointer' }}
                ></i>
              </div>
              {passwordError && <p style={{ color: 'red', margin: '5px 0' }}>{passwordError}</p>}
              {serverError && <p style={{ color: 'red', margin: '5px 0' }}>{serverError}</p>}

              <a href="#" className="reset-password">Esqueceu a senha?</a>

              {/* ✅ RECAPTCHA */}
              <div className="recaptcha-wrapper">
                <ReCAPTCHA
                  sitekey="6LelHhAsAAAAAKABZAIDGDXiO1OqIR9KNblghRvt"
                  ref={recaptchaRef}
                />
              </div>

              <button id="button" type="submit" className="login-button">Entrar</button>

              <a href="#" className="login-with-code" onClick={() => navigate("/AcessoUnico")}>
                Entrar com Link de Acessso Único
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
