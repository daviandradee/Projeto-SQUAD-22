import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  ArrowBack, 
  CalendarToday, 
  AccessTime, 
  Person,
  LocalHospital,
  CheckCircle,
  Email,
  Sms
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AgendarConsulta = () => {
  const { medicoId } = useParams();
  const navigate = useNavigate();
  const [medico, setMedico] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [agendando, setAgendando] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [enviarEmail, setEnviarEmail] = useState(true);
  const [enviarSMS, setEnviarSMS] = useState(true);
  const [minDate, setMinDate] = useState("");
  let [confirmationModal, setConfirmationModal] = useState(false);

  confirmationModal = async () => {
              Swal.fire({
                title: "Consulta marcada",
                text: `Sua consulta com ${medico.nome} foi marcada com sucesso.`,
                icon: "success",
                timer: 1800,
                showConfirmButton: false,
              });
              setConfirmationModal(true);
              navigate("/patientapp/minhasconsultas");
            }

  useEffect(() => {
    const getToday = () => {
      const today = new Date();
      const offset = today.getTimezoneOffset();
      today.setMinutes(today.getMinutes() - offset);
      return today.toISOString().split("T")[0];
    };

    setMinDate(getToday());
  }, []);

  // Dados mock - substitua pela sua API
  const medicoMock = {
    id: medicoId,
    nome: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    valorConsulta: 250,
    foto: '',
    biografia: 'Especialista em cardiologia com 10 anos de experiência.'
  };

  const horariosMock = [
    { id: 1, data: '2024-01-15', hora: '08:00', disponivel: true },
    { id: 2, data: '2024-01-15', hora: '09:00', disponivel: true },
    { id: 3, data: '2024-01-15', hora: '10:00', disponivel: true },
    { id: 4, data: '2024-01-16', hora: '14:00', disponivel: true },
    { id: 5, data: '2024-01-16', hora: '15:00', disponivel: true },
    { id: 6, data: '2024-01-17', hora: '09:00', disponivel: true },
    { id: 7, data: '2024-01-17', hora: '10:00', disponivel: true },
    { id: 8, data: '2024-01-18', hora: '11:00', disponivel: true },
  ];

  useEffect(() => {
    carregarMedicoEHorarios();
  }, [medicoId]);

  const carregarMedicoEHorarios = async () => {
    setLoading(true);
    try {
      // TODO: Substituir pelas APIs reais
      // const medicoResponse = await fetch(`/api/medicos/${medicoId}`);
      // const medicoData = await medicoResponse.json();
      
      // const horariosResponse = await fetch(`/api/medicos/${medicoId}/horarios-disponiveis`);
      // const horariosData = await horariosResponse.json();

      // Usando dados mock
      setTimeout(() => {
        setMedico(medicoMock);
        setHorariosDisponiveis(horariosMock);
        
        if (horariosMock.length > 0) {
          setDataSelecionada(horariosMock[0].data);
        }
        
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMedico(medicoMock);
      setHorariosDisponiveis(horariosMock);
      setLoading(false);
    }
  };

  const selecionarHorario = (horario) => {
    setHorarioSelecionado(horario);
    setModalConfirmacao(true);
    setActiveStep(0);
  };

  const confirmarAgendamento = async () => {
    setAgendando(true);
    
    try {
      // TODO: Substituir pela API real de agendamento
      const agendamentoData = {
        medicoId: medico.id,
        medicoNome: medico.nome,
        especialidade: medico.especialidade,
        data: dataSelecionada,
        hora: horarioSelecionado.hora,
        horarioId: horarioSelecionado.id,
        valorConsulta: medico.valorConsulta,
        enviarEmail,
        enviarSMS
      };

      // Simulando API de agendamento
      // const response = await fetch('/api/consultas/agendar', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(agendamentoData)
      // });

      // if (!response.ok) throw new Error('Erro ao agendar');
      
      // Simulando sucesso
      setTimeout(() => {
        setActiveStep(2);
        setAgendando(false);
        
        // Aqui a consulta seria adicionada automaticamente na agenda do médico
        console.log('Consulta agendada na agenda do médico:', agendamentoData);
        
      }, 2000);
      
    } catch (error) {
      console.error('Erro no agendamento:', error);
      alert('Erro ao realizar agendamento. Tente novamente.');
      setAgendando(false);
    }
  };

  const finalizarAgendamento = () => {
    setModalConfirmacao(false);
    navigate('/patientapp/minhasconsultas');
  };

  const datasDisponiveis = [...new Set(horariosDisponiveis.map(h => h.data))];
  const horariosDaData = horariosDisponiveis.filter(h => h.data === dataSelecionada);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Confirme os dados da consulta:
            </Typography>
            
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography><strong>Médico:</strong> Dr. {medico.nome}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospital sx={{ mr: 1, color: 'primary.main' }} />
                <Typography><strong>Especialidade:</strong> {medico.especialidade}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography><strong>Data:</strong> {new Date(dataSelecionada).toLocaleDateString('pt-BR')}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                <Typography><strong>Horário:</strong> {horarioSelecionado?.hora}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography><strong>Valor:</strong> R$ {medico.valorConsulta}</Typography>
              </Box>
            </Paper>

            <Alert severity="info">
              Chegue com 15 minutos de antecedência para o atendimento.
            </Alert>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Escolha como deseja receber as confirmações:
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={enviarEmail}
                  onChange={(e) => setEnviarEmail(e.target.checked)}
                  icon={<Email />}
                  checkedIcon={<Email color="primary" />}
                />
              }
              label="Receber confirmação por E-mail"
              sx={{ mb: 2, display: 'block' }}
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={enviarSMS}
                  onChange={(e) => setEnviarSMS(e.target.checked)}
                  icon={<Sms />}
                  checkedIcon={<Sms color="primary" />}
                />
              }
              label="Receber confirmação por SMS"
              sx={{ display: 'block' }}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              Você também receberá um lembrete 24 horas antes da consulta.
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="success.main">
              Consulta Agendada com Sucesso!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Sua consulta foi agendada para {new Date(dataSelecionada).toLocaleDateString('pt-BR')} às {horarioSelecionado?.hora}
            </Typography>
            <Alert severity="success">
              A consulta foi adicionada à agenda do Dr. {medico.nome} e as confirmações foram enviadas.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando horários...</Typography>
      </Container>
    );
  }

  if (!medico) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Médico não encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/patientapp/medicosdisponiveis')}
        sx={{ mb: 3 }}
      >
        Voltar para Médicos
      </Button>

      {/* Cabeçalho do Médico */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                mr: 2,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {medico.nome.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Dr. {medico.nome}
              </Typography>
              <Chip label={medico.especialidade} color="primary" size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {medico.biografia}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <form>
        <hr />
                <h3>Informações do atendimento</h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Data<span className="text-danger">*</span></label>
                      <div>
                        <input
                          type="date"
                          className="form-control"
                          min={minDate}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Horas<span className="text-danger">*</span></label>
                      <div>
                        <input type="time" className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Observação</label>
                  <textarea cols="30" rows="4" className="form-control"></textarea>
                </div>

                <div className="form-group">
                  <label className="display-block">Status da consulta</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="status"
                      id="product_active"
                      value="option1"
                      defaultChecked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="product_active"
                    >
                      Receber confirmação por SMS
                    </label>
                  </div>
                </div>

                <div className="m-t-20 text-center">
                    <button
                      className="btn btn-primary submit-btn"
                      type="button"
                      onClick={confirmationModal}
                      >
                      Marcar consulta
                    </button>
                </div>
      </form>
    </Container>
  );
};

export default AgendarConsulta;