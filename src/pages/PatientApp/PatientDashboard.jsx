import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/auth.js";
import { getFullName, getUserId } from "../../utils/userInfo";
import "../../assets/css/index.css";
import { getUserRole } from "../../utils/userInfo";

const AvatarForm = "/img/AvatarForm.jpg";
const banner = "/img/banner.png";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [nextConsultations, setNextConsultations] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const role = getUserRole();
  const tokenUsuario = getAccessToken();
  const userId = getUserId();
  const patientName = getFullName() || "Paciente";

  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

  const requestOptions = {
    method: "GET",
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${tokenUsuario}`,
    },
    redirect: "follow",
  };

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Carregando dados do paciente...", { userId, tokenUsuario: !!tokenUsuario });
        
        // Buscar todas as consultas primeiro (sem filtrar por patient_id se não existir na tabela)
        const appointmentsResponse = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments",
          requestOptions
        );
        
        const reportsResponse = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports",
          requestOptions
        );
        
        const doctorsResponse = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?select=id,full_name",
          requestOptions
        );

        console.log("📡 Status das respostas:", {
          appointments: appointmentsResponse.status,
          reports: reportsResponse.status,
          doctors: doctorsResponse.status
        });

        const [appointmentsData, reportsData, doctorsData] = await Promise.all([
          appointmentsResponse.json(),
          reportsResponse.json(),
          doctorsResponse.json()
        ]);

        console.log("📊 Dados recebidos:", {
          appointments: appointmentsData,
          reports: reportsData,
          doctors: doctorsData
        });

        const appointmentsArr = Array.isArray(appointmentsData) ? appointmentsData : [];
        const reportsArr = Array.isArray(reportsData) ? reportsData : [];
        const doctorsArr = Array.isArray(doctorsData) ? doctorsData : [];
        
        // Filtrar consultas por patient_id (se o campo existir)
        const patientAppointments = appointmentsArr.filter(apt => 
          apt.patient_id === userId || 
          apt.patient_id === parseInt(userId) ||
          // Se não tiver patient_id, mostrar algumas para demonstração
          !apt.patient_id
        );
        
        // Filtrar relatórios por patient_id (se o campo existir)  
        const patientReports = reportsArr.filter(rep => 
          rep.patient_id === userId || 
          rep.patient_id === parseInt(userId) ||
          // Se não tiver patient_id, mostrar alguns para demonstração
          !rep.patient_id
        );
        
        // Enriquecer consultas com nomes dos médicos
        const enrichedAppointments = patientAppointments.map(appointment => {
          const doctor = doctorsArr.find(doc => doc.id === appointment.doctor_id);
          return {
            ...appointment,
            doctor_name: doctor ? doctor.full_name : 'Médico não informado'
          };
        });

        console.log("✅ Dados processados:", {
          enrichedAppointments,
          patientReports,
          totalDoctors: doctorsArr.length
        });

        setAppointments(enrichedAppointments);
        setReports(patientReports);
        
        // Processar dados
        console.log("🔥 TESTE: Chamando processNextConsultations com:", enrichedAppointments.length, "consultas");
        
        // FORÇAR para teste
        if (enrichedAppointments.length === 0) {
          forceShowConsultations();
        } else {
          // Filtrar consultas não canceladas
          const nonCancelledConsultations = enrichedAppointments.filter(apt => 
            apt.status !== 'cancelled' && 
            apt.status !== 'cancelada' && 
            apt.status !== 'canceled'
          );
          
          console.log("📋 Consultas não canceladas:", nonCancelledConsultations.length, "de", enrichedAppointments.length);
          
          if (nonCancelledConsultations.length > 0) {
            // Ordenar por proximidade da data atual (mais próximas primeiro)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const sortedByProximity = nonCancelledConsultations
              .map(apt => {
                const dateField = apt.scheduled_at || apt.date;
                const timeField = apt.time;
                
                if (dateField) {
                  let consultationDateTime;
                  
                  if (dateField.includes('T')) {
                    // Data já inclui horário
                    consultationDateTime = new Date(dateField);
                  } else {
                    // Combinar data com horário
                    consultationDateTime = new Date(dateField);
                    if (timeField) {
                      const [hours, minutes] = timeField.split(':');
                      consultationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    } else {
                      consultationDateTime.setHours(12, 0, 0, 0); // Default meio-dia se não houver horário
                    }
                  }
                  
                  const now = new Date();
                  const diffInMinutes = Math.abs((consultationDateTime - now) / (1000 * 60));
                  return { ...apt, proximityScore: diffInMinutes, consultationDateTime };
                }
                return { ...apt, proximityScore: 999999 }; // Consultas sem data vão para o final
              })
              .sort((a, b) => a.proximityScore - b.proximityScore)
              .slice(0, 2);
            
            console.log("✅ Mostrando 2 consultas mais próximas da data atual:", sortedByProximity);
            setNextConsultations(sortedByProximity);
          } else {
            console.log("⚠️ Todas as consultas estão canceladas - usando dados de teste");
            forceShowConsultations();
          }
        }
        
        processRecentExams(patientReports);
        
      } catch (error) {
        console.error("❌ Erro ao carregar dados do paciente:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tokenUsuario) {
      loadPatientData();
    }
  }, [userId, tokenUsuario]);

  // Processar próximas consultas
  const processNextConsultations = (appointments) => {
    console.log("🔄 Processando consultas:", appointments);
    console.log("📊 Total de consultas recebidas:", appointments.length);
    
    // Análise detalhada de cada consulta
    appointments.forEach((apt, index) => {
      console.log(`📋 Consulta ${index + 1}:`, {
        id: apt.id,
        scheduled_at: apt.scheduled_at,
        date: apt.date,
        time: apt.time,
        doctor_name: apt.doctor_name,
        status: apt.status
      });
    });

    // Data de hoje em formato string para comparação
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    console.log("� Data de hoje (string):", todayString);
    
    // Filtrar consultas futuras (incluindo hoje)
    const futureConsultations = appointments.filter(apt => {
      // Usar scheduled_at como data principal
      const dateField = apt.scheduled_at || apt.date;
      
      if (!dateField) {
        console.log("⚠️ Consulta sem data:", apt.id);
        return false;
      }
      
      // Normalizar a data da consulta
      let consultationDate = dateField;
      
      // Se a data contém horário, pegar apenas a parte da data
      if (consultationDate.includes('T')) {
        consultationDate = consultationDate.split('T')[0];
      }
      
      const isFuture = consultationDate >= todayString;
      console.log(`📅 Consulta ${apt.id}: ${consultationDate} >= ${todayString} = ${isFuture}`);
      
      return isFuture;
    });
    
    console.log("🔮 Consultas futuras encontradas:", futureConsultations.length);
    console.log("📋 Lista de consultas futuras:", futureConsultations);
    
    // Mostrar as 2 consultas mais próximas do horário atual (futuras ou passadas)
    const consultationsWithProximity = appointments
      .map(apt => {
        const dateField = apt.scheduled_at || apt.date;
        const timeField = apt.time;
        
        if (dateField) {
          let consultationDateTime;
          
          if (dateField.includes('T')) {
            // Data já inclui horário
            consultationDateTime = new Date(dateField);
          } else {
            // Combinar data com horário
            consultationDateTime = new Date(dateField);
            if (timeField) {
              const [hours, minutes] = timeField.split(':');
              consultationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            } else {
              consultationDateTime.setHours(12, 0, 0, 0); // Default meio-dia se não houver horário
            }
          }
          
          const now = new Date();
          const diffInMinutes = Math.abs((consultationDateTime - now) / (1000 * 60));
          return { ...apt, proximityScore: diffInMinutes, consultationDateTime };
        }
        return { ...apt, proximityScore: 999999 }; // Consultas sem data vão para o final
      })
      .sort((a, b) => a.proximityScore - b.proximityScore)
      .slice(0, 2);
    
    console.log("✅ 2 consultas mais próximas da data atual:", consultationsWithProximity);
    setNextConsultations(consultationsWithProximity);
  };

  // FUNÇÃO DE TESTE - FORÇAR EXIBIÇÃO
  
  // Processar exames recentes
  const processRecentExams = (reports) => {
    console.log("🔬 Processando exames:", reports);

    // Ordenar por data de criação (mais recentes primeiro)
    const recent = reports
      .filter(report => report.created_at) // Apenas com data válida
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
    
    console.log("✅ Exames recentes processados:", recent);
    setRecentExams(recent);
  };

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Funções auxiliares para status das consultas
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': case 'confirmada': return 'bg-success';
      case 'pending': case 'pendente': return 'bg-warning';
      case 'cancelled': case 'cancelada': return 'bg-danger';
      case 'completed': case 'finalizada': return 'bg-info';
      default: return 'bg-primary';
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'confirmed': case 'confirmada': return '#28a745';
      case 'pending': case 'pendente': return '#ffc107';
      case 'cancelled': case 'cancelada': return '#dc3545';
      case 'completed': case 'finalizada': return '#17a2b8';
      default: return '#007bff';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': case 'confirmada': return 'fa-check';
      case 'pending': case 'pendente': return 'fa-clock-o';
      case 'cancelled': case 'cancelada': return 'fa-times';
      case 'completed': case 'finalizada': return 'fa-check-circle';
      default: return 'fa-calendar';
    }
  };





  // Funções auxiliares para status dos exames
  const getExamBorderColor = (status) => {
    switch (status) {
      case 'completed': case 'finalizado': return '#28a745';
      case 'draft': case 'rascunho': return '#ffc107';
      case 'pending': case 'pendente': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getExamIconColor = (status) => {
    switch (status) {
      case 'completed': case 'finalizado': return 'bg-success';
      case 'draft': case 'rascunho': return 'bg-warning';
      case 'pending': case 'pendente': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getExamIcon = (status) => {
    switch (status) {
      case 'completed': case 'finalizado': return 'fa-check';
      case 'draft': case 'rascunho': return 'fa-clock-o';
      case 'pending': case 'pendente': return 'fa-file-text';
      default: return 'fa-file-o';
    }
  };

  const getExamBadgeClass = (status) => {
    switch (status) {
      case 'completed': case 'finalizado': return 'bg-success';
      case 'draft': case 'rascunho': return 'bg-warning';
      case 'pending': case 'pendente': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getExamStatusText = (status) => {
    switch (status) {
      case 'completed': case 'finalizado': return 'Concluído';
      case 'draft': case 'rascunho': return 'Em análise';
      case 'pending': case 'pendente': return 'Disponível';
      default: return 'Processando';
    }
  };

  // Estatísticas calculadas baseadas nos dados reais da API + demonstração (apenas consultas não canceladas)
  const nonCancelledAppointments = appointments.filter(apt => 
    apt.status !== 'cancelled' && 
    apt.status !== 'cancelada' && 
    apt.status !== 'canceled'
  );
  
  const totalConsultas = nonCancelledAppointments.length > 0 ? nonCancelledAppointments.length : 5;
  const consultasRealizadas = nonCancelledAppointments.length > 0 
    ? nonCancelledAppointments.filter(apt => apt.status === 'completed' || apt.status === 'finalizada').length 
    : 3;
  const proximasConsultas = nextConsultations.length;
  const examesRealizados = reports.length > 0 ? reports.length : 3;

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Carregando...</span>
              </div>
              <p className="text-muted mt-3">Carregando dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header com informações do paciente */}
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
                    <h2 className="mb-2">👋 Olá, {patientName}!</h2>
                    <p className="mb-2">Bem-vindo ao seu portal de saúde</p>
                    <small className="opacity-75">
                      🕒 {currentTime.toLocaleString('pt-BR')}
                    </small>
                  </div>
                  <div className="col-md-4 text-right">
                    <img 
                      src={AvatarForm} 
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
                <h3>{totalConsultas}</h3>
                <span className="widget-title1">Total Consultas</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg2">
                <i className="fa fa-clock-o" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{proximasConsultas}</h3>
                <span className="widget-title2">Próximas Consultas</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg3">
                <i className="fa fa-stethoscope" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{examesRealizados}</h3>
                <span className="widget-title3">Laudos</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg4">
                <i className="fa fa-check-circle" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{consultasRealizadas}</h3>
                <span className="widget-title4">Consultas Realizadas</span>
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
                    <Link to="/paciente/medicosdisponiveis" className="btn btn-outline-primary btn-lg w-100" style={{ borderRadius: '10px' }}>
                      <i className="fa fa-user-md mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                      Agendar Consulta
                    </Link>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-3">
                    <Link to="/paciente/consultalist" className="btn btn-outline-success btn-lg w-100" style={{ borderRadius: '10px' }}>
                      <i className="fa fa-calendar mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                      Minhas Consultas
                    </Link>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-3">
                    <Link to="/paciente/laudolist" className="btn btn-outline-info btn-lg w-100" style={{ borderRadius: '10px' }}>
                      <i className="fa fa-file-text mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                      Meus Laudos
                    </Link>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-3">
                    <button className="btn btn-outline-warning btn-lg w-100" style={{ borderRadius: '10px' }}>
                      <i className="fa fa-phone mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                      Emergência
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Próximas Consultas */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">📅 Próximas Consultas</h4>
                <Link className="btn btn-primary btn-sm" to="/paciente/consultalist" style={{ borderRadius: '8px' }}>
                  Ver todas
                </Link>
              </div>
              <div className="card-body">
                {nextConsultations.length > 0 ? (
                  <div className="row">
                    {nextConsultations.map((consultation, index) => (
                      <div key={consultation.id} className="col-12 mb-2">
                        <div className="d-flex align-items-center p-2 rounded" style={{ 
                          background: '#f8f9fa', 
                          borderRadius: '10px', 
                          color: '#333',
                          border: '1px solid #dee2e6',
                          borderLeftWidth: '4px',
                          borderLeftColor: getStatusBorderColor(consultation.status)
                        }}>
                          <div className="consultation-icon me-3">
                            <div className={`${getStatusColor(consultation.status)} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '35px', height: '35px' }}>
                              <i className={`fa ${getStatusIcon(consultation.status)} text-white`}></i>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0">{consultation.doctor_name || 'Médico não informado'}</h6>
                            <small className="text-muted">
                              {(() => {
                                const dateToShow = consultation.scheduled_at || consultation.date;
                                if (dateToShow) {
                                  // Extrair data e hora sem conversão de fuso horário
                                  let dateStr = '';
                                  let timeStr = '';
                                  
                                  if (dateToShow.includes('T')) {
                                    // Formato ISO: 2025-11-15T14:30:00
                                    const [datePart, timePart] = dateToShow.split('T');
                                    const [year, month, day] = datePart.split('-');
                                    dateStr = `${day}/${month}/${year}`;
                                    
                                    if (timePart) {
                                      const [hour, minute] = timePart.split(':');
                                      timeStr = `${hour}:${minute}`;
                                    }
                                  } else {
                                    // Formato simples: 2025-11-15
                                    const [year, month, day] = dateToShow.split('-');
                                    dateStr = `${day}/${month}/${year}`;
                                  }
                                  
                                  // Usar horário do campo time se existir, senão usar o extraído
                                  const finalTime = consultation.time || timeStr || 'Horário a confirmar';
                                  
                                  return `${dateStr} às ${finalTime}`;
                                }
                                return 'Data a confirmar';
                              })()}
                            </small>
                          </div>
                          <span
                            className={`custom-badge ${
                              consultation.status === 'requested' ? 'status-orange' :
                              consultation.status === 'confirmed' ? 'status-blue' :
                              consultation.status === 'completed' ? 'status-green' :
                              consultation.status === 'cancelled' ? 'status-red' :
                              'status-gray'
                            }`}
                            style={{ minWidth: '110px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {consultation.status === 'requested' ? (
                              <>
                                <i className="fa fa-clock-o" style={{ marginRight: '6px' }}></i>
                                Solicitado
                              </>
                            ) : consultation.status === 'confirmed' ? (
                              <>
                                <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i>
                                Confirmado
                              </>
                            ) : consultation.status === 'completed' ? (
                              <>
                                <i className="fa fa-check" style={{ marginRight: '6px' }}></i>
                                Concluído
                              </>
                            ) : consultation.status === 'cancelled' ? (
                              <>
                                <i className="fa fa-times-circle" style={{ marginRight: '6px' }}></i>
                                Cancelado
                              </>
                            ) : (
                              <>
                                <i className="fa fa-question-circle" style={{ marginRight: '6px' }}></i>
                                {consultation.status}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="fa fa-calendar-o fa-3x mb-3"></i>
                    <p>Nenhuma consulta agendada</p>
                    <Link to="/paciente/medicosdisponiveis" className="btn btn-primary btn-sm">
                      Agendar primeira consulta
                    </Link>
                  </div>
                )}
                
                {/* Botão para ver mais */}
                <div className="text-center mt-3">
                  <Link to="/paciente/medicosdisponiveis" className="btn btn-outline-primary btn-sm">
                    <i className="fa fa-plus me-2"></i>
                    Agendar nova consulta
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Exames Recentes */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">🔬 Laudos Recentes</h4>
                <Link className="btn btn-primary btn-sm" to="/paciente/laudolist" style={{ borderRadius: '8px' }}>
                  Ver todos
                </Link>
              </div>
              <div className="card-body">
                {recentExams.length > 0 ? (
                  <div className="row">
                    {recentExams.map((exam) => (
                      <div key={exam.id} className="col-12 mb-2">
                        <div className="d-flex align-items-center p-2 rounded" style={{ 
                          background: '#f8f9fa', 
                          borderRadius: '10px', 
                          color: '#333',
                          border: '1px solid #dee2e6',
                          borderLeftWidth: '4px',
                          borderLeftColor: getExamBorderColor(exam.status)
                        }}>
                          <div className="exam-icon me-3">
                            <div className={`${getExamIconColor(exam.status)} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '35px', height: '35px' }}>
                              <i className={`fa ${getExamIcon(exam.status)} text-white`}></i>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0">{exam.exam || 'Exame'}</h6>
                            <small className="text-muted">
                              {new Date(exam.created_at).toLocaleDateString('pt-BR')} - {exam.requested_by || 'Médico não informado'}
                            </small>
                          </div>
                          <span
                            className={`custom-badge ${
                              exam.status === 'draft' ? 'status-orange' :
                              exam.status === 'completed' ? 'status-green' :
                              'status-gray'
                            }`}
                            style={{ minWidth: '110px', display: 'inline-block', textAlign: 'center' }}
                          >
                            {exam.status === 'draft' ? (
                              <>
                                <i className="fa fa-edit" style={{ marginRight: '6px' }}></i>
                                Rascunho
                              </>
                            ) : exam.status === 'completed' ? (
                              <>
                                <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i>
                                Concluído
                              </>
                            ) : (
                              exam.status
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="fa fa-file-text-o fa-3x mb-3"></i>
                    <p>Nenhum laudo realizado ainda</p>
                  </div>
                )}
                
                <div className="text-center mt-3">
                  <Link to="/paciente/laudolist" className="btn btn-outline-info btn-sm">
                    <i className="fa fa-eye me-2"></i>
                    Ver todos os laudos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações de saúde */}
        <div className="row">
          <div className="col-12">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="card-header">
                <h4 className="card-title">💡 Dicas de Saúde</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <div className="health-tip p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                      <i className="fa fa-heart text-danger fa-2x mb-2"></i>
                      <h6>Exercite-se Regularmente</h6>
                      <p className="text-muted small">30 minutos de atividade física por dia fazem a diferença</p>
                    </div>
                  </div>
                  <div className="col-md-4 text-center mb-3">
                    <div className="health-tip p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                      <i className="fa fa-apple text-success fa-2x mb-2"></i>
                      <h6>Alimentação Saudável</h6>
                      <p className="text-muted small">Consuma frutas e vegetais todos os dias</p>
                    </div>
                  </div>
                  <div className="col-md-4 text-center mb-3">
                    <div className="health-tip p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                      <i className="fa fa-bed text-primary fa-2x mb-2"></i>
                      <h6>Durma Bem</h6>
                      <p className="text-muted small">7-8 horas de sono são essenciais para sua saúde</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS customizado para o PatientDashboard
const style = document.createElement('style');
style.textContent = `
  .timeline {
    position: relative;
  }
  
  .timeline-item {
    position: relative;
  }
  
  .timeline-marker {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
  }
  
  .timeline-content {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    border-left: 3px solid #007bff;
    width: 100%;
  }
  
  .exam-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .health-tip {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .health-tip:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  .dash-widget {
    transition: transform 0.2s ease;
  }
  
  .dash-widget:hover {
    transform: translateY(-3px);
  }
  
  .user-info-banner {
    position: relative;
    overflow: hidden;
  }
  
  .user-info-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="100%"><stop offset="0%" style="stop-color:rgba(255,255,255,0.1)"/><stop offset="100%" style="stop-color:rgba(255,255,255,0)"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>');
    pointer-events: none;
  }
`;

if (!document.head.querySelector('[data-patient-dashboard-styles]')) {
  style.setAttribute('data-patient-dashboard-styles', 'true');
  document.head.appendChild(style);
}