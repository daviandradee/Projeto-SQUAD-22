import { Outlet, NavLink, useLocation } from "react-router-dom";
import './../../assets/css/index.css'
import Navbar from '../../components/Navbar'
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Chatbox from '../../components/Chatbox';
import AccessibilityWidget from '../../components/AccessibilityWidget';
import { useResponsive } from '../../utils/useResponsive';


function SecretariaApp() {
  // 1. Adicione o estado para controlar a sidebar
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // 2. Adicione a função para alternar o estado
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // 3. Crie a string de classe que será aplicada dinamicamente
    const mainWrapperClass = isSidebarOpen ? 'main-wrapper sidebar-open' : 'main-wrapper';
    
    // Função para verificar se a rota está ativa
    const isActive = (path) => {
      const currentPath = location.pathname;
      
      // Verificação exata primeiro
      if (currentPath === path) return true;
      
      // Verificação de subrotas (ex: /secretaria/pacientelista/edit/123)
      if (currentPath.startsWith(path + '/')) return true;
      
      // Verificações específicas para páginas de edição/criação
      if (path === '/secretaria/pacientelista' && (
          currentPath.includes('/secretaria/pacienteeditar/') || 
          currentPath.includes('/secretaria/pacienteform') 
        )) return true;
        
      if (path === '/secretaria/medicoslista' && (
          currentPath.includes('/secretaria/medicoseditar/') 
        )) return true;
        
      if (path === '/secretaria/secretariaconsultalist' && (
          currentPath.includes('/secretaria/editarconsulta/') || 
          currentPath.includes('/secretaria/adicionarconsulta') ||
          currentPath.includes('/secretaria/consulta/')
        )) return true;
      if (path === '/secretaria/agendamedica' && (
          currentPath.includes('/secretaria/adicionaragenda') 
        )) return true;
      return false;
    };
  return (
    <div className={mainWrapperClass}>
      <Navbar onMenuClick={toggleSidebar} />
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Painel da Secretária</span>
              </li>
              <li className={isActive('/secretaria/secretariadashboard') ? 'active' : ''}>
                <Link to="/secretaria/secretariadashboard">
                  <i className="fa fa-bar-chart-o"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              
              <li className={isActive('/secretaria/secretariaconsultalist') ? 'active' : ''}>
                <Link to="/secretaria/secretariaconsultalist">
                  <i className="fa fa-stethoscope"></i>
                  <span>Consultas</span>
                </Link>
              </li>

              <li className={isActive('/secretaria/pacientelista') ? 'active' : ''}>
                <Link to="/secretaria/pacientelista">
                  <i className="fa fa-users"></i>
                  <span>Pacientes</span>
                </Link>
              </li>

              <li className={isActive('/secretaria/medicoslista') ? 'active' : ''}>
                <Link to="/secretaria/medicoslista">
                  <i className="fa fa-user-md"></i>
                  <span>Médicos</span>
                </Link>
              </li>

              {/* Separador - Agenda */}
              <li className={`${isActive('/secretaria/agendamedica') ? 'active' : ''}`}>
                <Link to="/secretaria/agendamedica">
                  <i className="fa fa-calendar-o"></i>
                  <span>Agenda Médica</span>
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

export default SecretariaApp;