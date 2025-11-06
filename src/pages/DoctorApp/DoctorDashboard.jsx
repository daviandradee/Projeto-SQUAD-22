import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/auth";
import "../../../src/assets/css/index.css"; 
import { getFullName, getUserId } from "../../utils/userInfo";
import AvatarForm from "../../../public/img/AvatarForm.jpg";
import banner from '../../../public/img/banner.png';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
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
  // Estados para os gráficos médicos
  
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previewUrl, setPreviewUrl] = useState(AvatarForm);

  const tokenUsuario = getAccessToken();
  const userId = getUserId();

  const requestOptions = {
    method: "GET",
    headers: {
      apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
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
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients",
          requestOptions
        );
        const patientsData = await patientsResponse.json();
        const patientsArr = Array.isArray(patientsData) ? patientsData : [];
        setPatients(patientsArr);

        // Buscar consultas do médico (filtrar pelo doctor_id se disponível)
        const appointmentsResponse = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments",
          requestOptions
        );
        const appointmentsData = await appointmentsResponse.json();
        const appointmentsArr = Array.isArray(appointmentsData) ? appointmentsData : [];
        setAppointments(appointmentsArr);
        
        // Processar dados específicos do médico
        processTodayAppointments(appointmentsArr, patientsArr);
        processRecentConsults(appointmentsArr, patientsArr);
        processFollowUpPatients(appointmentsArr, patientsArr);
        processConsultasMensais(appointmentsArr);
        processComparecimentoData(appointmentsArr);
        processAlerts(appointmentsArr);
        
        console.log("Dados do médico carregados:", {
          patients: patientsArr.length,
          appointments: appointmentsArr.length
        });
        
      } catch (error) {
        console.error("Erro ao carregar dados do médico:", error);
      } finally {
        setLoading(false);
      }
    };

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
      myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
      myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

      const requestOptions = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
      };

      try {
        const response = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/storage/v1/object/avatars/${userId}/avatar.png`, requestOptions);
        
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setPreviewUrl(imageUrl);
          return; // Avatar encontrado
        }
      } catch (error) {
        console.log('Avatar não encontrado com extensão png');
      }
      
      // Se chegou até aqui, não encontrou avatar - mantém o padrão
      console.log('Nenhum avatar encontrado, usando imagem padrão');
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
  return (
        <div className="content">
          <div className="sdc-content">
            {/* Banner de Boas-vindas */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow-sm rounded">
                  <div className="card-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <div className="d-flex align-items-center">
                          <div style={{ marginRight: '20px' }}>
                            
                              <img alt="" src={previewUrl} style={{ marginTop: "5px", borderRadius: "50%", objectFit: "cover", width: "80px", height: "80px" }} />
                          
                          </div>
                          <div>
                            <h3 className="fw-semibold mb-1 text-dark">
                              Bem-vindo de volta, Dr.{getFullName()}!
                            </h3>
                            <p className="text-muted mb-2">
                             Hoje é mais um dia para transformar vidas. Revise sua agenda, acompanhe seus pacientes e siga fazendo a diferença com o MediConnect. 💙
                            </p>
                            <small className="text-muted">
                              <i className="fa fa-calendar" style={{ marginRight: '5px' }}></i>
                              {currentTime.toLocaleDateString('pt-BR')}
                              <span style={{ marginLeft: '15px' }}>
                                <i className="fa fa-clock-o" style={{ marginRight: '5px' }}></i>
                                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 text-right">
                        <div className="d-flex justify-content-end align-items-center">
                         
                      
                            <img alt="" src={banner} style={{ marginTop: "5px", borderRadius: "8px", objectFit: "cover", width: "50%", height: "50%" }} />
                          </div>
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Widgets do Médico */}
            <div className="row">
              <div className="col-md-3">
                <div className="sdc-dash-widget">
                  <span className="sdc-dash-widget-bg1">
                    <i className="fa fa-calendar" />
                  </span>
                  <div className="sdc-dash-widget-info">
                    <h3>{todayAppointments.length}</h3>
                    <span>Hoje</span>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="sdc-dash-widget">
                  <span className="sdc-dash-widget-bg2">
                    <i className="fa fa-users" />
                  </span>
                  <div className="sdc-dash-widget-info">
                    <h3>{patients.length}</h3>
                    <span>Acompanhamento</span>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="sdc-dash-widget">
                  <span className="sdc-dash-widget-bg3">
                    <i className="fa fa-file-text" />
                  </span>
                  <div className="sdc-dash-widget-info">
                    <h3>3</h3>
                    <span>Laudos</span>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="sdc-dash-widget">
                  <span className="sdc-dash-widget-bg4">
                    <i className="fa fa-bell" />
                  </span>
                  <div className="sdc-dash-widget-info">
                    <h3>{alerts.length}</h3>
                    <span>Alertas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alertas 
            {alerts.length > 0 && (
              <div className="row mt-3">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body p-3">
                      <h5 className="mb-3"><i className="fa fa-bell text-warning"></i> Alertas</h5>
                      {alerts.map((alert, index) => (
                        <div key={index} className={`alert alert-${alert.type === 'danger' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'} d-flex align-items-center mb-2`}>
                          <i className={`fa ${alert.icon} me-2`}></i>
                          <span className="flex-grow-1">{alert.message}</span>
                          <button className="btn btn-sm btn-outline-secondary ms-2">{alert.action}</button>
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
                    <i className="fa fa-calendar text-primary"></i> Agenda de Hoje
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
                    <i className="fa fa-history text-info"></i> Consultas Recentes
                  </h4>
                  {loading ? (
                    <div className="text-center text-muted" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div>
                        <i className="fa fa-spinner fa-spin fa-2x mb-2"></i>
                        <p>Carregando consultas...</p>
                      </div>
                    </div>
                  ) : recentConsults.length > 0 ? (
                    <div className="recent-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
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

            {/* Segunda linha - Pacientes em Acompanhamento e Gráficos */}
            
        </div> 
      </div>
  );
}

export default DoctorDashboard;