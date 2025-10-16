import ChatbotIcon from "./ChatbotIcon"
import "../assets/css/index.css"
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { useState, useRef, useEffect } from "react";
import { Company } from "../Company";
import { getAccessToken } from "../utils/auth";


function Chatbox() {
    const token = getAccessToken();
    const [chatHistory, setChatHistory] = useState([{
        hideInchat: true,
        role: "model",
        text: Company
    }]);
    const [showChatbot, setShowChatbot] = useState(false);
    const chatBodyRef = useRef()
    const [disponibilidadeMedicos, setDisponibilidadeMedicos] = useState([]);
    const [MedicosMap, setMedicosMap] = useState({});
    // 1) Buscar doctor_availability UMA ÚNICA VEZ quando o componente montar
    useEffect(() => {
        const buscarDisponibilidade = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ", // MINÚSCULO
                };

                const res = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctor_availability`, {
                    method: "GET",
                    headers,
                });

                if (!res.ok) {
                    console.error("Erro ao buscar disponibilidade:", res.status, await res.text());
                    setDisponibilidadeMedicos([]);
                    return;
                }

                const result = await res.json();
                setDisponibilidadeMedicos(Array.isArray(result) ? result : []);
            } catch (err) {
                console.error("Erro na requisição de disponibilidade:", err);
                setDisponibilidadeMedicos([]);
            }
        };

        buscarDisponibilidade();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // roda só uma vez

    // 2) Quando disponibilidadeMedicos chegar, buscar nomes dos doctors (evita fetch por item repetido)
    useEffect(() => {
        if (!Array.isArray(disponibilidadeMedicos) || disponibilidadeMedicos.length === 0) return;

        const buscarMedicos = async () => {
            try {
                const idsUnicos = [...new Set(disponibilidadeMedicos.map((d) => d.doctor_id).filter(Boolean))];
                if (idsUnicos.length === 0) return;

                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
                };

                const promises = idsUnicos.map(async (id) => {
                    try {
                        const res = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${id}`, {
                            method: "GET",
                            headers,
                        });
                        if (!res.ok) return { id, full_name: "Nome não encontrado" };
                        const data = await res.json();
                        return { id, full_name: data?.[0]?.full_name || "Nome não encontrado" };
                    } catch {
                        return { id, full_name: "Nome não encontrado" };
                    }
                });

                const results = await Promise.all(promises);
                const map = {};
                results.forEach((r) => (map[r.id] = r.full_name));
                setMedicosMap(map);
            } catch (err) {
                console.error("Erro ao buscar nomes dos médicos:", err);
            }
        };

        buscarMedicos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disponibilidadeMedicos]);

    const intents = [
        {
            name: "listarPacientes",
            keywords: ["listar pacientes", "mostrar pacientes", "mostre pacientes", "ver pacientes", "exibir pacientes", "quais pacientes", "quem são os pacientes", "todos os pacientes"],
            description: "Lista todos os pacientes cadastrados no sistema.",
            action: async (lastMessage, updateHistory) => {
                try {
                    const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                            "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error.message || "Erro ao buscar pacientes.");

                    if (data.length === 0) {
                        updateHistory("Nenhum paciente encontrado.");
                    } else {
                        const pacientesList = data.map(paciente => `- ${paciente.full_name} `).join("\n");
                        updateHistory(`Pacientes cadastrados:\n${pacientesList}`);
                    }
                } catch (error) {
                    updateHistory(`Erro: ${error.message}`, true);
                }
            }
        },
        {
            name: "listarMedicos",
            keywords: ["listar medicos", "mostrar medicos", "me mostre medicos", "ver medicos", "exibir medicos", "quais medicos", "quem são os medicos", "todos os medicos"],
            description: "Lista todos os medicos cadastrados no sistema.",
            action: async (lastMessage, updateHistory) => {
                try {
                    const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                            "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error.message || "Erro ao buscar medicos.");

                    if (data.length === 0) {
                        updateHistory("Nenhum medico encontrado.");
                    } else {
                        const medicosList = data.map(medicos => `- ${medicos.full_name} 
                                     Especialidade:${medicos.specialty} 
                                     `).join("\n");
                        updateHistory(`Medicos cadastrados:\n${medicosList}`);
                    }
                } catch (error) {
                    updateHistory(`Erro: ${error.message}`, true);
                }
            }
        },
        {
            name: "listarhorariosMedicos",
            keywords: ["listar horarios medicos", "mostrar horarios medicos", "me mostre horarios medicos", "ver horarios medicos", "exibir horarios medicos", "quais horarios medicos", "quem são os horarios medicos", "todos os horarios medicos", "listar horarios do medico", "mostrar horarios do medico", "me mostre horarios do medico", "ver horarios do medico", "exibir horarios do medico", "quais horarios do medico", "quem são os horarios do medico", "todos os horarios do medico", "listar horarios", "mostrar horarios", "me mostre horarios", "ver horarios", "exibir horarios", "quais horarios", "todos os horarios", "disponibilidade medicos", "disponibilidade do medico", "quais horarios disponiveis", "quais horarios disponiveis do medico", "horarios disponiveis", "horarios disponiveis do medico"],
            description: "Mostrar todos os horarios disponiveis do medico.",
            action: async (lastMessage, updateHistory) => {
                try {
                    const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctor_availability", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                            "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error.message || "Erro ao buscar medicos.");

                    if (data.length === 0) {
                        updateHistory("Nenhum medico encontrado.");
                    } else {
                        const horariosList = data.map(horario => {
                            const nomeMedico = MedicosMap[horario.doctor_id] || "Médico desconhecido";
                            return `- ${nomeMedico}
                                    Dia: ${horario.weekday}
                                    Horário: ${horario.start_time} às ${horario.end_time}`;
                        }).join("\n");
                        updateHistory(`Horarios:\n${horariosList}`);
                    }
                } catch (error) {
                    updateHistory(`Erro: ${error.message}`, true);
                }
            }
        },
        {
            name: "cadastrarPaciente",
            keywords: [
                "cadastrar paciente",
                "criar paciente",
                "adicionar paciente",
                "novo paciente",
                "registrar paciente",
            ],
            action: async (lastMessage, updateHistory) => {
                updateHistory(
                    "Beleza! 🩺 Me envie os dados do paciente assim:\n\n👉 nome: João; cpf: 12345678900; telefone: 11999999999; email: joao@email.com"
                );
            },
        },
        {
            name: "salvarPaciente",
            condition: (text) => text.includes("nome:") && text.includes("cpf:"),
            action: async (lastMessage, updateHistory) => {
                try {
                    const nome = lastMessage.match(/nome:\s*([^;]+)/)?.[1]?.trim();
                    const cpf = lastMessage.match(/cpf:\s*([^;]+)/)?.[1]?.trim();
                    const telefone = lastMessage.match(/telefone:\s*([^;]+)/)?.[1]?.trim();
                    const email = lastMessage.match(/email:\s*([^;]+)/)?.[1]?.trim();

                    const response = await fetch("https://SEU_URL_SUPABASE/rest/v1/patients", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            apikey: import.meta.env.VITE_SUPABASE_KEY,
                            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
                        },
                        body: JSON.stringify({
                            name: nome,
                            cpf,
                            phone: telefone,
                            email,
                        }),
                    });

                    if (!response.ok) throw new Error("Erro ao cadastrar paciente 😢");

                    updateHistory(`Paciente ${nome} cadastrado com sucesso! 🩺✨`);
                } catch (error) {
                    updateHistory(error.message, true);
                }
            },
        },

    ]
    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "Pensando..."), { role: "model", text, isError }])
        }
        const lastUserMessage = history[history.length - 1].text.toLowerCase()
        const matchedIntent = intents.find(
            (intent) =>
                (intent.keywords &&
                    intent.keywords.some((kw) => lastUserMessage.includes(kw.toLowerCase()))) ||
                (intent.conditions && intent.conditions(lastUserMessage))
        );
        if (matchedIntent) {
            await matchedIntent.action(lastUserMessage, updateHistory)
            return
        }
        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }))
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "aplication/json" },
            body: JSON.stringify({ contents: history })
        }
        try {
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
            const data = await response.json()
            if (!response.ok) throw new error(data.error.message || "Algo deu errado")

            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
            updateHistory(apiResponseText)
        } catch (error) {
            updateHistory(error.message, true)
        }
    }

    useEffect(() => {
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" })
    }, [chatHistory])
    {/*
        nosso chat */}
    return (
        <div className={`container-chatbox ${showChatbot ? "show-chatbot" : ""}`}>
            <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
                <span className="material-symbols-rounded">mode_comment</span>
                <span className="material-symbols-rounded">close</span>
            </button>
            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">MediChat</h2>
                    </div>
                    <button onClick={() => setShowChatbot(prev => !prev)}
                        className="material-symbols-rounded">keyboard_arrow_down</button>
                </div>
                <div ref={chatBodyRef} className="chat-body">
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            Bem-vindo 👋 <br /> Sou a assistente virtual da MediConnect, como posso te ajudar?
                        </p>
                    </div>
                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}

                </div>
                <div className="chat-footer">
                    <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                </div>

            </div>
        </div>

    )
}

export default Chatbox;