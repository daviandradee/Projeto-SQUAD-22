// ...existing imports...
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../assets/css/index.css"
import { Link } from "react-router-dom";

function Navbar() {
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
    } else {
      // Rota de login ou outras rotas
      setProfileName("Admin");
    }
  }, [location.pathname]);

  const goToOtherRole = () => {
    if (isDoctor) navigate("/");
    else navigate("/doctor");
    setOpenProfile(false);
  };

  // Novo handler para paciente
  const handlePacienteClick = () => {
    setProfileName("Paciente");
    setOpenProfile(false);
    navigate("/patientapp");
  };


  return (
    <div className="header">
      <div className="header-left">
        {/* Logo dinâmica */}
        <Link to={isDoctor ? "/doctor" : "/admin"} className="logo">
          <img src="/img/logomedconnect.png" width="35" height="35" alt="" />{" "}
          <span>MediConnect</span>
        </Link>
      </div>

      <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar">
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
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;