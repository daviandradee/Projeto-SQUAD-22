import '../../assets/css/index.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Outlet } from 'react-router-dom';
import Chatbox from '../../components/Chatbox';





function Sidebar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // 2. Adicione a função para alternar o estado
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // 3. Crie a string de classe que será aplicada dinamicamente
    const mainWrapperClass = isSidebarOpen ? 'main-wrapper sidebar-open' : 'main-wrapper';
    return (
        <div>
            <div className={mainWrapperClass}>
                <Navbar onMenuClick={toggleSidebar} />
                <div className="sidebar" id="sidebar">
                    <div className="sidebar-inner slimscroll">
                        <div id="sidebar-menu" className="sidebar-menu">
                            <ul>
                                <li className="menu-title">Painel Administrador</li>

                                <li>
                                    <Link to="/admin/dashboard">
                                        <i className="fa fa-bar-chart" /> <span>Dashboard</span>
                                    </Link>
                                </li>
                                
                                <li>
                                    <Link to="/admin/doctorlist">
                                        <i className="fa fa-user-md" /> <span>Médicos</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/patientlist">
                                        <i className="fa fa-wheelchair" /> <span>Pacientes</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/calendar">
                                        <i className="fa fa-calendar" /> <span>Calendario</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/doctorschedule">
                                        <i className="fa fa-calendar-check-o" /> <span>Agenda Médica</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/agendalist">
                                        <i className="fa fa-stethoscope" /> <span>Consultas</span>
                                    </Link>
                                </li>

                                {/* 🆕 Nova aba Laudo */}
                                <li>
                                    <Link to="/admin/laudolist">
                                        <i className="fa fa-file-text" /> <span>Laudos</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/roles">
                                    <i className="fa fa-users" /><span> Usuários</span>
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
                <Chatbox />
        </div>
    );
}
export default Sidebar;

