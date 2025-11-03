import ChatbotIcon from "./ChatbotIcon"
import "../assets/css/index.css"
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { useState, useRef, useEffect } from "react";
import { Company } from "../Company";
import { getAccessToken } from "../utils/auth";
import { getPatientId } from "../utils/userInfo";

// --- MAPAS DE TRADUÇÃO ---
const dbWeekdayToPt = {
    "monday": "Segunda-feira",
    "tuesday": "Terca-feira",
    "wednesday": "Quarta-feira",
    "thursday": "Quinta-feira",
    "friday": "Sexta-feira",
    "saturday": "Sábado",
    "sunday": "Domingo"
};

const ptWeekdayToDb = {
    "Domingo": "sunday",
    "Segunda-feira": "monday",
    "Terca-feira": "tuesday",
    "Quarta-feira": "wednesday",
    "Quinta-feira": "thursday",
    "Sexta-feira": "friday",
    "Sábado": "saturday"
};

// --- FUNÇÕES HELPER PARA HORÁRIOS ---
// Converte horário "HH:MM:SS" para minutos
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// Converte minutos de volta para "HH:MM:SS"
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:00`;
}

function Chatbox() {
    const token = getAccessToken();
    const [chatHistory, setChatHistory] = useState([{
        hideInchat: true,
        role: "model",
        text: Company,
    }, {
        hideInchat: true,
        role: "model",
        text: `Você é um assistente médico virtual inteligente da MediConnect. Suas responsabilidades:

**IMPORTANTE:** Você NUNCA deve prescrever medicamentos, dar diagnósticos definitivos ou substituir consultas médicas presenciais.

1. **QUANDO USUÁRIO MENCIONAR SINTOMAS/DOENÇAS:**
   - Seja empático e compreensivo
   - Forneça informações educativas gerais sobre o sintoma/condição
   - Dê dicas de cuidados básicos e prevenção (quando aplicável)
   - Explique quando é importante buscar ajuda médica
   - SEMPRE recomende consultar um profissional para avaliação adequada
   - **SEMPRE pergunte se o usuário quer agendar** de forma natural
   - Termine com: "RECOMENDO_CONSULTA: [especialidade]" para ativar detecção de resposta

2. **ESPECIALIDADES DISPONÍVEIS:**
   - **cardiologia**: problemas cardíacos, dor no peito, palpitações, pressão alta
   - **dermatologia**: problemas de pele, acne, manchas, alergias cutâneas
   - **ortopedia**: dores articulares, problemas ósseos, lesões musculares
   - **pediatria**: saúde infantil, desenvolvimento, vacinação
   - **ginecologia**: saúde feminina, menstruação, gravidez
   - **clinico geral**: sintomas gerais, febre, gripe, check-ups
   - **oftalmologia**: problemas de visão, saúde ocular
   - **psiquiatria**: saúde mental, ansiedade, depressão

3. **EXEMPLO DE RESPOSTA ADEQUADA:**
   
   Usuário: "Estou com dor no peito e palpitações"
   
   Você: "Entendo sua preocupação. Dor no peito e palpitações podem ter várias causas, desde ansiedade até problemas cardíacos mais sérios.
   
   **Algumas informações importantes:**
   - Esses sintomas merecem atenção médica, especialmente se persistirem
   - Evite esforços físicos intensos até ser avaliado
   - Se a dor for muito intensa ou acompanhada de falta de ar, procure emergência
   - Mantenha-se calmo e respire profundamente
   
   **É fundamental que um cardiologista avalie esses sintomas** para determinar a causa e orientar o tratamento adequado. Gostaria que eu ajude você a agendar uma consulta com um cardiologista?
   
   RECOMENDO_CONSULTA: cardiologia"

4. **OUTRAS DICAS GERAIS:**
   - Para sintomas leves: hidratação, repouso, alimentação saudável
   - Para prevenção: exercícios regulares, dieta balanceada, sono adequado
   - Sempre mencione sinais de alarme que requerem atendimento imediato
   - Seja claro que suas orientações são educativas, não médicas

