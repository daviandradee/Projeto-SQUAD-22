import React, { useState, useRef, useEffect, use } from 'react';
import './chatpanel.css';
const AvatarForm = "/img/AvatarForm.jpg";
import { getAccessToken } from '../utils/auth';
import { getUserId } from '../utils/userInfo';
import { getUserRole } from '../utils/userInfo';
import { getPatientId} from '../utils/userInfo';
import { getDoctorId } from '../utils/userInfo';
import { createClient } from '@supabase/supabase-js';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchMsg, setSearchMsg] = useState("");
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const chatURL = import.meta.env.VITE_CHAT_SERVICE_URL;
    const chatKEY = import.meta.env.VITE_CHAT_ANO_KEY;
    const tokenUsuario = getAccessToken();
    const userRole = getUserRole(); // 'medico' ou 'paciente'
    const selectedContactObj = allContacts.find(c => c.id === selectedContact);
    const [myDoctorId, setMyDoctorId] = useState(null);
    const [myPatientId, setMyPatientId] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Always scroll to the latest message
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);

    // Buscar doctor_id ou patient_id do usuário logado
    useEffect(() => {
      setMyDoctorId(getDoctorId());
      setMyPatientId(getPatientId());
    }, []);

    // Alerta só se já tentou buscar o id (evita alerta no render inicial)
    const [checkedIds, setCheckedIds] = useState(false);
    useEffect(() => {
      setMyDoctorId(getDoctorId());
      setMyPatientId(getPatientId());
      setCheckedIds(true);
    }, []);

    useEffect(() => {
      if (!checkedIds) return;
      if (userRole === 'medico' && myDoctorId === null) {
        alert('Não foi possível encontrar seu doctor_id. Verifique seu cadastro ou contate o suporte.');
      }
      if (userRole === 'paciente' && myPatientId === null) {
        alert('Não foi possível encontrar seu patient_id. Verifique seu cadastro ou contate o suporte.');
      }
    }, [myDoctorId, myPatientId, userRole, checkedIds]);

    // Ensure chatId is always doctorId first, patientId second
    let doctorId, patientId;
    if (userRole === 'medico') {
      doctorId = myDoctorId;
      patientId = selectedContactObj?.id;
    } else {
      doctorId = selectedContactObj?.id;
      patientId = myPatientId;
    }
    // Only set chatId if both are defined
    const chatId = doctorId && patientId ? `chat_${doctorId}_${patientId}` : null;

    // Supabase da empresa (para pacientes/doctors)
    const supabaseEmpresa = createClient(supabaseUrl, supabaseAK);

    // Seu Supabase (para chat)
    const supabaseChat = createClient(chatURL, chatKEY);
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", supabaseAK);
        myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        Promise.all([
            fetch(`${supabaseUrl}/rest/v1/patients`, requestOptions).then(res => res.json()),
            fetch(`${supabaseUrl}/rest/v1/doctors`, requestOptions).then(res => res.json())
        ]).then(async ([patients, medicos]) => {
            const all = [
                ...patients.map(p => ({ ...p, type: 'paciente' })),
                ...medicos.map(m => ({ ...m, type: 'medico' }))
            ];
            // Busca última mensagem de cada contato
            const contatosComUltimaMsg = await Promise.all(all.map(async (contact) => {
                let dId, pId;
                if (contact.type === 'medico') {
                    dId = contact.id;
                    pId = myPatientId;
                } else {
                    dId = myDoctorId;
                    pId = contact.id;
                }
                const chatIdContato = dId && pId ? `chat_${dId}_${pId}` : null;
                if (!chatIdContato) return { ...contact, lastMsg: null };
                const { data } = await supabaseChat
                    .from('chat')
                    .select('created_at')
                    .eq('chat_id', chatIdContato)
                    .order('created_at', { ascending: false })
                    .limit(1);
                return { ...contact, lastMsg: data && data[0] ? new Date(data[0].created_at).getTime() : 0 };
            }));
            // Ordena por data da última mensagem (desc)
            contatosComUltimaMsg.sort((a, b) => b.lastMsg - a.lastMsg);
            setAllContacts(contatosComUltimaMsg);
            if (!selectedContact && contatosComUltimaMsg.length > 0) setSelectedContact(contatosComUltimaMsg[0].id);
        }).catch(error => console.log('error', error));
    }, [selectedContact, myDoctorId, myPatientId]);
  const [text, setText] = useState('');

  // Carrega mensagens antigas
  const loadMessages = async () => {
    if (!chatId) return;
    const { data } = await supabaseChat
      .from('chat')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    console.log('Loaded messages for chatId', chatId, data);
    setMessages(data || []);
  };

    // Move contato para o topo e atualiza lastMsg instantaneamente
    const moveContactToTopInstant = (contactId) => {
        setAllContacts((prev) => {
            const now = Date.now();
            const novaLista = prev.map(c =>
                c.id === contactId ? { ...c, lastMsg: now } : c
            );
            novaLista.sort((a, b) => b.lastMsg - a.lastMsg);
            return novaLista;
        });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !chatId || !selectedContactObj || !doctorId || !patientId) {
            console.log('Missing required fields', {input, chatId, selectedContactObj, doctorId, patientId});
            return;
        }
        console.log('Sending message', {
            chat_id: chatId,
            sender_id: userRole === 'medico' ? doctorId : patientId,
            receiver_id: selectedContactObj.id,
            doctor_id: doctorId,
            patient_id: patientId,
            content: input,
        });
        const { error } = await supabaseChat.from('chat').insert({
            chat_id: chatId,
            sender_id: userRole === 'medico' ? doctorId : patientId,
            receiver_id: selectedContactObj.id,
            doctor_id: doctorId,
            patient_id: patientId,
            content: input,
        });
        if (error) {
            console.error('Supabase insert error:', error);
            alert('Erro ao enviar mensagem: ' + error.message);
        }
        if (!error) {
            moveContactToTopInstant(selectedContactObj.id);
        }
        setInput('');
    };

    // Listener realtime
    useEffect(() => {
        if (!chatId) return;
        loadMessages();
        const channel = supabaseChat
            .channel(`chat:${chatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat',
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                    // Move contato para o topo ao receber mensagem (instantâneo)
                    const senderId = payload.new.sender_id;
                    if (senderId !== (userRole === 'medico' ? myDoctorId : myPatientId)) {
                        moveContactToTopInstant(senderId);
                    }
                }
            )
            .subscribe();
        return () => supabaseChat.removeChannel(channel);
    }, [chatId, myDoctorId, myPatientId, userRole, selectedContactObj]);

    // Filter contacts: doctors see only patients, patients see only doctors
    const filteredContacts = userRole === 'medico'
      ? allContacts.filter(c => c.type === 'paciente')
      : allContacts.filter(c => c.type === 'medico');

    // Set initial selected contact from filtered list
    useEffect(() => {
      if (!selectedContact && filteredContacts.length > 0) {
        setSelectedContact(filteredContacts[0].id);
      }
      // eslint-disable-next-line
    }, [filteredContacts]);

    console.log('userRole:', userRole);
    console.log('filteredContacts:', filteredContacts);
    console.log('selectedContact:', selectedContact, 'selectedContactObj:', selectedContactObj);
    console.log('doctorId:', doctorId, 'patientId:', patientId, 'chatId:', chatId);

    return (
        <div className='main-wrapper'>
            <div className="page-wrapper">
                <div className="content">
                    <div className="chatpanel-container">
                        {/* Contatos: Drawer no mobile, lista fixa no desktop */}
                        <div className="chatpanel-contacts desktop-only">
                            <h2 style={{ textAlign: 'center', margin: '18px 0 10px', color: '#004a99', fontWeight: 700, fontSize: '1.3rem' }}>Contatos</h2>
                            <input
                                type="text"
                                className="contacts-search"
                                placeholder={userRole === 'medico' ? "Buscar paciente..." : "Buscar médico..."}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ margin: '0 12px 10px', padding: '8px 12px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none' }}
                            />
                            <div className="contacts-list">
                                {filteredContacts.filter(p => p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((contact) => (
                                    <div
                                        key={contact.id}
                                        className={`chatpanel-contact${selectedContact === contact.id ? ' selected' : ''}`}
                                        onClick={() => setSelectedContact(contact.id)}
                                    >
                                        <img
                                            src={AvatarForm}
                                            alt={contact.full_name}
                                            className="chatpanel-contact-avatar"
                                            style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }}
                                            onError={e => { e.target.src = AvatarForm; }}
                                        />
                                        <span style={{ fontWeight: 500, fontSize: '1.08rem' }}>{contact.full_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Drawer de contatos para mobile */}
                        <div className={`chatpanel-drawer${drawerOpen ? ' open' : ''}`}>
                            <div className="drawer-header">
                                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#004a99' }}>Contatos</span>
                                <button className="drawer-close" onClick={() => setDrawerOpen(false)}>&times;</button>
                            </div>
                            <input
                                type="text"
                                className="contacts-search"
                                placeholder={userRole === 'medico' ? "Buscar paciente..." : "Buscar médico..."}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <div className="contacts-list">
                                {filteredContacts.filter(p => p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((contact) => (
                                    <div
                                        key={contact.id}
                                        className={`chatpanel-contact${selectedContact === contact.id ? ' selected' : ''}`}
                                        onClick={() => { setSelectedContact(contact.id); setDrawerOpen(false); }}
                                    >
                                        <img
                                            src={AvatarForm}
                                            alt={contact.full_name}
                                            className="chatpanel-contact-avatar"
                                            onError={e => { e.target.src = AvatarForm; }}
                                        />
                                        <span style={{ fontWeight: 500, fontSize: '1.08rem' }}>{contact.full_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Chat principal */}
                        <div className="chatpanel-chat">
                            <div className="chatpanel-header">
                                {/* Hamburger só aparece no mobile via CSS */}
                                <button
                                    className="chatpanel-hamburger"
                                    onClick={() => setDrawerOpen(true)}
                                    aria-label="Abrir menu de contatos"
                                >
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect y="5" width="24" height="2.5" rx="1.25" fill="#004a99"/>
                                        <rect y="11" width="24" height="2.5" rx="1.25" fill="#004a99"/>
                                        <rect y="17" width="24" height="2.5" rx="1.25" fill="#004a99"/>
                                    </svg>
                                </button>
                                <img className="chatpanel-avatar"
                                    src={AvatarForm}
                                    style={{
                                        marginRight: "10px",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                    onError={(e) => {
                                        e.target.src = AvatarForm;
                                    }}
                                />
                                {filteredContacts.find((p) => p.id === selectedContact)?.full_name}
                                <input type="text" className='search' placeholder="🔍 Buscar mensagens" value={searchMsg} onChange={e => setSearchMsg(e.target.value)} />
                            </div>
                            <div className="chatpanel-messages">
                                {(searchMsg.trim() ? messages.filter(msg => msg.content?.toLowerCase().includes(searchMsg.toLowerCase())) : messages).map((msg) => {
                                    // Formata horário
                                    let hora = '';
                                    if (msg.created_at) {
                                        const d = new Date(msg.created_at);
                                        hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                    }
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`chatpanel-bubble ${msg.sender_id === (userRole === 'medico' ? myDoctorId : myPatientId) ? 'me' : 'other'}`}
                                        >
                                            <span>{msg.content}</span>
                                            {hora && (
                                                <span style={{ fontSize: '0.85em', color: '#888', marginLeft: 8 }}>
                                                    {hora}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className="chatpanel-input-area" onSubmit={sendMessage}>
                                <input
                                    type="text"
                                    className="chatpanel-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Digite uma mensagem"
                                />
                                <button type="submit" className="chatpanel-send-btn">Enviar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;