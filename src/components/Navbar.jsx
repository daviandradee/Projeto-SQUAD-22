// ...existing imports...
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../assets/css/index.css"
import { Link } from "react-router-dom";
import { logoutUser } from "../Supabase";
import Swal from "sweetalert2";

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Troque profileName para estado controlado
  const [profileName, setProfileName] = useState(
    location.pathname.startsWith("/doctor") ? "Médico" : "Admin"
  );

  const isDoctor = location.pathname.startsWith("/doctor");
  const isPatient = location.pathname.startsWith("/patientapp");

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Atualiza profileName ao navegar
  useEffect(() => {
    if (location.pathname.startsWith("/doctor")) {
      setProfileName("Médico");
    } else if (location.pathname.startsWith("/patientapp")) {
      setProfileName("Paciente");
    } else if (location.pathname.startsWith("/admin")) {
      setProfileName("Admin");
      } else if (location.pathname.startsWith("/secretaria")) {
      setProfileName("Secretária ");
    } else {
      // Rota de login ou outras rotas
      setProfileName("Admin");
    }
  }, [location.pathname]);



  // Novo handler para paciente
  const handlePacienteClick = () => {
    setProfileName("Paciente");
    setOpenProfile(false);
    navigate("/patientapp");
  };

  const handleLogout = async () => {
  Swal.fire({
    title: "Tem certeza que deseja sair?",
    text: "Você precisará fazer login novamente para acessar o sistema.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e63946",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sim, sair",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const success = await logoutUser();
      if (success) {
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
  }) 
};


  return (
    <div className="header">
      <div className="header-left">
        {/* Logo dinâmica */}
        <Link to={isDoctor ? "/doctor" : "/admin"} className="logo">
          <img src="/img/logo50.png" width="55" height="55"  alt="" class/>{" "}
          <span>MediConnect</span>
        </Link>
      </div>

      <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar"
      onClick={(e) => {
                        e.preventDefault(); // Impede a navegação
                        onMenuClick();      // Executa a função do componente pai
                    }}
      >
        <i className="fa fa-bars"></i>
      </a>

      <ul className="nav user-menu float-right">
        {/* ...notificações... */}

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
            <i className=""></i>
          </a>

          <div className={`dropdown-menu${openProfile ? " show" : ""}`}>
            {profileName !== "Paciente" && (
              <button className="dropdown-item" onClick={() => {
                setProfileName("Paciente");
                setOpenProfile(false);
                navigate("/patientapp");
              }}>
                Paciente
              </button>
            )}
            {profileName !== "Médico" && (
              <button className="dropdown-item" onClick={() => {
                setProfileName("Médico");
                setOpenProfile(false);
                navigate("/doctor");
              }}>
                Médico
              </button>
            )}
             {profileName !== "Admin" && (
               <button className="dropdown-item" onClick={() => {
                 setProfileName("Admin");
                 setOpenProfile(false);
                 navigate("/admin");
               }}>
                 Admin
               </button>
             )}
              {profileName !== "Secretária " && (
               <button className="dropdown-item" onClick={() => {
                 setProfileName("Secretária ");
                 setOpenProfile(false);
                 navigate("/secretaria");
               }}>
                 Secretária
               </button>
             )}

            <hr className="dropdown-divider" />

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