import '../assets/css/index.css'
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div>
            <div className="sidebar" id="sidebar">
                <div className="sidebar-inner slimscroll">
                    <div id="sidebar-menu" className="sidebar-menu">
                        <ul>
                            <li className="menu-title">Main</li>

                            <li>
                                <a href="index-2.html">
                                    <i className="fa fa-dashboard" /> <span>Dashboard</span>
                                </a>
                            </li>

                            <li>
                                <Link to="/doctorlist">
                                    <i className="fa fa-user-md" /> <span>Médicos</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/patientlist">
                                    <i className="fa fa-wheelchair" /> <span>Pacientes</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/calendar">
                                    <i className="fa fa-calendar" /> <span>Calendario</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/doctorschedule">
                                    <i className="fa fa-calendar-check-o" /> <span>Agenda Médica</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/agendalist">
                                    <i className="fa fa-stethoscope" /> <span>Consultas</span>
                                </Link>
                            </li>

                            {/* 🆕 Nova aba Laudo */}
                            <li>
                                <Link to="/laudolist">
                                    <i className="fa fa-file-text" /> <span>Laudos</span>
                                </Link>
                            </li>
                            <li>
                                <a href="settings.html">
                                    <i className="fa fa-cog" /> <span>Configurações</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Sidebar;

