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

const LS_KEY = "pref_dark_mode";

myHeaders.append("apikey", supabaseAK);
myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const [profileName, setProfileName] = useState("Admin");

  const [darkMode, setDarkMode] = useState(false);

  const isDoctor = location.pathname.startsWith("/doctor");
  const isPatient = location.pathname.startsWith("/patientapp");

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
    const role = getUserRole();

    if (role) {
      switch (role) {
        case "medico":
          setProfileName("Médico");
          break;
        case "paciente":
          setProfileName("Paciente");
          break;
        case "admin":
          setProfileName("Admin");
          break;
        case "secretaria":
          setProfileName("Secretária");
          break;
        default:
          setProfileName("Admin");
          break;
      }
    } else {
      // fallback baseado na rota, caso role não exista
      if (location.pathname.startsWith("/doctor")) setProfileName("Médico");
      else if (location.pathname.startsWith("/patientapp")) setProfileName("Paciente");
      else if (location.pathname.startsWith("/admin")) setProfileName("Admin");
      else if (location.pathname.startsWith("/secretaria")) setProfileName("Secretária");
      else setProfileName("Admin");
    }
  }, [location.pathname]);
  const userId = getUserId();
  const extensions = ["png", "jpg", "jpeg", "gif"];

  useEffect(() => {
    const loadAvatar = async () => {
      if (!userId) return;

      var requestOptions = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
      };

      // Tenta carregar com diferentes nomes e extensões
      const possibleNames = ['avatar', 'secretario', 'profile', 'user'];
      
      for (const name of possibleNames) {
        for (const ext of extensions) {
          try {
            const response = await fetch(`${supabaseUrl}/storage/v1/object/avatars/${userId}/${name}.${ext}`, requestOptions);
            
            if (response.ok) {
              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);
              setPreviewUrl(imageUrl);
              console.log(`Avatar encontrado: ${name}.${ext}`);
              return; // Avatar encontrado, sai do loop
            }
          } catch (error) {
            console.log(`Avatar não encontrado: ${name}.${ext}`);
          }
        }
      }
      
      // Se chegou até aqui, não encontrou avatar - mantém o padrão
      console.log('Nenhum avatar encontrado, usando imagem padrão');
    };

    loadAvatar();
  }, [userId]);
  const handleLogout = async () => {
    Swal.fire({
      title: "Tem certeza que deseja sair?",
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
          clearUserInfo(); // ✅ limpa dados do usuário
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

  const [previewUrl, setPreviewUrl] = useState(AvatarForm);
  const fileRef = useRef(null);

  // Função para carregar o avatar do usuário
  const loadUserAvatar = async (forceReload = false) => {
    if (!userId) return;

    var requestOptions = {
      headers: myHeaders,
      method: 'GET',
      redirect: 'follow'
    };

    // Tenta carregar com diferentes nomes e extensões
    const possibleNames = ['avatar', 'secretario', 'profile', 'user'];
    
    for (const name of possibleNames) {
      for (const extension of extensions) {
        try {
          const avatarUrl = `${supabaseUrl}/storage/v1/object/avatars/${userId}/${name}.${extension}`;
          const finalUrl = forceReload ? `${avatarUrl}?t=${Date.now()}` : avatarUrl;
          
          const response = await fetch(finalUrl, requestOptions);
          
          if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setPreviewUrl(imageUrl);
            console.log(`Avatar recarregado: ${name}.${extension}`);
            return; // Avatar encontrado, sai do loop
          }
        } catch (error) {
          console.log(`Avatar não encontrado: ${name}.${extension}`);
        }
      }
    }
    
    // Se chegou até aqui, não encontrou avatar - mantém o padrão
    console.log('Nenhum avatar encontrado, usando imagem padrão');
  };

  // Função para abrir o modal de upload de avatar
  const handleAvatarUpload = () => {
    setOpenProfile(false); // Fecha o dropdown

    Swal.fire({
      title: 'Alterar Foto do Perfil',
      html: `
        <div style="text-align: center;">
          <div style="margin-bottom: 20px;">
            <img id="preview-avatar" src="${previewUrl}" style="
              width: 120px; 
              height: 120px; 
              border-radius: 50%; 
              object-fit: cover;
              border: 3px solid #ddd;
              margin-bottom: 15px;
            " />
          </div>
          <input type="file" id="avatar-input" accept="image/*" style="
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
          " />
          <p style="font-size: 12px; color: #666; margin-top: 10px;">
            Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#009efb',
      cancelButtonColor: '#6c757d',
      preConfirm: () => {
        const fileInput = document.getElementById('avatar-input');
        const file = fileInput.files[0];

        if (!file) {
          Swal.showValidationMessage('Por favor, selecione uma imagem');
          return false;
        }

        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          Swal.showValidationMessage('Formato não suportado. Use JPG, PNG ou GIF');
          return false;
        }

        // Validar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
          Swal.showValidationMessage('Arquivo muito grande. Máximo 5MB');
          return false;
        }

        return file;
      },
      didOpen: () => {
        const fileInput = document.getElementById('avatar-input');
        const previewImg = document.getElementById('preview-avatar');

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              previewImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleFileUpload(result.value);
      }
    });
  };

  // Função para processar o upload do arquivo
  const handleFileUpload = async (file) => {
    try {
      // Mostra loading
      Swal.fire({
        title: 'Enviando...',
        text: 'Fazendo upload da sua foto',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Faz o upload para o Supabase
      const success = await uploadToSupabase(file);

      if (success) {
        // Aguarda um pouco e recarrega o avatar do servidor
        setTimeout(async () => {
          await loadUserAvatar(true); // Force reload com cache busting

          Swal.fire({
            title: 'Sucesso!',
            text: 'Foto do perfil atualizada com sucesso!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }, 1500); // Aguarda 1.5s para o servidor processar
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
      if (!userId) {
        throw new Error('User ID não encontrado');
      }

      // 🔍 DEBUG: Verifica se o arquivo foi recebido
      console.log('📁 Arquivo recebido no uploadToSupabase:');
      console.log('  - Nome:', file?.name);
      console.log('  - Tamanho:', file?.size, 'bytes');
      console.log('  - Tipo:', file?.type);
      console.log('  - Arquivo completo:', file);

      // Prepara o FormData para upload
      const formData = new FormData();
      formData.append('file', file); // Nome da chave conforme sua API
      
      // 🔍 DEBUG: Verifica o FormData
      console.log('📦 FormData criado:', formData);
      console.log('📦 Arquivo no FormData:', formData.get('file'));

      // Sempre salva como avatar.png independente do nome original
      const fileExtension = file.type.split('/')[1] || 'png';
      const uploadUrl = `${supabaseUrl}/storage/v1/object/avatars/${userId}/avatar.${fileExtension}`;

      const uploadOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUsuario}`,
          'apikey': supabaseAK,
          'x-upsert': 'true'
        },
        body: formData
      };

      // Faz o upload
      const response = await fetch(uploadUrl, uploadOptions);
      console.log('Resposta do upload:', response);
      if (response.ok) {
        console.log('Upload realizado com sucesso!');
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

  return (
    <div className="header">
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

          {/* 🔒 Dropdown com upload de avatar e sair */}
          <div className={`dropdown-menu${openProfile ? " show" : ""}`}>
            <div className="dropdown-header">
              <span>{profileName}</span>
            </div>
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
