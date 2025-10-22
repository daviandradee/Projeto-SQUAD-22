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
        text: Company,
    }]);
    const [showChatbot, setShowChatbot] = useState(false);
    const chatBodyRef = useRef()
    const [disponibilidadeMedicos, setDisponibilidadeMedicos] = useState([]);
    const [MedicosMap, setMedicosMap] = useState({});
    const user = { id: 'a8039e6d-7271-4187-a719-e27d9c6d15b3', full_name: 'Davi Andrade Farias Alves - SQUAD 22' };
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
            name: "listarinformaçoes",
            keywords: ["listar", "ver", "analisar", "mostrar", "mostre", "quais", "exibir", "exiba"],
            entities: [
                { name: "paciente", values: ["pacientes", "paciente", "pessoas", "pessoa"] },
                { name: "medico", values: ["médicos", "medicos", "médico", "medico", "doutores", "profissionais", "especialidades"] },
                { name: "horario", values: ["horários", "horarios", "horário", "horario", "disponibilidade", "disponiveis", "disponíveis", "disponível", "disponivel"] }
            ],
            action: async (lastMessage, updateHistory, matchedEntity) => {
                switch (matchedEntity.name) {
                    case "paciente":
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
                        break;
                    case "medico":
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
                        break;
                    case "horario":
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
                        break;
                    default:
                        updateHistory("Não entendi o que você quer listar. Você pode pedir por pacientes, médicos, ou horários")
                }
            },
        },

        {
            name: "iniciarcadastro",
            keywords: ["cadastrar", "adicionar", "criar", "registrar", "incluir", "novo"],
            entities: [
                { name: "paciente", values: ["pacientes", "paciente", "pessoa", "pessoas", "cliente", "clientes"] }
            ],
            action: async (lastMessage, updateHistory, matchedEntity) => {
                switch (matchedEntity.name) {
                    case "paciente":
                        updateHistory(
                            "Beleza! 🩺 Me envie os dados do paciente assim:\n\n👉 nome: João; cpf: 12345678900; telefone: 11999999999; email: joao@email.com; data de nascimento:24/09/2006"
                        );
                        break
                    //mais dps
                    default:
                        updateHistory("Não entendi o que você deseja cadastrar. Por favor, seja mais específico.")
                }
            }
        },
        {
            name: "salvarPaciente",
            condition: (text) => text.includes("nome:") && text.includes("cpf:"),
            action: async (lastMessage, updateHistory) => {
                const token = getAccessToken()
                console.log("🔥 Entrou em salvarPaciente");
                console.log("Mensagem recebida:", lastMessage);
                console.log("Token:", getAccessToken());
                try {
                    // 1️⃣ Limpa quebras de linha
                    const cleanedMessage = lastMessage.replace(/\r?\n/g, ' ');

                    // 2️⃣ Extrai o telefone

                    const nome = lastMessage.match(/nome:\s*([^;]+)/)?.[1]?.trim();
                    const cpf = lastMessage.match(/cpf:\s*([^;]+)/)?.[1]?.trim();
                    const telefoneRaw = cleanedMessage.match(/telefone:\s*([^\s;]+)/i)?.[1]?.trim();
                    const telefone = telefoneRaw ? telefoneRaw.replace(/\D/g, '') : null;
                    const email = lastMessage.match(/email:\s*([^;]+)/)?.[1]?.trim();
                    const birth_date_raw = lastMessage.match(/data de nascimento:\s*([^;]+)/)?.[1]?.trim();
                    let birth_date_formatted = null;

                    if (birth_date_raw) {
                        const separator = birth_date_raw.includes('/') ? '/' : '-';
                        const parts = birth_date_raw.split(separator);
                        if (parts.length === 3) {
                            const [dd, mm, yyyy] = parts;
                            birth_date_formatted = `${yyyy}-${mm}-${dd}`;
                        } else {
                            console.warn("Formato de data inválido:", birth_date_raw);
                            birth_date_formatted = null;
                        }
                    }
                    const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            full_name: nome,
                            cpf: cpf,
                            phone_mobile: telefone,
                            email: email,
                            birth_date: birth_date_formatted

                        }),
                    });
                    console.log("📥 Status:", response.status);

                    let data;
                    try {
                        const text = await response.text();
                        data = text ? JSON.parse(text) : {};
                    } catch (err) {
                        data = {};
                    }   
                    console.log("📥 Resposta da API:", data);



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
        setChatHistory(prev => [...prev.filter(msg => msg.text !== "Pensando..."), { role: "model", text, isError }]);
    };
    
    const lastUserMessage = history[history.length - 1].text.toLowerCase();
    let intentFound = false;

    // ESTA NOVA LÓGICA FAZ A VERIFICAÇÃO EM DUAS ETAPAS
    for (const intent of intents) {
        // 1. Checa intents com condição especial (como "salvarPaciente")
        if (intent.condition && intent.condition(lastUserMessage)) {
            await intent.action(lastUserMessage, updateHistory);
            intentFound = true;
            break; 
        }

        // 2. Checa intents que usam KEYWORDS + ENTITIES (como "listarInformacoes")
        if (intent.keywords && intent.entities) {
            const actionKeyword = intent.keywords.find(kw => lastUserMessage.includes(kw.toLowerCase()));
            
            if (actionKeyword) { // Se encontrou uma ação como "ver"...
                let matchedEntity = null;
                // ...agora procura por uma entidade como "pacientes" ou "médicos"
                for (const entity of intent.entities) {
                    const entityValue = entity.values.find(val => lastUserMessage.includes(val.toLowerCase()));
                    if (entityValue) {
                        matchedEntity = entity; // Encontramos!
                        break;
                    }
                }
                
                if (matchedEntity) {
                    // Encontrou AÇÃO + ENTIDADE! Executa e passa a entidade encontrada.
                    await intent.action(lastUserMessage, updateHistory, matchedEntity);
                    intentFound = true;
                    break;
                }
            }
        }

        // 3. Checa intents com KEYWORDS simples, sem entidades (como "cadastrarPaciente")
        if (intent.keywords && !intent.entities && !intent.condition) {
             if (intent.keywords.some((kw) => lastUserMessage.includes(kw.toLowerCase()))) {
                await intent.action(lastUserMessage, updateHistory);
                intentFound = true;
                break;
             }
        }
    }

    // Se um intent local foi encontrado e executado, a função para aqui.
    if (intentFound) {
        return; 
    }

    // 4. Se NADA foi encontrado localmente, chama a API externa como fallback
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Corrigido
        body: JSON.stringify({ contents: history })
    };
    try {
        const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message || "Algo deu errado"); // Corrigido
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        updateHistory(apiResponseText);
    } catch (error) {
        updateHistory(error.message, true);
    }
};
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
                    <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}
                     />
                     
                </div>

            </div>
        </div>

    )
}

export default Chatbox;