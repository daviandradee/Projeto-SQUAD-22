import { Outlet, NavLink } from "react-router-dom";
import './../../assets/css/index.css'
import Navbar from '../../components/Navbar'

function SecretariaApp() {
  return (
    <div className="main-wrapper">
      <Navbar />
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Painel da Secretária</span>
              </li>
              <li>
                <NavLink
                  to="/secretaria/secretariadashboard"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-bar-chart"></i>
                  <span>DashBoard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/secretaria/secretariaconsultalist"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-stethoscope"></i>
                  <span>Consultas</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/secretaria/pacientelista"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-users"></i>
                  <span>Pacientes</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/secretaria/medicoslista"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-user-md"></i>
                  <span>Médicos</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/secretaria/agendamedica"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-calendar"></i>
                  <span>Agenda Médica</span>
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

export default SecretariaApp;