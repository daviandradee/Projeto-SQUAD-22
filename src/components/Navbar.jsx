import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../assets/css/index.css";
import { logoutUser } from "../Supabase";
import Swal from "sweetalert2";
import { getUserRole, clearUserInfo } from "../utils/userInfo"; 

const LS_KEY = "pref_dark_mode";

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
          navigate("/");
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
          <a
            href="#!"
            className="dropdown-toggle nav-link user-link"
            onClick={(e) => {
              e.preventDefault();
              setOpenProfile((v) => !v);
              setOpenNotif(false);
            }}
          >
            <span className="user-img">
              <span className="status online"></span>
            </span>
            <span>{profileName}</span>
          </a>

          {/* 🔒 Dropdown SEM perfis — apenas botão de sair */}
          <div className={`dropdown-menu${openProfile ? " show" : ""}`}>
            <button className="dropdown-item logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
