import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { getFullName } from "../../utils/userInfo";
import { getPatientId } from "../../utils/userInfo";
import { getAccessToken } from "../../utils/auth";
import { getDoctorId, getUserRole } from "../../utils/userInfo";
import TranscriptBlock from "./TranscriptBlock"; // Componente da barra lateral
import Swal from "sweetalert2";

const RoomPage = () => {
  const { roomId } = useParams();
  const meetingRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const [kitToken, setKitToken] = useState(null);
  const [canJoin, setCanJoin] = useState(false);
  const [consulta, setConsulta] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Variáveis de ambiente e token
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const tokenUsuario = getAccessToken();
  
  // Variável para determinar o modo (Mobile/Desktop)
  const isMobile = windowWidth < 1024; 

  // --- Efeitos e Lógica (Mantidos) ---

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchUserAndValidate() {
      var myHeaders = new Headers();
      myHeaders.append("apikey", supabaseAK);
      myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      // Busca a consulta específica pelo roomId
      const response = await fetch(`${supabaseUrl}/rest/v1/appointments?id=eq.${roomId}`, requestOptions);
      const result = await response.json();
      const consultaData = Array.isArray(result) ? result[0] : null;
      setConsulta(consultaData);
      
      const userPatient = { id: getPatientId(), name: getFullName() };
      const userDoctor = { id: getDoctorId(), name: getFullName() };
      const user = consultaData?.patient_id === userPatient.id ? userPatient : userDoctor;
      
      const isMedico = user.id === consultaData?.doctor_id;
      const uniqueId = (user.id || "") + '-' + Date.now();
      const isResponsavel = user.id === consultaData?.doctor_id || user.id === consultaData?.patient_id;
      
      if (isResponsavel) {
        setUserInfo({ name: user.name, id: uniqueId, isMedico });
      } else {
        alert('Você não tem permissão para acessar esta sala.');
      }
    }
    fetchUserAndValidate();
  }, [roomId, supabaseAK, supabaseUrl, tokenUsuario]);

  useEffect(() => {
    if (!userInfo) return;
    const appID = 1934403252;
    const serverSecret = "7290704fc5dca533b3633cf22b1a2635";
    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userInfo.id,
      userInfo.name
    );
    setKitToken(token);
  }, [userInfo, roomId]);

  const handleJoin = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(() => {
        setCanJoin(true);
      })
      .catch(() => {
        alert('Permita o acesso à câmera e microfone para usar a videoconferência.');
      });
  };

  // Função para agendar próxima consulta para o paciente
  const handleAgendarProximaConsulta = async () => {
    if (!consulta || !consulta.scheduled_at) return;
    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Agendar próxima consulta?',
      text: 'Deseja agendar uma nova consulta para daqui a 14 dias, no mesmo horário da consulta atual?',
      showCancelButton: true,
      confirmButtonText: 'Sim, agendar',
      cancelButtonText: 'Não'
    });
    if (confirm.isConfirmed) {
      // Calcula o novo horário para daqui a 14 dias
      const horarioAtual = new Date(consulta.scheduled_at);
      const novoHorario = new Date(horarioAtual.getTime());
      novoHorario.setDate(novoHorario.getDate() + 14);
      // Formata data para busca de disponibilidade
      const date = novoHorario.toISOString().slice(0, 10); // yyyy-mm-dd
      const startDate = `${date}T00:00:00.000Z`;
      const endDate = `${date}T23:59:59.999Z`;
      // Busca todas as consultas do médico nesse dia
      const urlDisponibilidade = `${supabaseUrl}/rest/v1/appointments?doctor_id=eq.${consulta.doctor_id}&scheduled_at=gte.${startDate}&scheduled_at=lte.${endDate}`;
      const respDisp = await fetch(urlDisponibilidade, {
        method: 'GET',
        headers: {
          'apikey': supabaseAK,
          'Authorization': `Bearer ${tokenUsuario}`,
        }
      });
      const consultasDia = await respDisp.json();
      // Se o médico já tem consultas o dia todo (exemplo: 8h-18h ocupados), não há disponibilidade
      // Aqui considera indisponível se houver 10 ou mais consultas no dia (ajuste conforme sua regra de agenda)
      if (consultasDia.length >= 10) {
        await Swal.fire({
          icon: 'error',
          title: 'Médico indisponível',
          text: 'A doutora não tem horários disponíveis nesse dia. Escolha outro dia.',
        });
        return;
      }
      // Verifica se o horário está livre
      const jaExiste = consultasDia.some(c => {
        const agendado = new Date(c.scheduled_at).getTime();
        return Math.abs(agendado - novoHorario.getTime()) < 1000 * 60; // menos de 1 min de diferença
      });
      if (jaExiste) {
        await Swal.fire({
          icon: 'error',
          title: 'Horário indisponível',
          text: 'Já existe uma consulta marcada para esse horário. Escolha outro horário.',
        });
        return;
      }
      // Horário está livre, pode agendar
      const scheduled_at = novoHorario.toISOString();
      const payload = {
        patient_id: consulta.patient_id,
        doctor_id: consulta.doctor_id,
        scheduled_at,
        duration_minutes: consulta.duration_minutes || 30,
        appointment_type: consulta.appointment_type || 'presencial',
        chief_complaint: consulta.chief_complaint || '',
        patient_notes: consulta.patient_notes || '',
        created_by: consulta.patient_id,
      };
      const agendarResp = await fetch(`${supabaseUrl}/rest/v1/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseAK,
          "Authorization": `Bearer ${tokenUsuario}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(payload)
      });
      if (agendarResp.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Nova consulta agendada!',
          text: `Consulta marcada para ${novoHorario.toLocaleDateString('pt-BR')} às ${novoHorario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
          confirmButtonText: 'OK'
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Erro ao agendar nova consulta',
          text: await agendarResp.text(),
        });
      }
    }
  };

  useEffect(() => {
    if (!kitToken || !meetingRef.current || !canJoin) return;
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: meetingRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      showPreJoinView: false,
      showRemoveUserButton: userInfo?.isMedico === true,
      onLeaveRoom: async () => {
        // Ao sair pelo botão padrão do Zego, pergunta sobre agendar próxima consulta
        if (consulta && getPatientId() === consulta.patient_id) {
          await handleAgendarProximaConsulta();
        }
        // Redireciona imediatamente para a lista de consultas
        window.location.replace(`/${getUserRole()}/consultalist`);
      }
    });
  }, [kitToken, canJoin, userInfo, consulta]);


  // --- ESTILOS RESPONSIVOS E DE CORES ---

  const fullScreenStyle = {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    boxSizing: 'border-box',
    background: '#181a2a',
  };

  const callContainerStyle = isMobile ?
    { 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      width: "100%",
      boxSizing: 'border-box',
      gap: 0,
    } : 
    { 
      display: "flex", 
      height: "100%", 
      width: "100%",
      boxSizing: 'border-box',
      gap: 0,
    };

  const videoAreaStyle = isMobile ? 
    { 
      flex: 'none',
      width: "100%",
      height: "38vh",
      minHeight: "220px",
      boxSizing: 'border-box',
      borderRadius: 0,
      background: '#23263a',
    } : 
    { 
      flex: 2, 
      height: "100%",
      boxSizing: 'border-box',
      borderRadius: 0,
      background: '#23263a',
    };

  const transcriptAreaStyle = isMobile ? 
    { 
      flex: 'none',
      width: "100%",
      height: "calc(100vh - 38vh)",
      background: "#1c1f2e",
      overflowY: "auto", 
      boxSizing: 'border-box',
      padding: '8px',
      fontSize: '0.95rem',
      borderRadius: 0,
    } : 
    { 
      flex: 1, 
      minWidth: 350, 
      maxWidth: 500, 
      background: "#1c1f2e",
      height: "100%", 
      overflowY: "auto",
      boxSizing: 'border-box',
      padding: '16px',
      fontSize: '1rem',
      borderRadius: 0,
    };

  // --- RENDERIZAÇÃO (Mantida) ---

  return (
    <div style={fullScreenStyle}>
      <div style={{ width: "100%", height: "100%" }}>
        {!canJoin ? (
          // Tela de Permissão de Câmera/Microfone
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <h2>Permita o acesso à câmera e microfone para entrar na chamada</h2>
            <button onClick={handleJoin} style={{ padding: "12px 32px", fontSize: "1.2rem", borderRadius: "8px", background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", marginTop: "24px" }}>
              Entrar na chamada
            </button>
          </div>
        ) : (
          // Tela da Chamada com Layout Responsivo
          <div style={callContainerStyle}>
            {/* Área de Vídeo (Zego Cloud) */}
            <div ref={meetingRef} style={videoAreaStyle} />
            
            {/* Área de Transcrição/Bloco de Texto - Só o médico vê */}
            {consulta && userInfo?.isMedico && (
              <TranscriptBlock 
                appointmentId={roomId}
                doctor_id={consulta.doctor_id}
                patient_id={consulta.patient_id}
                exam={consulta.chief_complaint}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;