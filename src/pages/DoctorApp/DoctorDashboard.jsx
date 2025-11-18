import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/auth.js";
import "../../assets/css/index.css"; 
import { getFullName, getUserId } from "../../utils/userInfo";
import { getUserRole } from "../../utils/userInfo";
const AvatarForm = "/img/AvatarForm.jpg";
const banner = "/img/banner.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { Bar as ChartJSBar } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentConsults, setRecentConsults] = useState([]);
  const [followUpPatients, setFollowUpPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [draftReports, setDraftReports] = useState([]);
  // Estados para os gráficos médicos
  
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previewUrl, setPreviewUrl] = useState(AvatarForm);

  const tokenUsuario = getAccessToken();
  const userId = getUserId();
  const role = getUserRole();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const requestOptions = {
    method: "GET",
    headers: {
      apikey: supabaseAK,
      Authorization: `Bearer ${tokenUsuario}`,
    },
    redirect: "follow",
  };

  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        setLoading(true);
        
        // Buscar pacientes
        const patientsResponse = await fetch(
          `${supabaseUrl}/rest/v1/patients`,
          requestOptions
        );
        const patientsData = await patientsResponse.json();
        const patientsArr = Array.isArray(patientsData) ? patientsData : [];
        setPatients(patientsArr);

        // Buscar consultas do médico (filtrar pelo doctor_id se disponível)
        const appointmentsResponse = await fetch(
          `${supabaseUrl}/rest/v1/appointments`,
          requestOptions
        );
        const appointmentsData = await appointmentsResponse.json();
        const appointmentsArr = Array.isArray(appointmentsData) ? appointmentsData : [];
        setAppointments(appointmentsArr);

        // Buscar laudos em draft
        const reportsResponse = await fetch(
          `${supabaseUrl}/rest/v1/reports?status=eq.draft`,
          requestOptions
        );
        const reportsData = await reportsResponse.json();
        const reportsArr = Array.isArray(reportsData) ? reportsData : [];
        setDraftReports(reportsArr);
        
        // Processar dados específicos do médico
        processTodayAppointments(appointmentsArr, patientsArr);
        processRecentConsults(appointmentsArr, patientsArr);
        processFollowUpPatients(appointmentsArr, patientsArr);
        processConsultasMensais(appointmentsArr);
        processComparecimentoData(appointmentsArr);
        processAlerts(appointmentsArr, reportsArr);
        
      } catch (error) {
        console.error('Erro ao carregar dados do médico:', error);
      } finally {
        setLoading(false);
      }
    };

    // Inject custom CSS for DoctorDashboard
    const styleId = 'doctor-dashboard-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        [data-dashboard="doctor"] .custom-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }
        [data-dashboard="doctor"] .status-green {
          background-color: #e8f5e8;
          color: #2e7d32;
          border: 1px solid #c8e6c9;
        }
        [data-dashboard="doctor"] .status-yellow {
          background-color: #fff8e1;
          color: #f57f17;
          border: 1px solid #ffecb3;
        }
        [data-dashboard="doctor"] .status-red {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }
      `;
      document.head.appendChild(style);
    }

    loadDoctorData();
  }, []);

  // useEffect para atualizar o relógio em tempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Atualiza a cada segundo

    return () => clearInterval(timer); // Limpa o timer quando o componente é desmontado
  }, []);

  // useEffect para carregar avatar do usuário (mesma lógica da navbar)
  useEffect(() => {
    const loadAvatar = async () => {
      if (!userId) return;

      const myHeaders = new Headers();
      myHeaders.append("apikey", supabaseAK);
      myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

      const requestOptions = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
      };

      try {
        const response = await fetch(`${supabaseUrl}/storage/v1/object/avatars/${userId}/avatar.png`, requestOptions);
        
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setPreviewUrl(imageUrl);
          return; // Avatar encontrado
        }
      } catch (error) {
      
      }
      
      // Se chegou até aqui, não encontrou avatar - mantém o padrão
     
    };

    loadAvatar();
  }, [userId]);

  // Processar agenda do dia
  const processTodayAppointments = (appointmentsData, patientsData) => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointmentsData.filter(apt => {
      if (!apt.scheduled_at) return false;
      const aptDate = apt.scheduled_at.split('T')[0];
      return aptDate === today;
    });

    const todayWithPatients = todayAppts.map(apt => {
      const patient = patientsData.find(p => p.id === apt.patient_id);
      return {
        ...apt,
        patient_name: patient?.name || patient?.full_name || 'Paciente não encontrado',
        time: apt.scheduled_at ? apt.scheduled_at.split('T')[1].substring(0, 5) : ''
      };
    }).sort((a, b) => a.time.localeCompare(b.time));

    setTodayAppointments(todayWithPatients);
  };

  // Processar consultas recentes
  const processRecentConsults = (appointmentsData, patientsData) => {
    const recent = appointmentsData
      .filter(apt => apt.scheduled_at && new Date(apt.scheduled_at) < new Date())
      .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
      .slice(0, 5)
      .map(apt => {
        const patient = patientsData.find(p => p.id === apt.patient_id);
        return {
          ...apt,
          patient_name: patient?.name || patient?.full_name || 'Paciente não encontrado',
          date: apt.scheduled_at ? new Date(apt.scheduled_at).toLocaleDateString('pt-BR') : ''
        };
      });

    setRecentConsults(recent);
  };

  // Processar pacientes em acompanhamento
  const processFollowUpPatients = (appointmentsData, patientsData) => {
    // Selecionar pacientes com consultas recorrentes ou em tratamento
    const followUp = patientsData.slice(0, 10);
    setFollowUpPatients(followUp);
  };

  // Processar dados de consultas mensais
  const processConsultasMensais = (appointmentsData) => {
    // Lógica para processar consultas mensais para gráficos
    // Implementar conforme necessário
  };

  // Processar dados de comparecimento
  const processComparecimentoData = (appointmentsData) => {
    // Lógica para processar dados de comparecimento
    // Implementar conforme necessário
  };

  // Processar alertas
  const processAlerts = (appointmentsData, reportsData = []) => {
    const alertsArray = [];
    
    // Verificar laudos em draft
    if (reportsData.length > 0) {
      alertsArray.push({
        message: `${reportsData.length} laudo${reportsData.length > 1 ? 's' : ''} pendente${reportsData.length > 1 ? 's' : ''} de confirmação`,
        type: 'warning',
        icon: 'fa-file-text-o',
        action: 'Confirmar',
        link: '/doctor/reports'
      });
    }
    
    // Verificar consultas próximas (próximas 2 horas)
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    appointmentsData.forEach(apt => {
      if (apt.scheduled_at) {
        const aptDate = new Date(apt.scheduled_at);
        if (aptDate > now && aptDate <= twoHoursLater) {
          alertsArray.push({
            message: `Consulta em ${Math.round((aptDate - now) / (1000 * 60))} minutos`,
            type: 'warning',
            icon: 'fa-clock-o',
            action: 'Ver',
            link: '/doctor/appointments'
          });
        }
      }
    });

    // Adicionar outros alertas conforme necessário
    if (alertsArray.length === 0) {
      alertsArray.push({
        message: 'Nenhum alerta no momento',
        type: 'info',
        icon: 'fa-info-circle',
        action: 'OK'
      });
    }
    
    setAlerts(alertsArray);
  };
  return (
    <div className="page-wrapper" data-dashboard="doctor">
      <div className="content">
        {/* Header com informações do médico */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <div className="user-info-banner" style={{
                background: `linear-gradient(135deg, rgba(74, 144, 226, 0.9), rgba(80, 200, 120, 0.9)), url(${banner})`,
                backgroundSize: 'cover',
                borderRadius: '15px',
                padding: '30px',
                color: 'white',
                marginBottom: '20px'
              }}>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="mb-2">👨‍⚕️ Olá, Dr. {getFullName()}!</h2>
                    <p className="mb-2">Hoje é mais um dia para transformar vidas. Revise sua agenda, acompanhe seus pacientes e siga fazendo a diferença com o MediConnect. 💙!</p>
                    <small className="opacity-75">
                      🕒 {currentTime.toLocaleString('pt-BR')}
                    </small>
                  </div>
                  <div className="col-md-4 text-right">
                    <img 
                      src={previewUrl} 
                      alt="Avatar" 
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', border: '3px solid white' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="row">
          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg1">
                <i className="fa fa-calendar-check-o" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{todayAppointments.length}</h3>
                <span className="widget-title1">Consultas Hoje</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg2">
                <i className="fa fa-users" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{patients.length}</h3>
                <span className="widget-title2">Total Pacientes</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg3">
                <i className="fa fa-file-text-o" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{draftReports.length}</h3>
                <span className="widget-title3">Laudos Pendentes</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg4">
                <i className="fa fa-bell" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{alerts.length}</h3>
                <span className="widget-title4">Notificações</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 col-sm-6 mb-3">
                    <Link to={`/${role}/consultaform`} className="btn btn-outline-primary btn-lg w-100" style={{ borderRadius: '10px' }}>
                      <i className="fa fa-calendar-plus-o mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                      Nova Consulta
                    </Link>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-3">
                    <Link to={`/${role}/patientlist`} className="btn btn-outline-success btn-lg w-100" style={{ borderRadius: '10px' }}>
                      <i className="fa fa-user mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                      Meus Pacientes
                    </Link>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-3">
                    <Link to={`/${role}/laudolist`} className="btn btn-outline-info btn-lg w-100" style={{ borderRadius: '10px' }}>
                      <i className="fa fa-stethoscope mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                      Laudos
                    </Link>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-3">
                    <Link to={`/${role}/excecao`} className="btn btn-outline-warning btn-lg w-100" style={{ borderRadius: '10px' }}>
                      <i className="fa fa-exclamation-triangle mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                      Exceções
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas Médicos */}
        {alerts.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <div className="card-header">
                  <h4 className="card-title">🔔 Notificações Importantes</h4>
                </div>
                <div className="card-body">
                  {alerts.map((alert, index) => (
                    <div key={index} className={`alert alert-${alert.type === 'danger' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'} d-flex align-items-center mb-2`}>
                      <i className={`fa ${alert.icon} me-2`}></i>
                      <span className="flex-grow-1">{alert.message}</span>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

            {/* Seções Específicas do Médico */}
            {/* Primeira linha - Agenda do Dia e Consultas Recentes */}
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <div className="card shadow-sm rounded p-3">
                  <h4 className="fw-semibold mb-3">
                    <i className="fa fa-calendar text-primary"></i> Consultas de Hoje
                  </h4>
                  {loading ? (
                    <div className="text-center text-muted" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div>
                        <i className="fa fa-spinner fa-spin fa-2x mb-2"></i>
                        <p>Carregando agenda...</p>
                      </div>
                    </div>
                  ) : todayAppointments.length > 0 ? (
                    <div className="agenda-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {todayAppointments.map((apt, index) => (
                        <div key={index} className="d-flex align-items-center p-3 border-bottom">
                          <div className="time-badge bg-primary text-white px-2 py-1 rounded me-3" style={{ minWidth: '60px', textAlign: 'center' }}>
                            {apt.time}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{apt.patient_name}</h6>
                            <small className="text-muted">{apt.chief_complaint || 'Consulta de rotina'}</small>
                          </div>
                          <div>
                            <span className={`badge ${apt.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                              {apt.status === 'completed' ? 'Realizada' : 'Agendada'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <i className="fa fa-calendar-o fa-3x mb-3"></i>
                      <p>Nenhuma consulta agendada para hoje</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card shadow-sm rounded p-3">
                  <h4 className="fw-semibold mb-3">
                    <i className="fa fa-history text-info"></i> Atendimentos Recentes
                  </h4>
                  {loading ? (
                    <div className="text-center text-muted" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div>
                        <i className="fa fa-spinner fa-spin fa-2x mb-2"></i>
                        <p>Carregando consultas...</p>
                      </div>
                    </div>
                  ) : recentConsults.length > 0 ? (
                    <div className="recent-list" style={{ maxHeight: '300px', overflowY: 'auto'  }}>
                      {recentConsults.map((consult, index) => (
                        <div key={index} className="d-flex align-items-center p-3 border-bottom">
                          <div className="patient-avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                            {consult.patient_name.charAt(0)}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{consult.patient_name}</h6>
                            <small className="text-muted">{consult.date}</small>
                          </div>
                          <button className="btn btn-sm btn-outline-primary">Ver Laudo</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <i className="fa fa-file-text-o fa-3x mb-3"></i>
                      <p>Nenhuma consulta recente</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

        {/* Charts Section */}
        

          
      </div>
    </div>
  );
}

export default DoctorDashboard;