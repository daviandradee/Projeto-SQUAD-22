import { Outlet, NavLink, useLocation } from "react-router-dom";
import "../../assets/css/index.css";
import Navbar from './../../components/Navbar'
import { useState } from "react";
import { Link } from "react-router-dom";
import Chatbox from '../../components/Chatbox';
import AccessibilityWidget from '../../components/AccessibilityWidget';



export default function PatientApp() {
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
    
    // Verificação de subrotas (ex: /patientapp/meuslaudos/view/123)
    if (currentPath.startsWith(path + '/')) return true;
    
    // Verificações específicas para páginas de edição/criação
    if (path === '/patientapp/medicosdisponiveis' && (
        currentPath.includes('/patientapp/agendar/') || 
        currentPath.includes('/patientapp/consultaform')
      )) return true;
      
    if (path === '/patientapp/minhasconsultas' && (
        currentPath.includes('/patientapp/consulta/') || 
        currentPath.includes('/patientapp/editconsulta/')
      )) return true;
      
    if (path === '/patientapp/meuslaudos' && (
        currentPath.includes('/patientapp/laudo/') || 
        currentPath.includes('/patientapp/viewlaudo/')
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
                <span>Painel do Paciente</span>
              </li>

              <li className={isActive('/patientapp') && location.pathname === '/patientapp' ? 'active' : ''}>
                <Link to="/patientapp">
                  <i className="fa fa-bar-chart-o"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              
              <li className={isActive('/patientapp/medicosdisponiveis') ? 'active' : ''}>
                <Link to="/patientapp/medicosdisponiveis">
                  <i className="fa fa-calendar-plus-o"></i>
                  <span>Agendar Consulta</span>
                </Link>
              </li>

              {/* Separador - Meus Dados */}
              <li className={`separator ${isActive('/patientapp/meuslaudos') ? 'active' : ''}`}>
                <Link to="/patientapp/meuslaudos">
                  <i className="fa fa-file-text-o"></i>
                  <span>Meus Laudos</span>
                </Link>
              </li>

              <li className={isActive('/patientapp/minhasconsultas') ? 'active' : ''}>
                <Link to="/patientapp/minhasconsultas">
                  <i className="fa fa-calendar-check-o"></i>
                  <span>Minhas Consultas</span>
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