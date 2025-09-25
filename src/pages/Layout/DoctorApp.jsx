import { Outlet, NavLink } from "react-router-dom";
import './../../assets/css/index.css'
import Navbar from './../../components/Navbar'

function DoctorApp() {
  return (
    <div className="main-wrapper">
      <Navbar />
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
                  to="/doctor/dashboard"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-bar-chart"></i>
                  <span>Dashboard</span>
                </NavLink>
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
                  to="/doctor/prontuariolist"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-file-medical"></i>
                  <span>Prontuário</span>
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
                  to="/doctor/consultas"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-stethoscope"></i>
                  <span>Consultas</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/doctor/laudolist"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-file-text"></i>
                  <span>Laudos</span>
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