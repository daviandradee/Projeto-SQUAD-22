import "../assets/css/index.css"

function Navbar(){
    return(
        <div className="header">
                <div className="header-left">
                    <a href="index-2.html" className="logo">
                        <img src="public/img/logoof.png" width="35" height="35" alt="" />{" "}
                        <span>MediConnect</span>
                    </a>
                </div>
                <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar">
                    <i className="fa fa-bars"></i>
                </a>
                <ul className="nav user-menu float-right">
                    <li className="nav-item dropdown d-none d-sm-block">
                        <a
                            href="#!"
                            className="dropdown-toggle nav-link"
                            data-toggle="dropdown"
                        >
                            <i className="fa fa-bell-o"></i>
                            <span className="badge badge-pill bg-danger float-right">3</span>
                        </a>
                        <div className="dropdown-menu notifications">
                            <div className="topnav-dropdown-header">
                                <span>Notifications</span>
                            </div>
                            <div className="topnav-dropdown-footer">
                                <a href="activities.html">View all Notifications</a>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item dropdown has-arrow">
                        <a
                            href="#!"
                            className="dropdown-toggle nav-link user-link"
                            data-toggle="dropdown"
                        >
                            <span className="user-img">
                                <span className="status online"></span>
                            </span>
                            <span>Admin</span>
                        </a>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="profile.html">
                                My Profile
                            </a>
                            <a className="dropdown-item" href="edit-profile.html">
                                Edit Profile
                            </a>
                            <a className="dropdown-item" href="settings.html">
                                Settings
                            </a>
                            <a className="dropdown-item" href="login.html">
                                Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
    )
}
export default Navbar