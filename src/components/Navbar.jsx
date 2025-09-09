// src/components/Navbar.jsx
import "../assets/css/index.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const isDoctor = location.pathname.startsWith("/doctor");
  const profileName = isDoctor ? "Médico" : "Admin";

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

  const goToOtherRole = () => {
    if (isDoctor) navigate("/");
    else navigate("/doctor");
    setOpenProfile(false);
  };

  return (
    <div className="header">
      <div className="header-left">
        {/* Logo dinâmica */}
        <Link to={isDoctor ? "/doctor" : "/"} className="logo">
          <img src="public/img/logomedconnect.png" width="35" height="35" alt="" />{" "}
          <span>MediConnect</span>
        </Link>
      </div>

      <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar">
        <i className="fa fa-bars"></i>
      </a>

      <ul className="nav user-menu float-right">
        {/* 🔔 Notificações */}
        <li className="nav-item dropdown d-none d-sm-block" ref={notifRef}>
          <a
            href="#!"
            className="dropdown-toggle nav-link"
            onClick={(e) => {
              e.preventDefault();
              setOpenNotif((v) => !v);
              setOpenProfile(false);
            }}
          >
            <i className="fa fa-bell-o"></i>
            <span className="badge badge-pill bg-danger float-right">2</span>
          </a>
          <div className={`dropdown-menu notifications${openNotif ? " show" : ""}`}>
            <div className="topnav-dropdown-header">
              <span>Cadastrado</span>
            </div>
            {/* Aqui você pode listar notificações reais */}
            <div className="topnav-dropdown-footer">
              <a href="#!">Mensagem</a>
            </div>
          </div>
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
            <i className="fa fa-angle-down ml-1"></i>
          </a>

          <div className={`dropdown-menu${openProfile ? " show" : ""}`}>
            {/* Opções padrão */}
            <a className="dropdown-item" href="#!">
              Paciente
            </a>

            <div className="dropdown-divider"></div>

            {/* Troca de perfil */}
            <button className="dropdown-item" onClick={goToOtherRole}>
              {isDoctor ? "Admin" : "Médico"}
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;

