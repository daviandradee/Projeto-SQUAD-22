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
                                    <i className="fa fa-user-md" /> <span>Doutores</span>
                                </Link>
                            </li>

                            <li className="">
                                <Link to= "/patientlist">
                                    <i className="fa fa-wheelchair" /> <span>Pacientes</span>
                                </Link>
                            </li>

                            <li className="">
                                <Link to= "/calendar">
                                    <i className="fa fa-calendar" /> <span>Calendario</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/doctorschedule">
                                    <i className="fa fa-calendar-check-o" /> <span>Agenda Médica</span>
                                </Link>
                            </li>

                            <li>
                                <a href="departments.html">
                                    <i className="fa fa-hospital-o" /> <span>Departamentos</span>
                                </a>
                            </li>

                            <li className="submenu">
                                <a href="#">
                                    <i className="fa fa-video-camera camera" /> <span>Calls</span>{" "}
                                    <span className="menu-arrow" />
                                </a>
                                <ul style={{ display: "none" }}>
                                    <li>
                                        <a href="voice-call.html">Voice Call</a>
                                    </li>
                                    <li>
                                        <a href="video-call.html">Video Call</a>
                                    </li>
                                    <li>
                                        <a href="incoming-call.html">Incoming Call</a>
                                    </li>
                                </ul>
                            </li>

                            <li className="submenu">
                                <a href="#">
                                    <i className="fa fa-envelope" /> <span>Email</span>{" "}
                                    <span className="menu-arrow" />
                                </a>
                                <ul style={{ display: "none" }}>
                                    <li>
                                        <a href="compose.html">Compose Mail</a>
                                    </li>
                                    <li>
                                        <a href="inbox.html">Inbox</a>
                                    </li>
                                    <li>
                                        <a href="mail-view.html">Mail View</a>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <a href="activities.html">
                                    <i className="fa fa-bell-o" /> <span>Atividades</span>
                                </a>
                            </li>

                            <li className="submenu">
                                <a href="#">
                                    <i className="fa fa-flag-o" /> <span>Reportar</span>{" "}
                                    <span className="menu-arrow" />
                                </a>
                                <ul style={{ display: "none" }}>
                                    <li>
                                        <a href="expense-reports.html">Expense Report</a>
                                    </li>
                                    <li>
                                        <a href="invoice-reports.html">Invoice Report</a>
                                    </li>
                                </ul>
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
export default Sidebar
