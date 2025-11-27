import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../assets/css/index.css";
import { logoutUser } from "../../Supabase";
import Swal from "sweetalert2";
// Importações de utilitários
import { getUserRole, clearUserInfo, getUserId } from "../../utils/userInfo";
import { getAccessToken } from "../../utils/auth";

const AvatarForm = "/img/AvatarForm.jpg";

// Variáveis de ambiente definidas fora do componente (constantes)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yuanqfswhberkoevtmfr.supabase.co";
const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnZVH4tVuQkqUH6Ia9CXQj4DztQ";

const LS_KEY = "pref_dark_mode";

// Mapeamento das roles para ícones e cores (Constante)
const roleMap = {
  'admin': { icon: 'fa fa-shield', label: 'Admin', color: 'status-red' },
  'medico': { icon: 'fa fa-stethoscope', label: 'Médico', color: 'status-purple' },
  'gestor': { icon: 'fa fa-briefcase', label: 'Gestor', color: 'status-blue' },
  'secretaria': { icon: 'fa fa-phone', label: 'Secretária', color: 'status-orange' },
  'paciente': { icon: 'fa fa-user', label: 'Paciente', color: 'status-green' },
  'user': { icon: 'fa fa-user-circle', label: 'User', color: 'status-pink' }
};

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 🚨 CORREÇÃO CRÍTICA: Obter o token e o ID DENTRO do componente
  const tokenUsuario = getAccessToken(); 
  const userId = getUserId();
  
  // 🚨 CORREÇÃO CRÍTICA: Definir os headers dinamicamente para cada renderização
  const currentHeaders = new Headers();
  currentHeaders.append("apikey", supabaseAK);
  if (tokenUsuario) {
    currentHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  }

  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const [profileName, setProfileName] = useState("Admin");
  const [userData, setUserData] = useState(null); 
  const [darkMode, setDarkMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(AvatarForm);

  const isDoctor = location.pathname.startsWith("/doctor");
  const isPatient = location.pathname.startsWith("/patientapp");
  
  const extensions = ["png", "jpg", "jpeg", "gif"];

  // --- Funções Auxiliares (usando currentHeaders) ---

  // Função para carregar o avatar do usuário
  const loadUserAvatar = async (forceReload = false) => {
    if (!userId) {
      setPreviewUrl(AvatarForm); 
      return;
    }

    var requestOptions = {
      headers: currentHeaders, // Usando o header atualizado
      method: 'GET',
      redirect: 'follow'
    };
    
    // ... (restante da lógica de loadUserAvatar)
    
    for (const name of ['avatar', 'secretario', 'profile', 'user']) {
      for (const extension of extensions) {
        try {
          const avatarUrl = `${supabaseUrl}/storage/v1/object/avatars/${userId}/${name}.${extension}`;
          const finalUrl = forceReload ? `${avatarUrl}?t=${Date.now()}` : avatarUrl;
          
          const response = await fetch(finalUrl, requestOptions);
          
          if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setPreviewUrl(imageUrl);
            // console.log(`Avatar recarregado: ${name}.${extension}`);
            return; 
          }
        } catch (error) {
          // console.log(`Avatar não encontrado: ${name}.${extension}`);
        }
      }
    }
    
    // Se chegou até aqui, não encontrou avatar - mantém o padrão
    // console.log('Nenhum avatar encontrado, usando imagem padrão');
    setPreviewUrl(AvatarForm);
  };

  // Função para buscar dados do usuário
  const fetchUserData = async () => {
    if (!tokenUsuario) { // Evita a chamada se não houver token
      setUserData(null);
      return;
    }
    const endpoint = `${supabaseUrl}/auth/v1/user`;
    const requestOptions = {
      method: 'GET',
      headers: currentHeaders, // Usando o header atualizado
      redirect: 'follow'
    };

    try {
      const response = await fetch(endpoint, requestOptions);
      if (response.ok) {
        const user = await response.json();
        setUserData(user);
        setProfileName(user.user_metadata?.full_name || user.email.split('@')[0] || "Usuário");
      } else {
        console.error('Falha ao buscar dados do usuário:', response.statusText);
        setUserData(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setUserData(null);
    }
  };

  // --- Efeitos de Componente ---

  // Efeito principal: RECARREGA OS DADOS DO USUÁRIO E AVATAR A CADA LOGIN/LOGOUT
  useEffect(() => {
    if (userId && tokenUsuario) { 
      // 1. Busca os dados de perfil (nome, email, roles)
      fetchUserData();
      // 2. Carrega o avatar
      loadUserAvatar();
    } else {
      // Limpa os dados em caso de logout
      setUserData(null);
      setProfileName("Visitante");
      setPreviewUrl(AvatarForm);
    }
  }, [userId, tokenUsuario]); // ✅ Depende do ID e do Token: Garante re-fetch no login

  // --- Resto dos useEffects e Handlers (Mantenha o código de darkMode e handleClickOutside) ---

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) === "true";
    setDarkMode(saved);
    document.body.classList.toggle("dark-mode", saved);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(LS_KEY, String(next));
    document.body.classList.toggle("dark-mode", next);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setOpenNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setOpenProfile(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    // Lógica para setar nome de perfil (mantida, mas com baixa prioridade se userData estiver preenchido)
    if (userData) return;
    
    const role = getUserRole();
    if (role) {
      // ... (restante da lógica de setProfileName) ...
      switch (role) {
        case "medico": setProfileName("Médico"); break;
        case "paciente": setProfileName("Paciente"); break;
        case "admin": setProfileName("Admin"); break;
        case "secretaria": setProfileName("Secretária"); break;
        default: setProfileName("Admin"); break;
      }
    } else {
      // fallback baseado na rota
      if (location.pathname.startsWith("/doctor")) setProfileName("Médico");
      else if (location.pathname.startsWith("/patientapp")) setProfileName("Paciente");
      else if (location.pathname.startsWith("/admin")) setProfileName("Admin");
      else if (location.pathname.startsWith("/secretaria")) setProfileName("Secretária");
      else setProfileName("Admin");
    }
  }, [location.pathname, userData]);


  const handleLogout = async () => {
    Swal.fire({
      title: "Tem certeza que deseja sair?",
      // ... (restante da lógica de handleLogout) ...
      text: "Você precisará fazer login novamente para acessar o sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sair",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await logoutUser();
        if (success) {
          clearUserInfo(); 
          // O clearUserInfo deve fazer com que o token e o userId fiquem nulos
          // O useEffect principal será acionado e fará a limpeza visual do perfil
          Swal.fire({
            title: "Logout realizado!",
            text: "Você foi desconectado com sucesso.",
            icon: "success",
            timer: 1800,
            showConfirmButton: false,
          });
          navigate("/login");
        } else {
          Swal.fire({
            title: "Erro!",
            text: "Não foi possível fazer logout. Tente novamente.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  // ... (funções handleAvatarUpload, handleFileUpload e renderUserRoles mantidas inalteradas, mas usando currentHeaders/tokenUsuario em uploadToSupabase) ...

  const handleAvatarUpload = () => {
    // ... (restante da lógica) ...
    setOpenProfile(false); 

    Swal.fire({
      title: 'Alterar Foto do Perfil',
      // ... (restante da lógica do modal) ...
      preConfirm: (/* ... */) => {
        // ... (restante da lógica de validação) ...
        return file;
      },
      didOpen: (/* ... */) => {
        // ... (restante da lógica de preview) ...
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleFileUpload(result.value);
      }
    });
  };

  const handleFileUpload = async (file) => {
    try {
      Swal.fire({
        title: 'Enviando...',
        text: 'Fazendo upload da sua foto',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      const success = await uploadToSupabase(file);

      if (success) {
        setTimeout(async () => {
          await loadUserAvatar(true); 

          Swal.fire({
            title: 'Sucesso!',
            text: 'Foto do perfil atualizada com sucesso!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }, 1500); 
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível fazer upload da imagem. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  // Função para upload no Supabase
  const uploadToSupabase = async (file) => {
    try {
      if (!userId || !tokenUsuario) {
        throw new Error('Usuário não autenticado ou ID/Token ausente.');
      }

      const formData = new FormData();
      formData.append('file', file);
      
      const fileExtension = file.type.split('/')[1] || 'png';
      const uploadUrl = `${supabaseUrl}/storage/v1/object/avatars/${userId}/avatar.${fileExtension}`;

      const uploadOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUsuario}`, // Usando o token atualizado
          'apikey': supabaseAK,
          'x-upsert': 'true'
        },
        body: formData
      };

      const response = await fetch(uploadUrl, uploadOptions);
      if (response.ok) {
        return true;
      } else {
        const errorText = await response.text();
        console.error('Erro no upload:', errorText);
        throw new Error('Falha no upload');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };


  // Função para renderizar as roles (Mantida)
  const renderUserRoles = () => {
    if (!userData || !userData.role) return null;

    const rolesArray = userData.role.split(',').map(r => r.trim()).filter(r => r && r !== 'anon');

    return (
      <div className="dropdown-roles">
        {rolesArray.length > 0 ? (
          rolesArray.map(role => {
            const roleInfo = roleMap[role] || roleMap['user']; 
            return (
              <span key={role} className={`role-badge ${roleInfo.color}`}>
                <i className={roleInfo.icon}></i> {roleInfo.label}
              </span>
            );
          })
        ) : (
          <span className="role-badge status-pink">
            <i className={roleMap['user'].icon}></i> {roleMap['user'].label}
          </span>
        )}
      </div>
    );
  };
  
  // --- Renderização do Componente (Mantida) ---

  return (
    <div className="header">
        {/* ... (Estrutura da Navbar e Dark Mode) ... */}
      <div className="header-left">
        <Link to={isDoctor ? "/doctor" : "/admin"} className="logo">
          <img src="/img/logo50.png" width="55" height="55" alt="logo" />{" "}
          <span>MediConnect</span>
        </Link>
      </div>

      <a
        id="mobile_btn"
        className="mobile_btn float-left"
        href="#sidebar"
        onClick={(e) => {
          e.preventDefault();
          onMenuClick();
        }}
      >
        <i className="fa fa-bars"></i>
      </a>

      <ul className="nav user-menu float-right">
        <li className="nav-item dm-container">
          <button
            onClick={toggleDarkMode}
            title={darkMode ? "Desativar modo escuro" : "Ativar modo escuro"}
            className={`dm-button ${darkMode ? "dark" : "light"}`}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </li>

        {/* 👤 Perfil */}
        <li className="nav-item dropdown has-arrow" ref={profileRef}>
          <div className="upload-img" onClick={() => setOpenProfile(!openProfile)} style={{ cursor: "pointer" }}>
            <img alt="" src={previewUrl} style={{ marginTop: "5px", borderRadius: "50%", objectFit: "cover", width: "40px", height: "40px" }} />
          </div>

          {/* 🔒 Dropdown com perfil, upload de avatar e sair */}
          <div className={`dropdown-menu${openProfile ? " show" : ""}`}>
            {/* Perfil do Usuário */}
            {userData && (
              <>
                <div className="dropdown-profile text-center" style={{ padding: '10px 15px' }}>
                  <img 
                    alt="" 
                    src={previewUrl} 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      marginBottom: '5px'
                    }} 
                  />
                  <h5 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '600' }}>
                    {userData.user_metadata?.full_name || profileName}
                  </h5>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                    {userData.email}
                  </p>
                  {renderUserRoles()}
                </div>
                <div className="dropdown-divider"></div>
              </>
            )}
            
            <button className="dropdown-item" onClick={handleAvatarUpload}>
              <i className="fa fa-camera"></i> Alterar Foto
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout-btn" onClick={handleLogout}>
              <i className="fa fa-sign-out"></i> Sair
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;