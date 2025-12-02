import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../assets/css/index.css";
import { logoutUser } from "../../Supabase";
import Swal from "sweetalert2";
import { getUserRole, clearUserInfo, getUserId } from "../../utils/userInfo";
import { getAccessToken } from "../../utils/auth";

const AvatarForm = "/img/AvatarForm.jpg";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yuanqfswhberkoevtmfr.supabase.co";
const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

var myHeaders = new Headers();
const tokenUsuario = getAccessToken();

const LS_KEYS = {
  dark: "pref_dark_mode",
  daltonism: "pref_daltonism",
  font: "pref_font_scale",
};

myHeaders.append("apikey", supabaseAK);
myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(AvatarForm);
  const [darkMode, setDarkMode] = useState(false);

  // Estado para dados do utilizador
  const [userData, setUserData] = useState({
    email: "Carregando...",
    role: "",
    lastSignIn: ""
  });

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const fileRef = useRef(null);

  const isDoctor = location.pathname.startsWith("/doctor");
  const userId = getUserId();
  const extensions = ["png", "jpg", "jpeg", "gif"];

  // --- EFEITOS ---

  // 1. Dark Mode
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEYS.dark) === "true";
    setDarkMode(saved);
    document.body.classList.toggle("dark-mode", saved);
  }, []);

  // 2. Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setOpenNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setOpenProfile(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 3. Carregar Avatar
  useEffect(() => {
    const loadAvatar = async () => {
      if (!userId) return;

      var requestOptions = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
      };

      const possibleNames = ['avatar', 'secretario', 'profile', 'user'];
      for (const name of possibleNames) {
        for (const ext of extensions) {
          try {
            const response = await fetch(`${supabaseUrl}/storage/v1/object/avatars/${userId}/${name}.${ext}`, requestOptions);
            if (response.ok) {
              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);
              setPreviewUrl(imageUrl);
              return;
            }
          } catch (error) { }
        }
      }
    };
    loadAvatar();
  }, [userId]);

  // 4. Determinar Nome Amigável da Role (Função auxiliar restaurada)
  const getFriendlyRole = () => {
    const role = getUserRole(); // Tenta pegar do localStorage/utils primeiro

    if (role) {
      switch (role) {
        case "medico": return "Médico";
        case "paciente": return "Paciente";
        case "admin": return "Administrador";
        case "secretaria": return "Secretária";
        default: return role;
      }
    }

    // Fallback baseado na URL se não tiver role salva
    if (location.pathname.startsWith("/doctor")) return "Médico";
    if (location.pathname.startsWith("/patientapp")) return "Paciente";
    if (location.pathname.startsWith("/admin")) return "Administrador";
    if (location.pathname.startsWith("/secretaria")) return "Secretária";

    return "Usuário";
  };

  // 5. Buscar dados do utilizador e combinar com a Role Amigável
  useEffect(() => {
    const fetchUserDetails = async () => {
      // Define a role inicial baseada na lógica local (mais confiável para exibição)
      const friendlyRole = getFriendlyRole();

      if (!userId) {
        setUserData(prev => ({ ...prev, role: friendlyRole }));
        return;
      }

      try {
        const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/user", {
          method: 'GET',
          headers: {
            'apikey': supabaseAK,
            'Authorization': `Bearer ${getAccessToken()}`
          }
        });

        if (response.ok) {
          const data = await response.json();

          const date = data.last_sign_in_at
            ? new Date(data.last_sign_in_at).toLocaleString('pt-PT', {
              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            })
            : "Primeiro acesso";

          // Se a API retornar metadados com role, usamos, senão usamos a friendlyRole calculada
          const apiRole = data.user_metadata?.role || friendlyRole;

          setUserData({
            email: data.email,
            role: apiRole, // Aqui agora usamos a role tratada
            lastSignIn: date
          });
        } else {
          // Se a API falhar, garante que a role local seja mostrada
          setUserData(prev => ({ ...prev, role: friendlyRole }));
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do utilizador", error);
        setUserData(prev => ({ ...prev, role: friendlyRole }));
      }
    };

    fetchUserDetails();
  }, [userId, location.pathname]); // Atualiza se mudar de rota também

  // --- FUNÇÕES ---

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(LS_KEYS.dark, String(next));
    document.body.classList.toggle("dark-mode", next);
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "Tem a certeza que deseja sair?",
      text: "Precisará de fazer login novamente para aceder ao sistema.",
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
          navigate("/login");
        }
      }
    });
  };

  const handleAvatarUpload = () => {
    setOpenProfile(false);
    Swal.fire({
      title: 'Alterar Foto de Perfil',
      html: `
            <div style="text-align: center;">
              <div style="margin-bottom: 20px;">
                <img id="preview-avatar" src="${previewUrl}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #ddd;" />
              </div>
              <input type="file" id="avatar-input" accept="image/*" style="padding: 10px; border: 1px solid #ddd; width: 100%;" />
            </div>`,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      preConfirm: () => {
        const fileInput = document.getElementById('avatar-input');
        const file = fileInput.files[0];
        if (!file) { Swal.showValidationMessage('Selecione uma imagem'); return false; }
        return file;
      },
      didOpen: () => {
        const fileInput = document.getElementById('avatar-input');
        const previewImg = document.getElementById('preview-avatar');
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => previewImg.src = e.target.result;
            reader.readAsDataURL(file);
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        uploadToSupabase(result.value);
      }
    });
  };

  const uploadToSupabase = async (file) => {
    console.log("Upload simulado:", file.name);
  };

  const handleAccessibilitySettings = () => {
    setOpenProfile(false);

    let daltonismMode = localStorage.getItem(LS_KEYS.daltonism) === "true";
    let fontScale = parseInt(localStorage.getItem(LS_KEYS.font) || "100", 10);
    let leituraAtiva = false;

    const applyFontScale = (next) => {
      const clamped = Math.max(80, Math.min(180, next));
      fontScale = clamped;
      localStorage.setItem(LS_KEYS.font, String(clamped));
      document.documentElement.style.fontSize = `${clamped}%`;
      const fontSpan = document.getElementById('modal-font-size');
      if (fontSpan) fontSpan.textContent = `${clamped}%`;
    };

    const toggleDaltonismMode = () => {
      daltonismMode = !daltonismMode;
      localStorage.setItem(LS_KEYS.daltonism, String(daltonismMode));
      document.body.classList.toggle("daltonism-mode", daltonismMode);
    };

    let selectionChangeListener = null;
    const lerTextoSelecionado = () => {
      const texto = window.getSelection().toString().trim();
      if (!texto) return;
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = "pt-PT";
      fala.rate = 1;
      window.speechSynthesis.speak(fala);
    };

    const toggleLeituraAtiva = () => {
      leituraAtiva = !leituraAtiva;
      const btn = document.getElementById('modal-toggle-leitura');
      if (btn) {
        btn.textContent = leituraAtiva ? "🟢 Leitura automática ativada" : "🔊 Ativar leitura automática";
        btn.classList.toggle("active", leituraAtiva);
      }
      if (selectionChangeListener) {
        document.removeEventListener("selectionchange", selectionChangeListener);
        selectionChangeListener = null;
      }
      if (leituraAtiva) {
        selectionChangeListener = () => {
          const texto = window.getSelection().toString().trim();
          if (texto.length > 1) lerTextoSelecionado();
        };
        document.addEventListener("selectionchange", selectionChangeListener);
      } else {
        window.speechSynthesis.cancel();
      }
    };

    Swal.fire({
      title: 'Configurações de Acessibilidade',
      html: `
                <style>
                    .acc-switch-large { position: relative; display: inline-block; width: 70px; height: 38px; vertical-align: middle; margin-right: 15px; }
                    .acc-switch-large input { opacity: 0; width: 0; height: 0; }
                    .acc-slider-large { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 38px; }
                    .acc-slider-large:before { position: absolute; content: ""; height: 30px; width: 30px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                    input:checked + .acc-slider-large { background-color: #009efb; }
                    input:checked + .acc-slider-large:before { transform: translateX(32px); }
                    .acc-row-modal { display: flex; align-items: center; justify-content: flex-start; padding: 10px 0; }
                    .acc-label-modal { font-size: 16px; font-weight: 500; cursor: pointer; }
                    .acc-font-controls-modal button { padding: 8px 15px; margin: 0 5px; border: 1px solid #ddd; background: #f8f9fa; border-radius: 4px; cursor: pointer; font-weight: bold; }
                    .acc-font-controls-modal button:hover { background: #e2e6ea; }
                    .acc-btn-read { width: 100%; padding: 12px; border: 1px solid #009efb; background: white; color: #009efb; border-radius: 5px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
                    .acc-btn-read:hover { background: #e3f2fd; }
                </style>
                <div id="accessibility-modal-content" style="text-align: left; padding: 0 10px;">
                    <div class="acc-row-modal">
                        <label class="acc-switch-large">
                            <input type="checkbox" id="daltonism-toggle" ${daltonismMode ? 'checked' : ''}/>
                            <span class="acc-slider-large"></span>
                        </label>
                        <span class="acc-label-modal" onclick="document.getElementById('daltonism-toggle').click()">Modo daltônico</span>
                    </div>
                    <hr style="margin: 15px 0; border-color: #eee;">
                    <div class="acc-row-modal" style="justify-content: space-between;">
                        <span class="acc-label-modal">Tamanho da fonte: <strong id="modal-font-size" style="color:#009efb">${fontScale}%</strong></span>
                        <div class="acc-font-controls-modal">
                            <button id="dec-font" title="Diminuir fonte">A−</button>
                            <button id="reset-font" title="Resetar tamanho">Padrão</button>
                            <button id="inc-font" title="Aumentar fonte">A+</button>
                        </div>
                    </div>
                    <hr style="margin: 15px 0; border-color: #eee;">
                    <div style="margin-top: 15px;">
                        <button id="modal-toggle-leitura" class="acc-btn-read">🔊 Ativar leitura automática</button>
                    </div>
                </div>
            `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Fechar',
      cancelButtonColor: '#6c757d',
      width: '450px',
      didOpen: () => {
        const popup = Swal.getPopup();
        if (!popup) return;
        const daltonismToggle = popup.querySelector('#daltonism-toggle');
        const decFontBtn = popup.querySelector('#dec-font');
        const resetFontBtn = popup.querySelector('#reset-font');
        const incFontBtn = popup.querySelector('#inc-font');
        const toggleLeituraBtn = popup.querySelector('#modal-toggle-leitura');

        if (daltonismToggle) daltonismToggle.addEventListener('change', toggleDaltonismMode);
        if (decFontBtn) decFontBtn.addEventListener('click', () => applyFontScale(fontScale - 10));
        if (resetFontBtn) resetFontBtn.addEventListener('click', () => applyFontScale(100));
        if (incFontBtn) incFontBtn.addEventListener('click', () => applyFontScale(fontScale + 10));
        if (toggleLeituraBtn) toggleLeituraBtn.addEventListener('click', toggleLeituraAtiva);
      },
      willClose: () => {
        if (selectionChangeListener) document.removeEventListener("selectionchange", selectionChangeListener);
        window.speechSynthesis.cancel();
      }
    });
  };

  return (
    <div className="header">
      <div className="header-left">
        <Link to={isDoctor ? "/doctor" : "/admin"} className="logo">
          <img src="/img/logo50.png" width="55" height="55" alt="logo" />{" "}
          <span>MediConnect</span>
        </Link>
      </div>

      <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar" onClick={(e) => { e.preventDefault(); onMenuClick(); }}>
        <i className="fa fa-bars"></i>
      </a>

      <ul className="nav user-menu float-right">
        <li className="nav-item dm-container">
          <button onClick={toggleDarkMode} className={`dm-button ${darkMode ? "dark" : "light"}`}>
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

        <li className="nav-item dropdown has-arrow" ref={profileRef}>
          <div className="upload-img" onClick={() => setOpenProfile(!openProfile)} style={{ cursor: "pointer" }}>
            <img alt="" src={previewUrl} style={{ marginTop: "5px", borderRadius: "50%", objectFit: "cover", width: "40px", height: "40px" }} />
          </div>

          <div className={`dropdown-menu${openProfile ? " show" : ""}`} style={{ minWidth: "260px" }}>

            {/* --- CORREÇÃO MODO ESCURO --- 
                           Adicionei estilos condicionais baseados no estado `darkMode`.
                           Fundo: #f8f9fa (claro) / #2c2c2c (escuro)
                           Texto: #333 (claro) / #e0e0e0 (escuro)
                           Bordas: #eaeaea (claro) / #444 (escuro)
                        */}
            <div style={{
              padding: "15px",
              backgroundColor: darkMode ? "#2c2c2c" : "#f8f9fa", // Corrigido
              borderBottom: darkMode ? "1px solid #444" : "1px solid #eaeaea", // Corrigido
              marginBottom: "10px",
              transition: "background-color 0.3s, color 0.3s"
            }}>
              <div style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: darkMode ? "#fff" : "#333", // Corrigido
                marginBottom: "5px",
                textTransform: "capitalize"
              }}>
                {/* --- CORREÇÃO ROLE DO USUÁRIO --- */}
                {userData.role}
              </div>
              <div style={{
                fontSize: "13px",
                color: darkMode ? "#bbb" : "#666", // Corrigido
                marginBottom: "8px",
                wordBreak: "break-all"
              }}>
                {userData.email}
              </div>
              <div style={{ fontSize: "11px", color: darkMode ? "#888" : "#999" }}>
                <i className="fa fa-clock-o"></i> Login: {userData.lastSignIn}
              </div>
            </div>

            <button className="dropdown-item" onClick={handleAvatarUpload}>
              <i className="fa fa-camera"></i> Alterar Foto
            </button>

            <button className="dropdown-item" onClick={handleAccessibilitySettings}>
              <i className="fa fa-cog"></i> Configurações
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