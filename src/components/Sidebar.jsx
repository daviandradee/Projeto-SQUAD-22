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
                                <Link to="/app/doctorlist">
                                    <i className="fa fa-user-md" /> <span>Médicos</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/app/patientlist">
                                    <i className="fa fa-wheelchair" /> <span>Pacientes</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/app/calendar">
                                    <i className="fa fa-calendar" /> <span>Calendário</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/app/doctorschedule">
                                    <i className="fa fa-calendar-check-o" /> <span>Agenda Médica</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/app/agendalist">
                                    <i className="fa fa-stethoscope" /> <span>Consultas</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/app/laudolist">
                                    <i className="fa fa-file-text" /> <span>Laudos</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Sidebar;
