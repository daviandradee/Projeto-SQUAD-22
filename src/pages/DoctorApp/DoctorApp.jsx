import { Outlet, NavLink } from "react-router-dom";
import "../../assets/css/index.css";

function DoctorApp() {
  return (
    <div className="main-wrapper">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <a href="/" className="logo">
            <img src="/img/logomedconnect.png" width="35" height="35" alt="" />
            <span>MediConnect</span>
          </a>
        </div>

        <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar">
          <i className="fa fa-bars"></i>
        </a>

        <ul className="nav user-menu float-right">
          <li className="nav-item dropdown has-arrow">
            <a
              href="#!"
              className="dropdown-toggle nav-link user-link"
              data-toggle="dropdown"
            >
              <span className="user-img">
                <span className="status online"></span>
              </span>
              <span>Médico</span>
            </a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#profile">
                Meu Perfil
              </a>
              <a className="dropdown-item" href="#settings">
                Configurações
              </a>
              <a className="dropdown-item" href="#logout">
                Sair
              </a>
            </div>
          </li>
        </ul>
      </div>

      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Painel do Médico</span>
              </li>

              <li>
                <NavLink
                     to="/doctor/patients"
                     className={({ isActive }) => (isActive ? "active" : "")}
  >
                     <i className="fa fa-users"></i>
                     <span>Pacientes</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/doctor/calendar"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-calendar"></i>
                  <span>Calendário</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/doctor/dashboard"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-bar-chart"></i>
                  <span>Dashboard</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="page-wrapper">
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DoctorApp;
