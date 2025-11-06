import { Outlet, NavLink, useLocation } from "react-router-dom";
import './../../assets/css/index.css'
import Navbar from './../../components/Navbar'
import { useState } from "react";
import Chatbox from '../../components/Chatbox';
import AccessibilityWidget from '../../components/AccessibilityWidget';
import { Link } from "react-router-dom";
import { useResponsive } from '../../utils/useResponsive';

function DoctorApp() {
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
    
    // Verificação de subrotas (ex: /doctor/patients/edit/123)
    if (currentPath.startsWith(path + '/')) return true;
    
    // Verificações específicas para páginas de edição/criação
    if (path === '/doctor/patients' && (
        currentPath.includes('/doctor/editpatient/') || 
        currentPath.includes('/doctor/patientform') ||
        currentPath.includes('/doctor/patient/')
      )) return true;
      
    if (path === '/doctor/prontuariolist' && (
        currentPath.includes('/doctor/prontuario/') || 
        currentPath.includes('/doctor/editprontuario/') ||
        currentPath.includes('/doctor/prontuarioform')
      )) return true;
      
    if (path === '/doctor/consultas' && (
        currentPath.includes('/doctor/consulta/') || 
        currentPath.includes('/doctor/editconsulta/') ||
        currentPath.includes('/doctor/consultaform')
      )) return true;
      
    if (path === '/doctor/laudolist' && (
        currentPath.includes('/doctor/laudo/') || 
        currentPath.includes('/doctor/editlaudo/') ||
        currentPath.includes('/doctor/laudoform')
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
                <span>Painel do Médico</span>
              </li>
              <li className={isActive('/doctor/dashboard') ? 'active' : ''}>
                <Link to="/doctor/dashboard">
                  <i className="fa fa-bar-chart-o"></i>
                  <span>Dashboard</span>
                </Link>
              </li>

              <li className={isActive('/doctor/patients') ? 'active' : ''}>
                <Link to="/doctor/patients">
                  <i className="fa fa-users"></i>
                  <span>Pacientes</span>
                </Link>
              </li>

              <li className={isActive('/doctor/prontuariolist') ? 'active' : ''}>
                <Link to="/doctor/prontuariolist">
                  <i className="fa fa-heart-o"></i>
                  <span>Prontuário</span>
                </Link>
              </li>

              <li className={isActive('/doctor/calendar') ? 'active' : ''}>
                <Link to="/doctor/calendar">
                  <i className="fa fa-calendar-o"></i>
                  <span>Calendário</span>
                </Link>
              </li>
              
              <li className={isActive('/doctor/consultas') ? 'active' : ''}>
                <Link to="/doctor/consultas">
                  <i className="fa fa-stethoscope"></i>
                  <span>Consultas</span>
                </Link>
              </li>
              {/* Separador - Gerenciamento */}
              <li className={`${isActive('/doctor/laudolist') ? 'active' : ''}`}>
                <Link to="/doctor/laudolist">
                  <i className="fa fa-file-text-o"></i>
                  <span>Laudos</span>
                </Link>
              </li>
              
              {/* Separador - Configurações */}
              <li className={`${isActive('/doctor/doctorexceçao') ? 'active' : ''}`}>
                <Link to="/doctor/doctorexceçao">
                  <i className="fa fa-calendar-times-o" /> <span>Exceções</span>
                </Link>
              </li>
              <li className={isActive('/doctor/doctoragenda') ? 'active' : ''}>
                <Link to="/doctor/doctoragenda">
                  <i className="fa fa-calendar-check-o" /> <span>Minha Agenda</span>
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