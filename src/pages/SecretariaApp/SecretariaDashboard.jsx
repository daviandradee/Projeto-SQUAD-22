import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/auth.js";
import "../../assets/css/index.css";
import { getFullName, getUserId } from "../../utils/userInfo";
const AvatarForm = "/img/AvatarForm.jpg";
const banner = "/img/banner.png";
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

// Componente do gráfico de consultas mensais
const ConsultasMensaisChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={350}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="mes" fontSize={12} />
      <YAxis fontSize={12} />
      <Tooltip
        contentStyle={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}
        formatter={(value) => [`${value} consultas`, 'Total']}
      />
      <Legend />
      <Bar dataKey="consultas" fill="#007bff" name="Consultas" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

// Componente do gráfico de pacientes ativos/inativos
const AtivosInativosChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={350}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}
        formatter={(value, name) => [`${value} pacientes`, name]}
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

// Componente do gráfico de consultas por médico com Chart.js (horizontal)
const ConsultasPorMedicoChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <i className="fa fa-chart-bar fa-2x mb-2"></i>
          <p>Nenhum dado de médicos encontrado</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.medico),
    datasets: [
      {
        label: 'Consultas',
        data: data.map(item => item.consultas),
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#f8f9fa',
        titleColor: '#343a40',
        bodyColor: '#343a40',
        borderColor: '#dee2e6',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.parsed.x} consultas`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: '#e9ecef',
          drawBorder: false,
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 11
          },
          maxRotation: 0,
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    layout: {
      padding: {
        left: 20,
        right: 30,
        top: 10,
        bottom: 10
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '350px', backgroundColor: '#ffffff' }}>
      <ChartJSBar data={chartData} options={options} />
    </div>
  );
};

// Componente do gráfico de taxa de cancelamentos
const TaxaCancelamentosChart = ({ data }) => {
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <i className="fa fa-chart-bar fa-2x mb-2"></i>
          <p>Nenhum dado de cancelamentos encontrado</p>
        </div>
      </div>
    );
  }

  // Preparar dados para Chart.js (gráfico empilhado)
  const chartData = {
    labels: data.map(item => item.mes),
    datasets: [
      {
        label: 'Realizadas',
        data: data.map(item => item.realizadas),
        backgroundColor: '#dee2e6',
        borderColor: '#adb5bd',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Canceladas',
        data: data.map(item => item.canceladas),
        backgroundColor: '#dc3545',
        borderColor: '#c82333',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 12
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#e9ecef',
          drawBorder: false,
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 12
          },
          callback: function (value) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#495057',
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'rect'
        }
      },
      tooltip: {
        backgroundColor: '#f8f9fa',
        titleColor: '#343a40',
        bodyColor: '#343a40',
        borderColor: '#dee2e6',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            const dataIndex = context.dataIndex;
            const monthData = data[dataIndex];

            if (datasetLabel === 'Canceladas') {
              const numConsultas = Math.round(monthData.total * value / 100);
              return `${datasetLabel}: ${value}% (${numConsultas} de ${monthData.total} consultas)`;
            } else {
              const numConsultas = Math.round(monthData.total * value / 100);
              return `${datasetLabel}: ${value}% (${numConsultas} consultas)`;
            }
          },
          title: function (context) {
            const monthData = data[context[0].dataIndex];
            return `${context[0].label} ${new Date().getFullYear()} - Total: ${monthData.total} consultas`;
          },
          afterBody: function (context) {
            const monthData = data[context[0].dataIndex];
            if (monthData.total === 0) {
              return ['Nenhuma consulta registrada neste mês'];
            }
            return [];
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '350px', backgroundColor: '#ffffff' }}>
      <ChartJSBar data={chartData} options={options} />
    </div>
  );
};

function SecretariaDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [consulta, setConsulta] = useState([]);
  const [countPaciente, setCountPaciente] = useState(0);
  const [countMedico, setCountMedico] = useState(0);
  // Estados para os gráficos
  const [consultasMensaisDataReal, setConsultasMensaisDataReal] = useState([]);
  const [pacientesStatusDataReal, setPacientesStatusDataReal] = useState([]);
  const [consultasPorMedicoData, setConsultasPorMedicoData] = useState([]);
  const [taxaCancelamentosData, setTaxaCancelamentosData] = useState([]);
  const [appointments, setAppointments] = useState([]);
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
    const loadData = async () => {
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
        setConsulta(patientsArr);
        setCountPaciente(patientsArr.length);

        // Processar status dos pacientes
        if (patientsArr.length > 0) {
          const ativos = patientsArr.filter(p => p.active !== false).length;
          const inativos = patientsArr.length - ativos;

          const statusData = [
            { name: 'Ativos', value: ativos, color: '#007bff' },
            { name: 'Inativos', value: inativos, color: '#ffa500' }
          ];

          setPacientesStatusDataReal(statusData);
        }

        // Buscar médicos
        const doctorsResponse = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors",
          requestOptions
        );
        const doctorsData = await doctorsResponse.json();
        const doctorsArr = Array.isArray(doctorsData) ? doctorsData : [];
        setDoctors(doctorsArr);
        setCountMedico(doctorsArr.length);

        // Buscar consultas
        const appointmentsResponse = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments",
          requestOptions
        );
        const appointmentsData = await appointmentsResponse.json();
        const appointmentsArr = Array.isArray(appointmentsData) ? appointmentsData : [];
        setAppointments(appointmentsArr);

        // Processar dados dos gráficos
        processConsultasMensais(appointmentsArr);
        await processConsultasPorMedico(appointmentsArr, doctorsArr);
        processTaxaCancelamentos(appointmentsArr);


      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // useEffect para atualizar o relógio em tempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
          return;
        }
      } catch (error) {

      }

    };

    loadAvatar();
  }, [userId]);

  // Processar dados das consultas mensais
  const processConsultasMensais = (appointmentsData) => {
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const consultasPorMes = meses.map(mes => ({ mes, consultas: 0 }));

    if (appointmentsData && appointmentsData.length > 0) {
      appointmentsData.forEach(appointment => {
        if (appointment.scheduled_at) {
          const data = new Date(appointment.scheduled_at);
          const mesIndex = data.getMonth();
          if (mesIndex >= 0 && mesIndex < 12) {
            consultasPorMes[mesIndex].consultas++;
          }
        }
      });
    }

    setConsultasMensaisDataReal(consultasPorMes);
  };

  // Processar dados das consultas por médico
  const processConsultasPorMedico = async (appointmentsData, doctorsData) => {
    try {
      // Criar mapa de médicos
      const doctorsMap = {};
      doctorsData.forEach(doctor => {
        let doctorName = doctor.full_name || doctor.name || `Médico ${doctor.id}`;
        doctorName = doctorName.trim();
        doctorsMap[doctor.id] = doctorName;
      });

      // Contar consultas por médico
      const consultasPorMedico = {};
      appointmentsData.forEach(appointment => {
        if (appointment.doctor_id) {
          const doctorName = doctorsMap[appointment.doctor_id] || `Médico ${appointment.doctor_id}`;
          consultasPorMedico[doctorName] = (consultasPorMedico[doctorName] || 0) + 1;
        }
      });

      // Converter para array e ordenar por número de consultas (maior para menor)
      const chartData = Object.entries(consultasPorMedico)
        .map(([medico, consultas]) => ({ medico, consultas }))
        .sort((a, b) => b.consultas - a.consultas)
        .slice(0, 10); // Mostrar apenas os top 10 médicos

      setConsultasPorMedicoData(chartData);
    } catch (error) {
      setConsultasPorMedicoData([]);
    }
  };

  // Processar dados da taxa de cancelamentos
  const processTaxaCancelamentos = (appointmentsData) => {
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const cancelamentosPorMes = meses.map(mes => ({
      mes,
      realizadas: 0,
      canceladas: 0,
      total: 0
    }));

    if (appointmentsData && appointmentsData.length > 0) {

      appointmentsData.forEach(appointment => {
        if (appointment.scheduled_at) {
          const data = new Date(appointment.scheduled_at);
          const mesIndex = data.getMonth();
          const anoAtual = new Date().getFullYear();
          const anoConsulta = data.getFullYear();

          // Processar apenas consultas do ano atual
          if (mesIndex >= 0 && mesIndex < 12 && anoConsulta === anoAtual) {
            cancelamentosPorMes[mesIndex].total++;

            // Verificar diferentes possíveis campos de status de cancelamento
            const isCancelled =
              appointment.status === 'cancelled' ||
              appointment.status === 'canceled' ||
              appointment.cancelled === true ||
              appointment.is_cancelled === true ||
              appointment.appointment_status === 'cancelled' ||
              appointment.appointment_status === 'canceled';

            if (isCancelled) {
              cancelamentosPorMes[mesIndex].canceladas++;
            } else {
              cancelamentosPorMes[mesIndex].realizadas++;
            }
          }
        }
      });

      // Calcular porcentagens e manter valores absolutos para tooltip
      cancelamentosPorMes.forEach(mes => {
        if (mes.total > 0) {
          const realizadasCount = mes.realizadas;
          const canceladasCount = mes.canceladas;

          mes.realizadas = Math.round((realizadasCount / mes.total) * 100);
          mes.canceladas = Math.round((canceladasCount / mes.total) * 100);

          // Garantir que soma seja 100%
          if (mes.realizadas + mes.canceladas !== 100 && mes.total > 0) {
            mes.realizadas = 100 - mes.canceladas;
          }
        } else {
          // Se não há dados, mostrar 100% realizadas
          mes.realizadas = 100;
          mes.canceladas = 0;
        }
      });

    
      setTaxaCancelamentosData(cancelamentosPorMes);
    } else {
      // Se não há dados da API, deixar vazio

      setTaxaCancelamentosData([]);
    }
  };



  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header com informações da secretária */}
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
                    <h2 className="mb-2">📋 Olá, {getFullName()}!</h2>
                    <p className="mb-2">O MediConnect está pronto para mais um dia de organização e cuidado. Continue ajudando nossa clínica a funcionar de forma leve, eficiente e acolhedora!</p>
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
              <span className="dash-widget-bg2">
                <i className="fa fa-users" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{countPaciente}</h3>
                <span className="widget-title2">Total Pacientes</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg1">
                <i className="fa fa-user-md" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{countMedico}</h3>
                <span className="widget-title1">Total Médicos</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg3">
                <i className="fa fa-stethoscope" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>{appointments.length}</h3>
                <span className="widget-title3">Total Consultas</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="dash-widget" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <span className="dash-widget-bg4">
                <i className="fa fa-heartbeat" aria-hidden="true"></i>
              </span>
              <div className="dash-widget-info text-right">
                <h3>80</h3>
                <span className="widget-title4">Atendidos</span>
              </div>
            </div>
          </div>
        </div>
        {/* Seção dos Gráficos */}
        <div className="row">
          {/* Consultas por Mês */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="card-header">
                <h4 className="card-title">📊 Consultas por Mês ({new Date().getFullYear()})</h4>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center text-muted" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <i className="fa fa-spinner fa-spin fa-2x mb-2"></i>
                      <p>Carregando dados...</p>
                    </div>
                  </div>
                ) : consultasMensaisDataReal.length > 0 ? (
                  <ConsultasMensaisChart data={consultasMensaisDataReal} />
                ) : (
                  <div className="text-center text-muted" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <i className="fa fa-chart-bar fa-2x mb-2"></i>
                      <p>Nenhum dado encontrado</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top 10 Médicos */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="card-header">
                <h4 className="card-title">🏆 Top 10 Médicos (Consultas)</h4>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center text-muted" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <i className="fa fa-spinner fa-spin fa-2x mb-2"></i>
                      <p>Carregando dados...</p>
                    </div>
                  </div>
                ) : (
                  <ConsultasPorMedicoChart data={consultasPorMedicoData} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Pacientes Ativos/Inativos */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="card-header">
                <h4 className="card-title">👥 Pacientes Ativos x Inativos</h4>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center text-muted" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <i className="fa fa-spinner fa-spin fa-2x mb-2"></i>
                      <p>Carregando dados...</p>
                    </div>
                  </div>
                ) : pacientesStatusDataReal.length > 0 ? (
                  <AtivosInativosChart data={pacientesStatusDataReal} />
                ) : (
                  <div className="text-center text-muted" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <i className="fa fa-pie-chart fa-2x mb-2"></i>
                      <p>Nenhum dado encontrado</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Taxa de Cancelamentos */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="card-header">
                <h4 className="card-title">📉 Taxa de Cancelamentos</h4>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center text-muted" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <i className="fa fa-spinner fa-spin fa-2x mb-2"></i>
                      <p>Carregando dados...</p>
                    </div>
                  </div>
                ) : (
                  <TaxaCancelamentosChart data={taxaCancelamentosData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS customizado para o SecretariaDashboard (mesmo estilo do AdminDashboard)
const style = document.createElement('style');
style.textContent = `
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
  
  .dash-widget {
    transition: transform 0.2s ease;
  }
  
  .dash-widget:hover {
    transform: translateY(-3px);
  }
  
  .card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
  }
`;

if (!document.head.querySelector('[data-secretaria-dashboard-styles]')) {
  style.setAttribute('data-secretaria-dashboard-styles', 'true');
  document.head.appendChild(style);
}

export default SecretariaDashboard;