5. **NUNCA FAÇA:**
   - Não prescreva medicamentos específicos
   - Não dê diagnósticos definitivos
   - Não minimize sintomas graves
   - Não substitua a consulta médica

6. **OUTRAS FUNÇÕES:**
   - Ajudar com informações sobre a clínica
   - Auxiliar em agendamentos
   - Responder dúvidas administrativas
   - Fornecer orientações gerais de saúde`
    }]);
    const [showChatbot, setShowChatbot] = useState(false);
    const chatBodyRef = useRef()

    // --- NOSSOS DADOS DE CACHE ---
    const [disponibilidadeMedicos, setDisponibilidadeMedicos] = useState([]);
    const [MedicosMap, setMedicosMap] = useState({});
    const [allDoctors, setAllDoctors] = useState([]); // Cache para todos os médicos

    // Estado da conversa para o fluxo de agendamento
    const [conversationState, setConversationState] = useState({
        flow: null,
        step: null,
        data: {}
    });

    // Helper para limpar o estado
    const resetConversation = () => {
        setConversationState({ flow: null, step: null, data: {} });
    };

    // O ID do usuário logado (usado para criar agendamento)
    // ATENÇÃO: TROQUE ESTE ID POR eu   UM ID DE PACIENTE QUE EXISTA NO SEU BANCO
    //6e7f8829-0574-42df-9290-8dbb70f75ada - jp
    const patient_id = getPatientId();
    const user = { id: patient_id };

    // --- EFEITOS PARA BUSCAR DADOS (CACHE) ---

    // 1) Buscar doctor_availability (BLOCO DE DIAS) UMA ÚNICA VEZ
    useEffect(() => {
        if (!token) return;
        const buscarDisponibilidade = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
                };
                const res = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctor_availability`, { method: "GET", headers });
                if (!res.ok) throw new Error("Erro ao buscar disponibilidade");
                const result = await res.json();
                setDisponibilidadeMedicos(Array.isArray(result) ? result : []);
            } catch (err) {
                console.error("Erro na requisição de disponibilidade:", err);
            }
        };
        buscarDisponibilidade();
    }, [token]);

    // 2) Buscar TODOS os médicos UMA ÚNICA VEZ
    useEffect(() => {
        if (!token) return;
        const fetchAllDoctors = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
                };
                const res = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors`, { method: "GET", headers });
                if (!res.ok) throw new Error("Erro ao buscar médicos");
                const data = await res.json();
                setAllDoctors(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao buscar todos os médicos:", err);
            }
        };
        fetchAllDoctors();
    }, [token]);

    // 3) Quando disponibilidadeMedicos chegar, buscar nomes (para o 'MedicosMap')
    useEffect(() => {
        if (!Array.isArray(disponibilidadeMedicos) || disponibilidadeMedicos.length === 0 || !token) return;
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
                        const res = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${id}`, { method: "GET", headers });
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
    }, [disponibilidadeMedicos, token]);

    // --- LÓGICA DO CHATBOT ---

    const intents = [
        // INTENT ORIGINAL: listarinformaçoes
        {
            name: "listarinformaçoes",
            keywords: ["listar", "ver", "analisar", "mostrar", "mostre", "quais", "exibir", "exiba"],
            entities: [
                { name: "paciente", values: ["pacientes", "paciente", "pessoas", "pessoa"] },
                { name: "medico", values: ["médicos", "medicos", "médico", "medico", "doutores", "profissionais", "especialidades"] },
                { name: "horario", values: ["horários", "horarios", "horário", "horario", "disponibilidade", "disponiveis", "disponíveis", "disponível", "disponivel"] }
            ],
            action: async (lastMessage, updateHistory, matchedEntity) => {
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"
                };

                switch (matchedEntity.name) {
                    case "paciente":
                        try {
                            const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", { method: "GET", headers });
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
                            const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", { method: "GET", headers });
                            const data = await response.json();
                            if (!response.ok) throw new Error(data.error.message || "Erro ao buscar medicos.");
                            if (data.length === 0) {
                                updateHistory("Nenhum medico encontrado.");
                            } else {
                                const medicosList = data.map(medicos => `- ${medicos.full_name} \n     Especialidade:${medicos.specialty} \n     `).join("\n");
                                updateHistory(`Medicos cadastrados:\n${medicosList}`);
                            }
                        } catch (error) {
                            updateHistory(`Erro: ${error.message}`, true);
                        }
                        break;
                    case "horario":
                        try {
                            // Reutiliza o cache que já buscamos
                            if (disponibilidadeMedicos.length === 0) {
                                updateHistory("Nenhum horário de médico encontrado.");
                            } else {
                                const horariosList = disponibilidadeMedicos.map(horario => {
                                    const nomeMedico = MedicosMap[horario.doctor_id] || "Médico desconhecido";
                                    const diaPt = dbWeekdayToPt[horario.weekday.toLowerCase()] || horario.weekday;
                                    return `- ${nomeMedico}\n     Dia: ${diaPt}\n     Horário: ${horario.start_time} às ${horario.end_time}`;
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
        // INTENT ORIGINAL: iniciarcadastro
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
                    default:
                        updateHistory("Não entendi o que você deseja cadastrar. Por favor, seja mais específico.")
                }
            }
        },
        // INTENT ORIGINAL: salvarPaciente
        {
            name: "salvarPaciente",
            condition: (text) => text.includes("nome:") && text.includes("cpf:"),
            action: async (lastMessage, updateHistory) => {
                try {
                    const cleanedMessage = lastMessage.replace(/\r?\n/g, ' ');
                    const nome = lastMessage.match(/nome:\s*([^;]+)/)?.[1]?.trim();
                    const cpf = lastMessage.match(/cpf:\s*([^;]+)/)?.[1]?.trim();
                    const telefoneRaw = cleanedMessage.match(/telefone:\s*([^\s;]+)/i)?.[1]?.trim();
                    const telefone = telefoneRaw ? telefoneRaw.replace(/\D/g, '') : null;
                    const email = lastMessage.match(/email:\s*([^;]+)/)?.[1];
                    const birth_date_raw = lastMessage.match(/data de nascimento:\s*([^;]+)/)?.[1]?.trim();
                    let birth_date_formatted = null;

                    if (birth_date_raw) {
                        const separator = birth_date_raw.includes('/') ? '/' : '-';
                        const parts = birth_date_raw.split(separator);
                        if (parts.length === 3) {
                            const [dd, mm, yyyy] = parts;
                            birth_date_formatted = `${yyyy}-${mm}-${dd}`;
                        } else {
                            birth_date_formatted = null;
                        }
                    }
                    const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            full_name: nome,
                            cpf: cpf,
                            phone_mobile: telefone,
                            email: email,
                            birth_date: birth_date_formatted
                        }),
                    });

                    if (!response.ok) throw new Error("Erro ao cadastrar paciente 😢");
                    updateHistory(`Paciente ${nome} cadastrado com sucesso! 🩺✨`);
                } catch (error) {
                    updateHistory(error.message, true);
                }
            },
        },
        // NOVO INTENT: Iniciar Agendamento
        {
            name: "iniciarAgendamento",
            keywords: ["agendar", "marcar", "consulta", "consultar", "agendamento"],
            action: async (lastMessage, updateHistory) => {
                // 1. Ligar a máquina de estados
                setConversationState({
                    flow: 'booking',
                    step: 'awaiting_specialty',
                    data: {}
                });
                // 2. Fazer a primeira pergunta
                updateHistory("Ótimo! Para qual especialidade você gostaria de marcar a consulta?");
            }
        },
    ];

    // Função para lidar com a confirmação de agendamento
    const handleBookingConfirmation = async (message, updateHistory) => {
        const { step, data } = conversationState;
        
        if (step === 'awaiting_confirmation') {
            const response = message.trim().toLowerCase();
            
            if (response.includes('sim') || response === 's' || response === 'yes' || response === 'ok') {
                updateHistory("Perfeito! Vamos agendar sua consulta.");
                startAutomaticBooking(data.specialty, updateHistory);
            } else if (response.includes('não') || response.includes('nao') || response === 'n' || response === 'no') {
                updateHistory("Sem problemas! Se precisar agendar posteriormente, pode entrar em contato conosco pelos nossos canais de atendimento. Estou aqui se tiver outras dúvidas! 😊");
                resetConversation();
            } else {
                updateHistory("Por favor, responda com 'sim' se deseja agendar a consulta ou 'não' se prefere não agendar agora.");
            }
        }
    };

    // ATUALIZADO: A "Máquina de Estados" com a CORREÇÃO FINAL (datetime e fuso horário)
    const handleBookingFlow = async (message, updateHistory) => {
        const { step, data } = conversationState;

        // Headers para as chamadas (incluindo a Edge Function)
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
        };

        if (message.includes("cancelar")) {
            updateHistory("Entendido. Processo de agendamento cancelado.");
            resetConversation();
            return;
        }

        switch (step) {
            // ETAPA 1: Usuário digitou a especialidade (Sem mudança)
            case 'awaiting_specialty':
                const specialty = message.trim().toLowerCase();
                updateHistory(`Ok, buscando médicos para: ${specialty}...`);

                const filteredDoctors = allDoctors.filter(doc =>
                    doc.specialty && doc.specialty.toLowerCase() === specialty
                );

                if (filteredDoctors.length === 0) {
                    updateHistory(`Desculpe, não encontrei médicos para "${specialty}". Por favor, digite outra especialidade ou "cancelar".`);
                    return;
                }

                const doctorListText = filteredDoctors.map((doc, i) => `${i + 1}. ${doc.full_name}`).join('\n');
                updateHistory(`Encontrei estes médicos. Qual você prefere? (Digite o nome ou o número):\n${doctorListText}`);

                setConversationState({
                    flow: 'booking',
                    step: 'awaiting_doctor_choice',
                    data: { specialty, doctorsList: filteredDoctors }
                });
                break;

            // ETAPA 2: Usuário escolheu o médico (Sem mudança)
            case 'awaiting_doctor_choice':
                const choice = message.trim();
                const chosenDoctor = data.doctorsList.find(doc =>
                    doc.full_name.toLowerCase().includes(choice.toLowerCase()) ||
                    choice === (data.doctorsList.indexOf(doc) + 1).toString()
                );

                if (!chosenDoctor) {
                    updateHistory("Não entendi. Por favor, digite o nome ou o número do médico da lista.");
                    return;
                }

                const availableWeekdaysDb = [...new Set(
                    disponibilidadeMedicos
                        .filter(slot => slot.doctor_id === chosenDoctor.id)
                        .map(slot => slot.weekday.toLowerCase())
                )];

                if (availableWeekdaysDb.length === 0) {
                    updateHistory(`Desculpe, parece que ${chosenDoctor.full_name} não tem nenhum horário cadastrado no momento. Por favor, escolha outro médico da lista.`);
                    setConversationState({
                        ...conversationState,
                        step: 'awaiting_doctor_choice',
                        data: { ...data, selectedDoctor: null }
                    });
                    return;
                }

                const weekdaysText = availableWeekdaysDb.map(day => dbWeekdayToPt[day] || day).join(', ');

                updateHistory(`Ótima escolha. O(A) Dr(a). ${chosenDoctor.full_name} atende nos seguintes dias: **${weekdaysText}**. \n\nQual data (DD/MM/AAAA), em um desses dias, você gostaria de marcar?`);

                setConversationState({
                    ...conversationState,
                    step: 'awaiting_date',
                    data: { ...data, selectedDoctor: chosenDoctor, availableWeekdaysDb: availableWeekdaysDb }
                });
                break;

            // ETAPA 3: Usuário digitou a data (COM A CORREÇÃO FINAL)
            case 'awaiting_date':
                const dateInput = message.trim();
                const parts = dateInput.split('/');
                if (parts.length !== 3 || parts[2].length < 4) {
                    updateHistory("Formato de data inválido. Por favor, use DD/MM/AAAA (ex: 23/10/2025).");
                    return;
                }

                const [day, month, year] = parts;
                const isoDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                const selectedDate = new Date(isoDateStr + "T12:00:00Z");

                if (isNaN(selectedDate.getTime())) {
                    updateHistory("Data inválida. Por favor, use DD/MM/AAAA (ex: 23/10/2025).");
                    return;
                }

                const weekdaysPtMap = ["Domingo", "Segunda-feira", "Terca-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
                const ptWeekday = weekdaysPtMap[selectedDate.getUTCDay()];

                const dbCheckWeekday = (ptWeekdayToDb[ptWeekday] || "").toLowerCase();

                if (!data.availableWeekdaysDb.includes(dbCheckWeekday)) {
                    const ptWeekdaysForDisplay = data.availableWeekdaysDb.map(day => dbWeekdayToPt[day] || day).join(', ');
                    updateHistory(`Opa! O dia ${dateInput} (${ptWeekday}) não é um dos dias de atendimento do(a) Dr(a). ${data.selectedDoctor.full_name}. \n\nPor favor, escolha uma data que caia em: **${ptWeekdaysForDisplay}**.`);
                    return;
                }

                updateHistory(`Ok, verificando horários livres para ${ptWeekday} (${dateInput})...`);

                // Cria datas no mesmo formato que o AgendaForm (sem conversão de fuso)
                const startDate = `${isoDateStr}T00:00:00.000Z`;
                const endDate = `${isoDateStr}T23:59:59.999Z`;

                const payload = {
                    doctor_id: data.selectedDoctor.id,
                    start_date: startDate,
                    end_date: endDate,
                    appointment_type: "presencial"
                };

                console.log("🚀 Chatbox - Payload enviado para get-available-slots:", payload);
                console.log("🔑 Chatbox - Token do usuário:", token ? "EXISTS" : "NULL");
                console.log("👤 Chatbox - Patient ID:", patient_id);
                console.log("🆔 Chatbox - Doctor ID sendo consultado:", data.selectedDoctor?.id || "Ainda não selecionado");

                try {
                    // USA A MESMA EDGE FUNCTION que o AgendaForm para garantir consistência
                    const response = await fetch(
                        "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/get-available-slots",
                        {
                            method: "POST",
                            headers,
                            body: JSON.stringify(payload),
                        }
                    );

                    const data_slots = await response.json();

                    console.log("🔍 Chatbox (Paciente) - Resposta da Edge Function:", data_slots);

                    if (!response.ok) throw new Error(data_slots.error || "Erro ao buscar horários");

                    // Usa exatamente a mesma lógica do AgendaForm
                    const slotsDisponiveis = (data_slots?.slots || []).filter((s) => s.available);
                    
                    console.log("✅ Chatbox (Paciente) - Slots disponíveis após filtro:", slotsDisponiveis);
                    console.log("🔍 Chatbox (Paciente) - Todos os slots (antes do filtro):", data_slots?.slots);
                    console.log("❌ Chatbox (Paciente) - Slots NÃO disponíveis:", (data_slots?.slots || []).filter((s) => !s.available));

                    if (slotsDisponiveis.length === 0) {
                        updateHistory(`Desculpe, não há horários livres para ${data.selectedDoctor.full_name} no dia ${dateInput}. Por favor, escolha outra data.`);
                        return;
                    }

                    // Converte para o formato que o chatbox espera
                    const availableSlots = slotsDisponiveis.map((slot) => ({
                        displayTime: slot.datetime.split("T")[1].substring(0, 5), // "HH:MM"
                        originalDateTime: slot.datetime
                    }));

                    // Mostra os horários disponíveis para o usuário
                    const slotsListText = availableSlots.map(slot => `- ${slot.displayTime}`).join('\n');
                    const exampleTime = availableSlots[0].displayTime;

                    updateHistory(`Perfeito! Horários disponíveis para ${dateInput} (${ptWeekday}):\n${slotsListText}\n\nQual horário você prefere? (Ex: ${exampleTime})`);

                    setConversationState({
                        ...conversationState,
                        step: 'awaiting_time',
                        data: {
                            ...data,
                            selectedDateISO: isoDateStr,
                            availableSlotsInfo: availableSlots,
                            slotDuration: 30
                        }
                    });

                } catch (err) {
                     console.error("Erro detalhado ao processar horários:", err);
                     updateHistory(`Erro ao consultar horários: ${err.message}. Tente outra data.`);
                }
                break;

            // ETAPA 4: Usuário digitou o horário
            case 'awaiting_time':
                let timeInput = message.trim(); // Ex: "16:00"

                // Garante que o formato seja "HH:MM"
                if (timeInput.match(/^\d{2}:\d{2}:\d{2}$/)) {
                    timeInput = timeInput.substring(0, 5);
                }

                // Acha o objeto correspondente na lista availableSlotsInfo
                const chosenSlotInfo = data.availableSlotsInfo.find(info => info.displayTime === timeInput);

                if (!chosenSlotInfo) {
                    const exampleTime = data.availableSlotsInfo[0]?.displayTime || "09:00";
                    updateHistory(`Não encontrei esse horário. Por favor, digite exatamente como aparece na lista (Ex: ${exampleTime}).`);
                    return;
                }

                // Usa o horário direto do banco sem conversão
                const scheduled_at_iso = chosenSlotInfo.originalDateTime;

                const duration_minutes = data.slotDuration;

                updateHistory(`Confirmando agendamento para ${data.selectedDateISO} às ${timeInput}...`);

                console.log("Horário selecionado:", timeInput);
                console.log("DateTime que será salvo:", scheduled_at_iso);

                const appointmentBody = {
                    doctor_id: data.selectedDoctor.id,
                    patient_id: user.id,
                    scheduled_at: scheduled_at_iso,
                    duration_minutes: duration_minutes,
                    created_by: user.id
                };

                try {
                    const res = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments`, {
                        method: 'POST',
                        headers: {
                            ...headers,
                            "Prefer": "return=minimal"
                        },
                        body: JSON.stringify(appointmentBody)
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || "Não foi possível confirmar o agendamento.");
                    }

                    updateHistory("Consulta marcada com sucesso! ✅");
                    resetConversation();

                } catch (err) {
                    updateHistory(`Erro ao marcar consulta: ${err.message}.`);
                    resetConversation();
                }
                break;

            default:
                updateHistory("Desculpe, me perdi. Vamos começar de novo.");
                resetConversation();
        }
    };


    // Função para extrair recomendação de consulta do Gemini
    const extractConsultationRecommendation = (text) => {
        const match = text.match(/RECOMENDO_CONSULTA:\s*([^\n]+)/i);
        if (match) {
            return match[1].trim().toLowerCase();
        }
        return null;
    };



    // Função para iniciar agendamento automático com especialidade (após confirmação)
    const startAutomaticBooking = (specialty, updateHistory) => {
        // Busca médicos da especialidade
        const filteredDoctors = allDoctors.filter(doc =>
            doc.specialty && doc.specialty.toLowerCase() === specialty
        );

        if (filteredDoctors.length === 0) {
            updateHistory(`\n💡 Infelizmente não encontrei especialistas em ${specialty} disponíveis no momento. Entre em contato conosco para mais informações.`);
            resetConversation();
            return;
        }

        const doctorListText = filteredDoctors.map((doc, i) => `${i + 1}. ${doc.full_name}`).join('\n');
        updateHistory(`\nÓtimo! Encontrei estes especialistas em ${specialty}:\n${doctorListText}\n\nQual você prefere? (Digite o nome ou o número)`);

        setConversationState({
            flow: 'booking',
            step: 'awaiting_doctor_choice',
            data: { specialty, doctorsList: filteredDoctors }
        });
    };

    // generateBotResponse HÍBRIDO (atualizado para dar dicas médicas)
    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "Pensando..."), { role: "model", text, isError }]);
        };

        const lastUserMessage = history[history.length - 1].text.toLowerCase();
        let intentFound = false;

        // Checa o fluxo de confirmação de agendamento PRIMEIRO
        if (conversationState.flow === 'booking_confirmation') {
            await handleBookingConfirmation(lastUserMessage, updateHistory);
            return;
        }

        // Checa o fluxo de agendamento
        if (conversationState.flow === 'booking') {
            await handleBookingFlow(lastUserMessage, updateHistory);
            return; // Interrompe para não buscar intents
        }

        // --- Lógica de intents (a mesma de antes) ---
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

                if (actionKeyword) {
                    let matchedEntity = null;
                    for (const entity of intent.entities) {
                        const entityValue = entity.values.find(val => lastUserMessage.includes(val.toLowerCase()));
                        if (entityValue) {
                            matchedEntity = entity;
                            break;
                        }
                    }

                    if (matchedEntity) {
                        await intent.action(lastUserMessage, updateHistory, matchedEntity);
                        intentFound = true;
                        break;
                    }
                }
            }

            // 3. Checa intents com KEYWORDS simples, sem entidades (como "iniciarAgendamento")
            if (intent.keywords && !intent.entities && !intent.condition) {
                if (intent.keywords.some((kw) => lastUserMessage.includes(kw.toLowerCase()))) {

                    // CORRIGIDO AQUI: (era lastMessage)
                    await intent.action(lastUserMessage, updateHistory);

                    intentFound = true;
                    break;
                }
            }
        }
        if (intentFound) return;

        // 4. Fallback para API externa (Gemini)
        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history })
        };
        try {
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message || "Algo deu errado");
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            
            // Verifica se o Gemini recomendou uma consulta médica
            const recommendedSpecialty = extractConsultationRecommendation(apiResponseText);
            
            if (recommendedSpecialty) {
                // Remove a linha "RECOMENDO_CONSULTA" da resposta visível
                const cleanedResponse = apiResponseText.replace(/RECOMENDO_CONSULTA:\s*[^\n]+/i, '').trim();
                updateHistory(cleanedResponse);
                
                // Coloca o sistema em modo de espera de confirmação diretamente
                setConversationState({
                    flow: 'booking_confirmation',
                    step: 'awaiting_confirmation',
                    data: { specialty: recommendedSpecialty }
                });
            } else {
                // Resposta normal sem recomendação de consulta
                updateHistory(apiResponseText);
            }
        } catch (error) {
            updateHistory(error.message, true);
        }
    };

    // Scroll (sem mudanças)
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" })
        }
    }, [chatHistory])

    // --- JSX (sem mudanças) ---
    return (
        <div className={`container-chatbox ${showChatbot ? "show-chatbot" : ""}`}>
            {/* Este é o botão de ícone no canto */}
            <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
                <span className="material-symbols-rounded">mode_comment</span>
                <span className="material-symbols-rounded">close</span>
            </button>

            {/* Este é o popup do chat */}
            <div className="chatbot-popup">

                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">MediChat</h2>
                    </div>
                    <button onClick={() => setShowChatbot(prev => !prev)}
                        className="material-symbols-rounded">keyboard_arrow_down</button>
                </div>

                {/* O corpo do chat, onde as mensagens aparecem */}
                <div ref={chatBodyRef} className="chat-body">

                    {/* A mensagem de boas-vindas inicial */}
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            Bem-vindo 👋 <br /> Sou a assistente virtual da MediConnect, como posso te ajudar?
                        </p>
                    </div>

                    {/* O histórico de chat */}
                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}

                </div> {/* Fim do chat-body */}

                {/* O rodapé com o input de texto */}
                <div className="chat-footer">
                    <ChatForm
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        generateBotResponse={generateBotResponse}
                    />
                </div>

            </div> {/* Fim do chatbot-popup */}
        </div> /* Fim do container-chatbox */
    )
}

export default Chatbox;