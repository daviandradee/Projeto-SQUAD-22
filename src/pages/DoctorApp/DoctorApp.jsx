import { Outlet, NavLink, useLocation } from "react-router-dom";
import './../../assets/css/index.css'
import Navbar from '../../components/layouts/Navbar'
import { useState } from "react";
import Chatbox from '../../components/chat/Chatbox';
import AccessibilityWidget from '../../components/AccessibilityWidget';
import { Link } from "react-router-dom";
import { useResponsive } from '../../utils/useResponsive';
import { getAccessToken } from '../../utils/auth.js';
import { getUserRole } from '../../utils/userInfo.js';
import { Navigate } from 'react-router-dom';
import Sidebar from "../../components/layouts/Sidebar.jsx";

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
  const token = getAccessToken();
      const user = getUserRole();
      // Verificação de autenticação
      if (!token) {
          return <Navigate to="/login" replace />;
      }
      
      // Verificação de role
      if (user !== 'medico') {
          return (
              <div className="page-wrapper">
                  <div className="content">
                      <div className="alert alert-danger text-center">
                          <h4>❌ Acesso Negado</h4>
                          <p>Apenas médicos podem acessar esta área.</p>
                          <button 
                              className="btn btn-primary" 
                              onClick={() => window.history.back()}
                          >
                              Voltar
                          </button>
                      </div>
                  </div>
              </div>
          );
      }
  return (
    <div>
      <Sidebar />
          <Outlet />
        </div>
  );
}

export default DoctorApp;