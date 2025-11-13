import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserId, setUserEmail, setUserRole, setDoctorId, setPatientId, setFullName } from "../../utils/userInfo";
import "../../assets/css/login.css"

export default function Login() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const [conta, setConta] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    setEmailError('');
    setPasswordError('');

    const emailValidation = validateEmail(conta.email);
    const passwordValidation = validatePassword(conta.password);

    if (emailValidation || passwordValidation) {
        // Se houver erros locais, para a execução antes do fetch
        return;
    }

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
        const errorMsg = loginResult.error_description || loginResult.msg || "Credenciais inválidas. Verifique seu e-mail e senha.";
        setServerError(errorMsg);
        return;
      }

      setServerError('');

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
        setServerError("Usuário sem função atribuída. Contate o administrador.");
        console.warn("⚠️ Role não reconhecido:", userInfo);
      }

    } catch (error) {
      console.error("❌ Erro no processo de login/user-info:", error);
      setServerError("Erro ao conectar ao servidor. Tente novamente.");
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

const validatePassword = (passwordValue) => {
    let error = '';
    const MIN_LENGTH = 3;
    
    if (passwordValue.trim() === '') {
        error = 'A senha não pode ficar vazia.';
    } else if (passwordValue.length < MIN_LENGTH) {
        // Regra de validação de formato para a senha
        error = `A senha deve ter pelo menos ${MIN_LENGTH} caracteres.`;
    }
    
    // Atualiza o estado de erro específico para a senha
    setPasswordError(error); 
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

const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
    if (isTouched) {
        validatePassword(newValue); // Valida em tempo real
    }

    const { name, value } = e.target;
    setConta((prev) => ({
      ...prev,
      [name]: value
    }));
};

const handlePasswordBlur = (e) => {
    setIsTouched(true);
    validatePassword(e.target.value); // Valida ao perder o foco
};

  const isInvalid = isTouched && errorMessage;

    

  return (
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
                <p class="login-subtitle"></p>

                <form onSubmit={handleLogin} noValidate>
                    <label for="email" class="input-label">E-mail</label>
                    <div class="input-group phone-input">
                        <input type="email" id="email" name="email" value={conta.email} onChange={handleEmailChange} onBlur={handleEmailBlur} placeholder="seuemail@dominio.com" required></input>
                    </div>
                    {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

                    <label for="password" class="input-label">Senha</label>
                    <div class="input-group password-input">
                        <i class="fas fa-lock input-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="password" name="password" value={conta.password} onChange={handlePasswordChange} onBlur={handlePasswordBlur} required></input>
                        <i onClick={togglePasswordVisibility}
        className={`toggle-password fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
        style={{ cursor: 'pointer' }}></i>
                    </div>
                    {passwordError && <p style={{ color: 'red', margin: '5px 0'}}>{passwordError}</p>}
                    {serverError && <p style={{ color: 'red', margin: '5px 0' }}>{serverError}</p>}

                    <a href="#" class="reset-password">Esqueceu a senha?</a>

                    <button id="button" type="submit" class="login-button">Entrar</button>
                    
                    <a href="#" class="login-with-code" onClick={() => navigate("/AcessoUnico")}>Entrar com Link de Acessso Único</a>
                </form>
            </div>
        </div>
    </div>
  );
}
