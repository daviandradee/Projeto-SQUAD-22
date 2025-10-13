import { Outlet, NavLink } from "react-router-dom";
import "../../assets/css/index.css";
import Navbar from './../../components/Navbar'
import { useState } from "react";
import Chatbox from '../../components/Chatbox';
import AccessibilityWidget from '../../components/AccessibilityWidget';


export default function PatientApp() {
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
              
              {/* NOVO ITEM - AGENDAR CONSULTA */}
              <li>
                <NavLink
                  to="/patientapp/medicosdisponiveis"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <i className="fa fa-calendar-plus-o"></i>
                  <span>Agendar Consulta</span>
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
          <AccessibilityWidget />
          
          <Chatbox />
        </div>
      </div>
    </div>
  );
}