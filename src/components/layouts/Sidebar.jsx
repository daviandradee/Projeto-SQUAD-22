import { getUserRole } from "../../utils/userInfo";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import AccessibilityWidget from "../AccessibilityWidget.jsx";
import Chatbox from "../chat/Chatbox.jsx";
import Navbar from "./Navbar.jsx";
function Sidebar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const role = getUserRole();

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
        if (path === `/${role}/doctorlist` && (
            currentPath.includes(`/${role}/editdoctor/`) ||
            currentPath.includes(`/${role}/doctorform`)
        )) return true;

        if (path === `/${role}/patientlist` && (
            currentPath.includes(`/${role}/editpatient/`) ||
            currentPath.includes(`/${role}/patientform`)
        )) return true;

        if (path === `/${role}/consultalist` && (
            currentPath.includes(`/${role}/consultaform`) ||
            currentPath.includes(`/${role}/editconsulta/`)
        )) return true;

        if (path === `/${role}/createuser` && (
            currentPath.includes(`/${role}/createuser/`)
        )) return true;
        if (path === `/${role}/doctor-exceptions` && (
            currentPath.includes(`/${role}/doctor-exceptions/`)
        )) return true;
        if (path === `/${role}/agendadoctor` && (
            currentPath.includes(`/${role}/editdoctorschedule/`) ||
            currentPath.includes(`/${role}/agendaform`)
        )) return true;
        if (path === `/${role}/laudolist` && (
            currentPath.includes(`/${role}/laudoedit/`) ||
            currentPath.includes(`/${role}/laudo`) ||
            currentPath.includes(`/${role}/laudolist/`)
        )) return true;

        return false;
    };
    const permissoes = {
        admin: ['dashboard', 'consultalist', 'laudolist', 'patientlist', 'doctorlist', 'agendadoctor', 'createuser', 'excecao'],
        medico: ['consultalist', 'dashboard', 'patientlist', 'prontuariolist', 'laudolist', 'excecao', 'agendadoctor', 'doctorcalendar'],
        secretaria: ['dashboard', 'agendadoctor', 'consultalist', 'patientlist', 'doctorlist',],
        paciente: ['dashboard', 'medicosdisponiveis', 'consultalist', 'laudolist', 'agendarconsulta'],

    };
    function temPermissao(role, acao) {
        return permissoes[role]?.includes(acao);
    }
     const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: 'fa-bar-chart-o', path: 'dashboard' },
        { key: 'doctorlist', label: 'Médicos', icon: 'fa-user-md', path: 'doctorlist' },
        { key: 'patientlist', label: 'Pacientes', icon: 'fa-wheelchair', path: 'patientlist' },
        { key: 'calendar', label: 'Calendario', icon: 'fa-calendar', path: 'calendar' },
        { key: 'agendadoctor', label: 'Agenda Médica', icon: 'fa-clock-o', path: 'agendadoctor' },
        { key: 'consultalist', label: 'Consultas', icon: 'fa-stethoscope', path: 'consultalist' },
        { key: 'laudolist', label: 'Laudos', icon: 'fa-file-text-o', path: 'laudolist' },
        { key: 'createuser', label: 'Usuários', icon: 'fa-users', path: 'createuser' },
        { key: 'excecao', label: 'Exceções do Médico', icon: 'fa-calendar-times-o', path: 'excecao' },
        { key: 'medicosdisponiveis', label: 'Agendar Consultas', icon: 'fa fa-calendar-plus-o', path: 'medicosdisponiveis' },
        { key: 'doctorcalendar', label: 'Calendário', icon: 'fa fa-calendar', path: 'doctorcalendar' },
    ];
    return (
        <div>
            <div className={mainWrapperClass}>
                <Navbar onMenuClick={toggleSidebar} />
                <div className="sidebar" id="sidebar">
                    <div className="sidebar-inner slimscroll">
                        <div id="sidebar-menu" className="sidebar-menu">
                            <ul>
                                
                                <li className="menu-title"> Painel da {role}</li>

                                {/* ✅ CORRIGIR: Map correto com return */}
                                {menuItems
                                    .filter(item => temPermissao(role, item.key))
                                    .map(item => (
                                        <li key={item.key} className={isActive(`/${role}/${item.path}`) ? 'active' : ''}>
                                            <Link to={`/${role}/${item.path}`}>
                                                <i className={`fa ${item.icon}`} /> <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <AccessibilityWidget />
                    <Chatbox />
                </div>
            </div>
        </div >
    
    );
}
export default Sidebar;