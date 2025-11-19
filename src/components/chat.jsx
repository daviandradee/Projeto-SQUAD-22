import React, { useState, useRef, useEffect, use } from 'react';
import './chatpanel.css';
const AvatarForm = "/img/AvatarForm.jpg";
import { getAccessToken } from '../utils/auth';
import { getUserId } from '../utils/userInfo';
import { getUserRole } from '../utils/userInfo';
import { createClient } from '@supabase/supabase-js';

const Chat = () => {
    const [messages, setMessages] = useState({});
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const chatURL = import.meta.env.VITE_CHAT_SERVICE_URL;
    const chatKEY = import.meta.env.VITE_CHAT_ANO_KEY;
    const tokenUsuario = getAccessToken();
    const userID = getUserId(); // deve retornar o id do usuário logado
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
        ]).then(([patients, medicos]) => {
            const all = [
                ...patients.map(p => ({ ...p, type: 'paciente' })), // cada paciente recebe type: 'paciente'
                ...medicos.map(m => ({ ...m, type: 'medico' }))     // cada médico recebe type: 'medico'
            ];
            setAllContacts(all);
            if (all.length > 0) setSelectedContact(all[0].id);
        }).catch(error => console.log('error', error));
    }, []);

    return (
        <div className='main-wrapper'>
            <div className="page-wrapper">
                <div className="content">
                    <div className="chatpanel-container">
                        <div className="chatpanel-contacts">
                            <h2 style={{ textAlign: 'center', margin: '18px 0 10px', color: '#004a99', fontWeight: 700, fontSize: '1.3rem' }}>Contatos</h2>
                            <input
                                type="text"
                                className="contacts-search"
                                placeholder="Buscar paciente..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ margin: '0 12px 10px', padding: '8px 12px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none' }}
                            />
                            <div className="contacts-list">
                                {allContacts.filter(p => p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((allContacts) => (
                                    <div
                                        key={allContacts.id}
                                        className={`chatpanel-contact${selectedContact === allContacts.id ? ' selected' : ''}`}
                                        onClick={() => setSelectedContact(allContacts.id)}
                                    >
                                        <img
                                            src={AvatarForm}
                                            alt={allContacts.full_name}
                                            className="chatpanel-contact-avatar"
                                            style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }}
                                            onError={e => { e.target.src = AvatarForm; }}
                                        />
                                        <span style={{ fontWeight: 500, fontSize: '1.08rem' }}>{allContacts.full_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="chatpanel-chat">
                            <div className="chatpanel-header">
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
                                        e.target.src = AvatarForm; // Fallback se a imagem não carregar
                                    }}
                                />
                                {allContacts.find((p) => p.id === selectedContact)?.full_name}
                                <input type="text" className='search' placeholder="🔍 Buscar mensagens" />
                            </div>
                            <div className="chatpanel-messages">
                                {selectedContact && messages[selectedContact]?.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`chatpanel-bubble ${msg.sender_id === userID ? 'me' : 'other'}`}
                                    >
                                        {msg.content}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className="chatpanel-input-area" >
                                <input
                                    type="text"
                                    className="chatpanel-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Digite uma mensagem"
                                />
                                <button  type="submit" className="chatpanel-send-btn">Enviar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;