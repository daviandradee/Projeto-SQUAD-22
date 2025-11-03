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
import { getAccessToken } from "../../utils/auth";
import { getPatientId } from "../../utils/userInfo";

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
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [formData, setFormData] = useState({
    scheduled_date: "",
    scheduled_time: "",
    chief_complaint: "",
    patient_notes: ""
  });
  let [confirmationModal, setConfirmationModal] = useState(false);

  const tokenUsuario = getAccessToken();
  const patientId = getPatientId();

  const headers = {
    "Content-Type": "application/json",
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
    Authorization: `Bearer ${tokenUsuario}`,
  };

  const handleConfirmationModal = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      alert("Selecione uma data e horário válidos");
      return;
    }

    const confirm = window.confirm(`
      Confirmar agendamento:
      
      Médico: Dr. ${medico?.nome}
      Especialidade: ${medico?.especialidade}
      Data: ${new Date(dataSelecionada).toLocaleDateString('pt-BR')}
      Horário: ${horarioSelecionado ? horarioSelecionado.datetime.split("T")[1].substring(0, 5) : ''}
      Valor: R$ ${medico?.valorConsulta}
      
      Deseja confirmar?
    `);

    if (confirm) {
      await confirmarAgendamento();

      alert(`Consulta marcada com sucesso! Sua consulta com Dr. ${medico.nome} foi agendada.`);
      navigate("/patientapp/minhasconsultas");
    }
  };

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
      // Buscar dados do médico
      const medicoResponse = await fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${medicoId}`,
        { headers }
      );

      if (medicoResponse.ok) {
        const medicoData = await medicoResponse.json();
        if (medicoData.length > 0) {
          const doctorData = medicoData[0];
          setMedico({
            id: doctorData.id,
            nome: doctorData.full_name,
            especialidade: doctorData.specialty,
            valorConsulta: 250, // Valor fixo por enquanto
            foto: '',
            biografia: doctorData.bio || 'Especialista em ' + doctorData.specialty
          });
        } else {
          throw new Error('Médico não encontrado');
        }
      } else {
        throw new Error('Erro ao carregar dados do médico');
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMedico(medicoMock);
      setLoading(false);
    }
  };

  // Função para buscar horários disponíveis
  const fetchHorariosDisponiveis = async (date) => {
    if (!medicoId || !date) {
      setHorariosDisponiveis([]);
      return;
    }

    setCarregandoHorarios(true);

    const startDate = `${date}T00:00:00.000Z`;
    const endDate = `${date}T23:59:59.999Z`;

    const payload = {
      doctor_id: medicoId,
      start_date: startDate,
      end_date: endDate,
      appointment_type: "presencial",
    };

    try {
      const response = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/get-available-slots",
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log("🔍 AgendarConsultas - Resposta da Edge Function:", data);

      if (!response.ok) throw new Error(data.error || "Erro ao buscar horários");

      // Usar exatamente o mesmo formato do AgendaForm
      const slotsDisponiveis = (data?.slots || []).filter((s) => s.available);

      console.log("✅ Slots disponíveis após filtro:", slotsDisponiveis);
      console.log("🔍 Todos os slots (antes do filtro):", data?.slots);
      console.log("❌ Slots NÃO disponíveis:", (data?.slots || []).filter((s) => !s.available));

      console.log("✅ AgendarConsultas - Slots disponíveis após filtro:", slotsDisponiveis);

      setHorariosDisponiveis(slotsDisponiveis);

      if (slotsDisponiveis.length === 0) {
        alert("Nenhum horário disponível para este dia.");
      }
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      setHorariosDisponiveis([]);
      alert("Não foi possível obter os horários disponíveis.");
    } finally {
      setCarregandoHorarios(false);
    }
  };

  // Atualizar horários quando a data muda
  useEffect(() => {
    if (dataSelecionada && medicoId) {
      fetchHorariosDisponiveis(dataSelecionada);
    }
  }, [dataSelecionada, medicoId]);

  const selecionarHorario = (horario) => {
    setHorarioSelecionado(horario);
    setModalConfirmacao(true);
    setActiveStep(0);
  };

  const confirmarAgendamento = async () => {
    setAgendando(true);

    try {
      if (!horarioSelecionado || !horarioSelecionado.datetime) {
        throw new Error("Horário não selecionado corretamente");
      }

      // Usar exatamente o mesmo formato que o AgendaForm
      const scheduled_at = horarioSelecionado.datetime;

      const payload = {
        patient_id: patientId,
        doctor_id: medicoId,
        scheduled_at,
        duration_minutes: 30,
        appointment_type: "presencial",
        chief_complaint: formData.chief_complaint || "Consulta agendada pelo paciente",
        patient_notes: formData.patient_notes || "",
        created_by: patientId,
      };

      const response = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments",
        {
          method: "POST",
          headers: {
            ...headers,
            Prefer: "return=representation",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const consultaCriada = await response.json();
        console.log("Consulta criada:", consultaCriada);

        setActiveStep(2);
        setAgendando(false);

        // Aqui você pode adicionar envio de SMS se necessário
        // if (enviarSMS) {
        //   await sendSMS(telefone, mensagem, patientId);
        // }

      } else {
        const error = await response.json();
        console.error("Erro da API:", error);
        throw new Error("Não foi possível criar a consulta");
      }

    } catch (error) {
      console.error('Erro no agendamento:', error);
      alert(error.message || "Erro ao realizar agendamento. Tente novamente.");
      setAgendando(false);
    }
  };

  const finalizarAgendamento = () => {
    setModalConfirmacao(false);
    navigate('/patientapp/minhasconsultas');
  };

  // Não precisamos mais da linha datasDisponiveis, pois usamos a Edge Function
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
                <Typography><strong>Horário:</strong> {horarioSelecionado ? horarioSelecionado.datetime.split("T")[1].substring(0, 5) : ''}</Typography>
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
              Sua consulta foi agendada para {new Date(dataSelecionada).toLocaleDateString('pt-BR')} às {horarioSelecionado ? horarioSelecionado.datetime.split("T")[1].substring(0, 5) : ''}
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
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Horários Disponíveis<span className="text-danger">*</span></label>
              <div>
                <select
                  className="form-control"
                  value={horarioSelecionado ? horarioSelecionado.datetime.split("T")[1].substring(0, 5) : ""}
                  onChange={(e) => {
                    const horaValue = e.target.value;
                    const horario = horariosDisponiveis.find(slot => {
                      const hora = slot.datetime.split("T")[1].substring(0, 5);
                      return hora === horaValue;
                    });
                    setHorarioSelecionado(horario);
                  }}
                  disabled={carregandoHorarios || !horariosDisponiveis.length}
                >
                  <option value="">
                    {carregandoHorarios
                      ? "Carregando horários..."
                      : horariosDisponiveis.length
                        ? "Selecione um horário"
                        : "Nenhum horário disponível"}
                  </option>
                  {horariosDisponiveis.map((slot) => {
                    const hora = slot.datetime.split("T")[1].substring(0, 5);
                    return (
                      <option key={slot.datetime} value={hora}>
                        {hora}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Motivo da consulta</label>
          <input
            type="text"
            className="form-control"
            value={formData.chief_complaint}
            onChange={(e) => setFormData(prev => ({ ...prev, chief_complaint: e.target.value }))}
            placeholder="Ex: Dor no peito, consulta de rotina..."
          />
        </div>
        <div className="form-group">
          <label>Observações</label>
          <textarea
            cols="30"
            rows="4"
            className="form-control"
            value={formData.patient_notes}
            onChange={(e) => setFormData(prev => ({ ...prev, patient_notes: e.target.value }))}
            placeholder="Observações adicionais (opcional)"
          ></textarea>
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
            onClick={handleConfirmationModal}
            disabled={agendando || !dataSelecionada || !horarioSelecionado}
          >
            {agendando ? "Agendando..." : "Marcar consulta"}
          </button>
        </div>
      </form>
    </Container>
  );
};

export default AgendarConsulta;