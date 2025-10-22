import { Outlet, NavLink } from "react-router-dom";
import './../../assets/css/index.css'
import Navbar from './../../components/Navbar'
import { useState } from "react";
import Chatbox from '../../components/Chatbox';
import AccessibilityWidget from '../../components/AccessibilityWidget';
import { Link } from "react-router-dom";
import { useResponsive } from '../../utils/useResponsive';

function DoctorApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // 2. Adicione a função para alternar o estado
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // 3. Crie a string de classe que será aplicada dinamicamente
  const mainWrapperClass = isSidebarOpen ? 'main-wrapper sidebar-open' : 'main-wrapper';
  return (
    <div className={mainWrapperClass}>
      <Navbar onMenuClick={toggleSidebar} />
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
                  <i className="fa fa-heart"></i>
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
              <li>
                <Link to="/doctor/doctorexceçao">
                  <i className="fa fa-calendar-times-o" /> <span>Exceções</span>
                </Link>
              </li>
              <li>
                <Link to="/doctor/doctoragenda">
                  <i className="fa fa-calendar" /> <span>Minha Agenda</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="page-wrapper">
        <div className="content">
          <Outlet />
          <AccessibilityWidget />

          <Chatbox />
        </div>
      </div>
    </div>
  );
}

export default DoctorApp;