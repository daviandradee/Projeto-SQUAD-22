import { Outlet, NavLink, useLocation } from "react-router-dom";
import './../../assets/css/index.css'
import Navbar from '../../components/layouts/Navbar'
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Chatbox from '../../components/chat/Chatbox';
import AccessibilityWidget from '../../components/AccessibilityWidget';
import { useResponsive } from '../../utils/useResponsive';
import { getAccessToken } from '../../utils/auth.js';
import { getUserRole } from '../../utils/userInfo.js';
import { Navigate } from 'react-router-dom';
import Sidebar from "../../components/layouts/Sidebar.jsx";


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
  const token = getAccessToken();
  const user = getUserRole();
  // Verificação de autenticação
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Verificação de role
  if (user !== 'secretaria') {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger text-center">
            <h4>❌ Acesso Negado</h4>
            <p>Apenas secretárias podem acessar esta área.</p>
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

export default SecretariaApp;