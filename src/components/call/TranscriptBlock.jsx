import React, { useState, useRef, useEffect } from "react";
import { getAccessToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { getDoctorId } from "../../utils/userInfo";
import Swal from "sweetalert2";

const TranscriptBlock = ({ appointmentId, doctor_id, patient_id, exam }) => {
    const [transcript, setTranscript] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();
    const [laudos, setLaudos] = useState({
        patient_id: patient_id,
        order_number: "",
        exam: exam || "",
        diagnosis: "",
        conclusion: "",
        cid_code: "",
        content_html: transcript,
        status: "draft",
        requested_by: doctor_id,
    });
    const isMedico = getDoctorId() === doctor_id;

    const Change = (e) => {
        const { name, value } = e.target;
        setLaudos((prev) => ({ ...prev, [name]: value }));
    };
    const handleChange = (event) => {
        setTranscript(event.target.value);
    };
    useEffect(() => {
        setLaudos((prev) => ({
            ...prev,
            content_html: transcript
        }));
    }, [transcript]);

    const handleStartStop = () => {
        if (!isRecording) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Seu navegador não suporta reconhecimento de voz.");
                return;
            }
            const recognition = new SpeechRecognition();
            recognition.lang = "pt-BR";
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = (event) => {
                let interim = "";
                let final = "";
                for (let i = 0; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }
                setTranscript((prev) => final + interim);
            };
            recognition.onend = () => setIsRecording(false);
            recognition.onerror = () => setIsRecording(false);
            recognitionRef.current = recognition;
            recognition.start();
            setIsRecording(true);
        } else {
            recognitionRef.current && recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSaveAsLaudo = async () => {
        setIsSaving(true);
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const tokenUsuario = getAccessToken();
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": supabaseAK,
                    "Authorization": `Bearer ${tokenUsuario}`
                },
                body: JSON.stringify({ ...laudos })
            });
            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Laudo salvo com sucesso!',
                    showConfirmButton: false,
                    timer: 1800
                });
            } else {
                const error = await response.text();
                await Swal.fire({
                    icon: 'error',
                    title: 'Erro ao salvar o laudo',
                    text: error,
                });
                console.log("Payload enviado:", laudos);
            }
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao salvar o laudo',
                text: err.message || '',
            });
        }
        setIsSaving(false);
    };

    const handleCorrigirComIA = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        { role: "user", parts: [{ text: `Corrija erros de português, termos médicos e pontuação neste texto de transcrição de consulta médica, mantendo o sentido original e sem inventar informações. Responda apenas com o texto corrigido.\n\n${transcript}` }] }
                    ]
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Erro ao corrigir com IA");
            const textoCorrigido = data.candidates?.[0]?.content?.parts?.[0]?.text || transcript;
            setTranscript(textoCorrigido.trim());
            await Swal.fire({
                icon: 'success',
                title: 'Texto corrigido com IA!',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao corrigir com IA',
                text: err.message || '',
            });
        }
        setIsSaving(false);
    };

    // NOVO: Finalizar consulta
    const handleFinalizarConsulta = async () => {
        setIsSaving(true);
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const tokenUsuario = getAccessToken();
        try {
            await fetch(`${supabaseUrl}/rest/v1/appointments?id=eq.${appointmentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": supabaseAK,
                    "Authorization": `Bearer ${tokenUsuario}`
                },
                body: JSON.stringify({ status: "completed" })
            });
            await Swal.fire({
                icon: 'success',
                title: 'Consulta finalizada!',
                showConfirmButton: false,
                timer: 1800
            });
            navigate("/"); // Altere para o caminho do seu menu/dash se necessário
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao finalizar consulta',
                text: err.message || '',
            });
        }
        setIsSaving(false);
    };

    const buttonStyle = {
        padding: "10px 24px",
        fontSize: "1rem",
        borderRadius: "8px",
        background: isRecording ? '#e74c3c' : '#1976d2',
        color: "#fff",
        border: "none",
        cursor: "pointer",
        marginTop: "12px",
        marginRight: "8px",
        transition: "background 0.2s"
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        background: "#fff",
        color: "#1976d2",
        border: "1px solid #1976d2"
    };

    return (
        <div style={{ background: "#1c1f2e", padding: "32px 24px", margin: 0, minHeight: 0, height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", flex: 1, border: 'none' }}>
            <h3 style={{ marginBottom: 8, color: "#1976d2", fontWeight: 600 }}>
                Transcrição / Bloco de Texto
            </h3>
            <p style={{ color: "#aaa", marginBottom: 16, fontSize: 14 }}>
                Você pode digitar, colar, editar manualmente, usar o microfone para transcrever ou corrigir com IA.
            </p>
            <button
                onClick={handleStartStop}
                style={buttonStyle}
                onMouseOver={e => e.currentTarget.style.background = isRecording ? '#c0392b' : '#1565c0'}
                onMouseOut={e => e.currentTarget.style.background = isRecording ? '#e74c3c' : '#1976d2'}
            >
                {isRecording ? "Parar Transcrição" : "Iniciar Transcrição por Voz"}
            </button>
            <button
                onClick={handleCorrigirComIA}
                style={{ ...buttonStyle, background: isSaving ? '#bdbdbd' : '#ff9800', marginTop: 12 }}
                disabled={isSaving || !transcript.trim()}
            >
                {isSaving ? 'Aguarde...' : 'Corrigir com IA'}
            </button>
            <textarea
                value={transcript}
                onChange={handleChange}
                rows={10}
                style={{ width: "100%", padding: "14px", fontSize: "1rem", marginTop: 12, marginBottom: 12, background: '#23263a', color: '#fff', minHeight: 180, borderRadius: 8, border: '1px solid #444' }}
                placeholder="Digite ou cole aqui o texto do laudo ou transcrição..."
            />
            <input
                type="text"
                name="diagnosis"
                value={laudos.diagnosis}
                onChange={Change}
                style={{ width: "100%", padding: "12px", fontSize: "1rem", marginBottom: 12, background: '#23263a', color: '#fff', borderRadius: 8, border: '1px solid #444' }}
                placeholder="Diagnóstico"
            />
            <input
                type="text"
                name="conclusion"
                value={laudos.conclusion}
                onChange={Change}
                style={{ width: "100%", padding: "12px", fontSize: "1rem", marginBottom: 12, background: '#23263a', color: '#fff', borderRadius: 8, border: '1px solid #444' }}
                placeholder="Conclusão"
            />
            <button
                onClick={handleSaveAsLaudo}
                style={{ ...buttonStyle, background: isSaving ? '#bdbdbd' : '#388e3c', marginTop: 24 }}
                disabled={isSaving || !transcript.trim()}
            >
                {isSaving ? 'Salvando...' : 'Salvar como Laudo'}
            </button>
            {isMedico && (
                <button
                    onClick={handleFinalizarConsulta}
                    style={{ ...buttonStyle, background: '#ff2c2c ', marginTop: 16 }}
                    disabled={isSaving}
                >
                    Finalizar Consulta
                </button>
            )}
        </div>
    );
};

export default TranscriptBlock;
