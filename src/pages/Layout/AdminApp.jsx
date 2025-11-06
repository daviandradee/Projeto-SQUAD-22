import '../../assets/css/index.css'
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Outlet } from 'react-router-dom';
import Chatbox from '../../components/Chatbox';
import AccessibilityWidget from '../../components/AccessibilityWidget';
import { useResponsive } from '../../utils/useResponsive';




function Sidebar() {
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
      
      // Verificação de subrotas (ex: /admin/doctorlist/edit/123)
      if (currentPath.startsWith(path + '/')) return true;
      
      // Verificações específicas para páginas de edição/criação
      if (path === '/admin/doctorlist' && (
          currentPath.includes('/admin/editdoctor/') || 
          currentPath.includes('/admin/doctorform') ||
          currentPath.includes('/admin/doctor/')
        )) return true;
        
      if (path === '/admin/patientlist' && (
          currentPath.includes('/admin/editpatient/') || 
          currentPath.includes('/admin/patient') 
        )) return true;
        
      if (path === '/admin/agendalist' && (
          currentPath.includes('/admin/agendaform') || 
          currentPath.includes('/admin/editagenda/') ||
          currentPath.includes('/admin/agenda/')
        )) return true;
        
      if (path === '/admin/roles' && (
          currentPath.includes('/admin/editrole/') || 
          currentPath.includes('/admin/roleform') ||
          currentPath.includes('/admin/role/')
        )) return true;
    if (path === '/admin/doctor-exceptions' && (
        currentPath.includes('/admin/doctor-exceptions/') 
      )) return true;
    if (path === '/admin/doctorschedule' && (
        currentPath.includes('/admin/editdoctorschedule/') || 
        currentPath.includes('/admin/doctorscheduleform') ||
        currentPath.includes('/admin/doctorschedule/')
      )) return true;
    if (path === '/admin/laudolist' && (
        currentPath.includes('/admin/laudoedit/') || 
        currentPath.includes('/admin/laudo') ||
        currentPath.includes('/admin/laudolist/')
      )) return true;

      return false;
    };
    return (
        <div>
            <div className={mainWrapperClass}>
                <Navbar onMenuClick={toggleSidebar} />
                <div className="sidebar" id="sidebar">
                    <div className="sidebar-inner slimscroll">
                        <div id="sidebar-menu" className="sidebar-menu">
                            <ul>
                                <li className="menu-title">Painel Administrador</li>

                                <li className={isActive('/admin/dashboard') ? 'active' : ''}>
                                    <Link to="/admin/dashboard">
                                        <i className="fa fa-bar-chart-o" /> <span>Dashboard</span>
                                    </Link>
                                </li>

                                <li className={isActive('/admin/doctorlist') ? 'active' : ''}>
                                    <Link to="/admin/doctorlist">
                                        <i className="fa fa-user-md" /> <span>Médicos</span>
                                    </Link>
                                </li>

                                <li className={isActive('/admin/patientlist') ? 'active' : ''}>
                                    <Link to="/admin/patientlist">
                                        <i className="fa fa-wheelchair" /> <span>Pacientes</span>
                                    </Link>
                                </li>

                                <li className={isActive('/admin/calendar') ? 'active' : ''}>
                                    <Link to="/admin/calendar">
                                        <i className="fa fa-calendar" /> <span>Calendario</span>
                                    </Link>
                                </li>

                                <li className={isActive('/admin/doctorschedule') ? 'active' : ''}>
                                    <Link to="/admin/doctorschedule">
                                        <i className="fa fa-clock-o" /> <span>Agenda Médica</span>
                                    </Link>
                                </li>

                                <li className={isActive('/admin/agendalist') ? 'active' : ''}>
                                    <Link to="/admin/agendalist">
                                        <i className="fa fa-stethoscope" /> <span>Consultas</span>
                                    </Link>
                                </li>

                                {/* Separador - Gerenciamento */}
                                <li className={`${isActive('/admin/laudolist') ? 'active' : ''}`}>
                                    <Link to="/admin/laudolist">
                                        <i className="fa fa-file-text-o" /> <span>Laudos</span>
                                    </Link>
                                </li>
                                <li className={isActive('/admin/roles') ? 'active' : ''}>
                                    <Link to="/admin/roles">
                                        <i className="fa fa-users" /><span> Usuários</span>
                                    </Link>
                                </li>

                                {/* Separador - Configurações */}
                                <li className={`${isActive('/admin/doctor-exceptions') ? 'active' : ''}`}>
                                    <Link to="/admin/doctor-exceptions">
                                        <i className="fa fa-calendar-times-o" /> <span>Exceções do Médico</span>
                                    </Link>
                                </li>

                                {/*<li>
                                <a href="settings.html">
                                    <i className="fa fa-cog" /> <span>Configurações</span>
                                </a>
                            </li>*/}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
            <AccessibilityWidget />

            <Chatbox />
        </div>
    );
}
export default Sidebar;

