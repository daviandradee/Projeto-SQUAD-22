import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { getFullName } from "../../utils/userInfo";
import { getPatientId } from "../../utils/userInfo";
import { getAccessToken } from "../../utils/auth";
import { getDoctorId } from "../../utils/userInfo";
import TranscriptBlock from "./TranscriptBlock"; // Componente da barra lateral

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
    });
  }, [kitToken, canJoin, userInfo]);


  // --- ESTILOS RESPONSIVOS E DE CORES ---

  const fullScreenStyle = {
    width: "100vw", 
    height: "100vh", 
    margin: 0, 
    padding: 0, 
    overflow: "hidden",
    boxSizing: 'border-box',
  };

  const callContainerStyle = isMobile ? 
    { 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      width: "100%",
      boxSizing: 'border-box',
    } : 
    { 
      display: "flex", 
      height: "100%", 
      width: "100%",
      boxSizing: 'border-box',
    };

  // Ajuste AQUI
  const videoAreaStyle = isMobile ? 
    { 
      flex: 'none',
      width: "100%",
      height: "40vh", // <<< NOVO E ÚLTIMO AJUSTE: Reduzido para 40vh (dá mais folga)
      minHeight: "300px",
      boxSizing: 'border-box',
    } : 
    { 
      flex: 2, 
      height: "100%",
      boxSizing: 'border-box',
    };

  // Ajuste AQUI
  const transcriptAreaStyle = isMobile ? 
    { 
      flex: 'none',
      width: "100%",
      height: "calc(100vh - 40vh)", // <<< NOVO AJUSTE: Calculado com base em 40vh
      background: "#1c1f2e",
      overflowY: "auto", 
      boxSizing: 'border-box',
      padding: '16px', 
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
            
            {/* Área de Transcrição/Bloco de Texto */}
            <div style={transcriptAreaStyle}>
              {consulta && (
                <TranscriptBlock 
                  appointmentId={roomId}
                  doctor_id={consulta.doctor_id}
                  patient_id={consulta.patient_id}
                  exam={consulta.chief_complaint}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;