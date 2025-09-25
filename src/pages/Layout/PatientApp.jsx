import { Outlet, NavLink } from "react-router-dom";
import "../../assets/css/index.css";
import Navbar from './../../components/Navbar'

export default function PatientApp() {
  return (
    <div className="main-wrapper">
        <Navbar />

      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Painel do Paciente</span>
              </li>

              <li>
                <NavLink
                  to="/patientapp"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-bar-chart"></i>
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/patientapp/meuexame"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-stethoscope"></i>
                  <span>Meus exames</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/patientapp/minhasconsultas"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-calendar-check-o"></i>
                  <span>Minhas Consultas</span>
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