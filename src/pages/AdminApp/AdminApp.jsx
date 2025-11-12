import '../../assets/css/index.css'
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAccessToken } from '../../utils/auth.js';
import { getUserRole } from '../../utils/userInfo.js';
import Sidebar from '../../components/layouts/Sidebar.jsx';




function AdminApp() {
    const token = getAccessToken();
    const user = getUserRole();
    // Verificação de autenticação
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // Verificação de role
    if (user !== 'admin') {
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

export { AdminApp };
export default AdminApp;

