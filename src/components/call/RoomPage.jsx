import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { getFullName } from "../../utils/userInfo";
import { getPatientId } from "../../utils/userInfo";
import { getAccessToken } from "../../utils/auth";
import { getDoctorId } from "../../utils/userInfo";


const RoomPage = () => {
 const { roomId } = useParams();
 const meetingRef = useRef(null);
 const [userInfo, setUserInfo] = useState(null);
 const [kitToken, setKitToken] = useState(null);
 const [canJoin, setCanJoin] = useState(false);
 const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
 const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;
 const tokenUsuario = getAccessToken();
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
     const consulta = Array.isArray(result) ? result[0] : null;
     const userPatient = { id: getPatientId(), name: getFullName() };
     const userDoctor = { id: getDoctorId(), name: getFullName() };
     const user = consulta?.patient_id === userPatient.id ? userPatient : userDoctor;
     // Define se o usuário é médico
     const isMedico = user.id === consulta?.doctor_id;
     // Gere um ID único para cada aba/janela
     const uniqueId = (user.id || "") + '-' + Date.now();
     // Verifica se o usuário é responsável pela consulta
     const isResponsavel = user.id === consulta?.doctor_id || user.id === consulta?.patient_id;
     if (isResponsavel) {
       setUserInfo({ name: user.name, id: uniqueId, isMedico });
     } else {
       alert('Você não tem permissão para acessar esta sala.');
       // Opcional: redirecionar ou bloquear
     }
   }
   fetchUserAndValidate();
 }, [roomId]);


 // 2. Gerar o token quando userInfo estiver disponível
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


 // 3. Inicializar e entrar na sala quando o token estiver pronto e usuário clicar
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
     showRemoveUserButton: userInfo?.isMedico === true, // só médico pode remover participantes
   });
 }, [kitToken, canJoin, userInfo]);


 return (
   <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
     <div style={{ width: "100%", height: "100%" }}>
       {!canJoin ? (
         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
           <h2>Permita o acesso à câmera e microfone para entrar na chamada</h2>
           <button onClick={handleJoin} style={{ padding: "12px 32px", fontSize: "1.2rem", borderRadius: "8px", background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", marginTop: "24px" }}>
             Entrar na chamada
           </button>
         </div>
       ) : (
         <div ref={meetingRef} style={{ width: "100%", height: "100%" }} />
       )}
     </div>
   </div>
 );
};


export default RoomPage;