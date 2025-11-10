import { Outlet, NavLink, useLocation } from "react-router-dom";
import './../../assets/css/index.css'
import { useState } from "react";
import { getAccessToken} from "../../utils/auth";
import { getUserRole } from '../../utils/userInfo.js';
import Sidebar from "../../components/layouts/Sidebar.jsx";

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
  const token = getAccessToken();
      const user = getUserRole();
      // Verificação de autenticação
      if (!token) {
          return <Navigate to="/" replace />;
      }
      
      // Verificação de role
      if (user !== 'paciente') {
          return (
              <div className="page-wrapper">
                  <div className="content">
                      <div className="alert alert-danger text-center">
                          <h4>❌ Acesso Negado</h4>
                          <p>Apenas administradores podem acessar esta área.</p>
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