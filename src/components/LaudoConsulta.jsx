import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image';
import { useState, useEffect, useRef} from 'react';
import { Card, Collapse } from "react-bootstrap"; // <-- IMPORT CORRETO
import { ChevronDown, ChevronUp } from "lucide-react";
import { getAccessToken } from '../utils/auth';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone } from "react-icons/fa";
import { InterimMark } from '../utils/InterimMark'; // <-- Verifique se esse caminho está certo!
import { getUserRole } from '../utils/userInfo';
import { useLocation } from 'react-router-dom';
import { getDoctorId } from '../utils/userInfo';



function Bar({ comandos, handleSubmit, toggleRecording, isRecording }) {
    const inputRef = useRef(null);

    const handleAbrirExplorador = () => {
        inputRef.current.click(); // abre o explorador
    };

    const handleArquivoSelecionado = (event) => {
        const arquivo = event.target.files[0];
        if (arquivo) {
            const imageUrl = URL.createObjectURL(arquivo);
            comandos.agregarImagen(imageUrl);
            event.target.value = null;
        }
    };

    return (
        <>
            <div className="toolbar">
                <div className="left">
                    <button onClick={comandos.toggleBold} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z"></path>
                        </svg>
                    </button>
                    <button onClick={comandos.toggleItalic} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"></path>
                        </svg>
                    </button>
                    <button onClick={comandos.toggleUnderline} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z"></path>
                        </svg>
                    </button>
                    {/*<button onClick={comandos.toggleCodeBlock} >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23 12L15.9289 19.0711L14.5147 17.6569L20.1716 12L14.5147 6.34317L15.9289 4.92896L23 12ZM3.82843 12L9.48528 17.6569L8.07107 19.0711L1 12L8.07107 4.92896L9.48528 6.34317L3.82843 12Z"></path>
                            </svg>
                        </button> */}
                    <button onClick={comandos.toggleH1}	 >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM21.0005 8V20H19.0005L19 10.204L17 10.74V8.67L19.5005 8H21.0005Z"></path>
                        </svg>
                    </button>
                    <button onClick={comandos.toggleH2} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5711 8 22.25 9.67893 22.25 11.75C22.25 12.6074 21.9623 13.3976 21.4781 14.0292L21.3302 14.2102L18.0343 18H22V20H15L14.9993 18.444L19.8207 12.8981C20.0881 12.5908 20.25 12.1893 20.25 11.75C20.25 10.7835 19.4665 10 18.5 10C17.5818 10 16.8288 10.7071 16.7558 11.6065L16.75 11.75H14.75C14.75 9.67893 16.4289 8 18.5 8Z"></path>
                        </svg>
                    </button>
                    <button onClick={comandos.toggleH3} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22 8L21.9984 10L19.4934 12.883C21.0823 13.3184 22.25 14.7728 22.25 16.5C22.25 18.5711 20.5711 20.25 18.5 20.25C16.674 20.25 15.1528 18.9449 14.8184 17.2166L16.7821 16.8352C16.9384 17.6413 17.6481 18.25 18.5 18.25C19.4665 18.25 20.25 17.4665 20.25 16.5C20.25 15.5335 19.4665 14.75 18.5 14.75C18.214 14.75 17.944 14.8186 17.7056 14.9403L16.3992 13.3932L19.3484 10H15V8H22ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4Z"></path>
                        </svg>
                    </button>
                    <button onClick={comandos.toggleParrafo} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 6V21H10V16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4H20V6H17V21H15V6H12ZM10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14V6Z"></path>
                        </svg>
                    </button>
                    <button onClick={comandos.toggleListaOrdenada} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"></path>
                        </svg>
                    </button>
                    <button onClick={comandos.toggleListaPontos} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"></path>
                        </svg>
                    </button>
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            ref={inputRef}
                            onChange={handleArquivoSelecionado}
                            style={{ display: "none" }} // esconde o input
                        />

                        <button onClick={handleAbrirExplorador}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                            >
                                <path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
                            </svg>
                        </button>
                    </>
                    <button
                        onClick={toggleRecording}
                        className={`toolbar-button ${isRecording ? "active" : ""}`}
                        title={isRecording ? "Parar ditado" : "Iniciar ditado por voz"}
                    >
                        <FaMicrophone size={18} />
                    </button>

                    {/*<button onClick={comandos.agregarLink} >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.3638 15.5355L16.9496 14.1213L18.3638 12.7071C20.3164 10.7545 20.3164 7.58866 18.3638 5.63604C16.4112 3.68341 13.2453 3.68341 11.2927 5.63604L9.87849 7.05025L8.46428 5.63604L9.87849 4.22182C12.6122 1.48815 17.0443 1.48815 19.778 4.22182C22.5117 6.95549 22.5117 11.3876 19.778 14.1213L18.3638 15.5355ZM15.5353 18.364L14.1211 19.7782C11.3875 22.5118 6.95531 22.5118 4.22164 19.7782C1.48797 17.0445 1.48797 12.6123 4.22164 9.87868L5.63585 8.46446L7.05007 9.87868L5.63585 11.2929C3.68323 13.2455 3.68323 16.4113 5.63585 18.364C7.58847 20.3166 10.7543 20.3166 12.7069 18.364L14.1211 16.9497L15.5353 18.364ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z"></path>
                            </svg>
                        </button> */}
                </div>
                <div className="right">
                    <button onClick={handleSubmit} className="btnGuardar">

                        <span>Enviar laudo</span>
                    </button>
                </div>
            </div>
        </>
    );
};

function LaudoConsulta() {
    const location = useLocation();
    const patient_id = location.state?.pacienteId;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const navigate = useNavigate();
    const [paciente, setPaciente] = useState([]);
    const tokenUsuario = getAccessToken()
    var myHeaders = new Headers();
    myHeaders.append("apikey", supabaseAK);
    myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    useEffect(() => {
        fetch(`${supabaseUrl}/rest/v1/patients`, requestOptions)
            .then(response => response.json())
            .then(result => setPaciente(Array.isArray(result) ? result : []))
            .catch(error => console.log('error', error));
    }, [])
    const options = paciente.map(p => ({
        value: p.id,
        label: p.full_name
    }));
    function gerarOrderNumber() {
        const prefixo = "REL";

        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, "0"); // adiciona 0 à esquerda se necessário

        // Gerar um código aleatório de 6 caracteres (letras maiúsculas + números)
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let codigo = "";
        for (let i = 0; i < 6; i++) {
            codigo += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return `${prefixo}-${ano}-${mes}-${codigo}`;
    }

    // Exemplo de uso:
    const orderNumber = gerarOrderNumber();
    const [laudos, setLaudos] = useState({
        patient_id: patient_id || "",
        order_number: "",
        exam: "",
        diagnosis: "",
        conclusion: "",
        cid_code: "",
        content_html: "",
        status: "draft",
        requested_by: getDoctorId(),
    });
    const handlePacienteChange = (selected) => {
        setLaudos(prev => ({
            ...prev,
            patient_id: selected ? selected.value : ""
        }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLaudos((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        const role = getUserRole();
        e.preventDefault();
        if (!laudos.patient_id || !laudos.diagnosis || !laudos.exam || !laudos.conclusion) {
            Swal.fire({
                title: "Por favor, preencha todos os campos obrigatórios.",
                icon: "warning",
                draggable: true
            });
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("apikey", supabaseAK);
        myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(laudos);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(`${supabaseUrl}/rest/v1/reports`, requestOptions)
            .then(response => response.text())
            .then(async result => {
                console.log(result);
                // Atualiza o status da consulta para completed
                if (laudos.patient_id) {
                    await fetch(`${supabaseUrl}/rest/v1/appointments?id=eq.${location.state?.consultaId}`, {
                        method: 'PATCH',
                        headers: myHeaders,
                        body: JSON.stringify({ status: 'completed' })
                    });
                }
                Swal.fire({
                    title: "Laudo adicionado!",
                    icon: "success",
                    draggable: true
                });
                navigate(`/${role}/laudolist`);
            })
            .catch(error => console.log('error', error));
    };

    const [open, setOpen] = useState(false);
    const editor = useEditor({
        extensions: [StarterKit, Image, InterimMark ],
        content: "",
        onUpdate: ({ editor }) => {
            setLaudos(prev => ({
                ...prev,
                content_html: editor.getHTML()
            }));
        }
    })
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);
    const lastInsertedRef = useRef({ from: -1, to: -1, text: '' });
    

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Seu navegador não suporta reconhecimento de voz 😢");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            if (!editor) return;

            const result = event.results[0];
            const transcript = result[0].transcript;
            const last = lastInsertedRef.current;

            // --- CORREÇÃO DE LÓGICA ---
            // Vamos rodar a deleção como um comando SEPARADO primeiro.
            if (last.from !== -1 && 
                editor.state.doc.textBetween(last.from, last.to) === last.text) 
            {
                // Roda a deleção e PARA.
                editor.chain().focus()
                    .deleteRange({ from: last.from, to: last.to })
                    .run();
            }
            
            // Pega a posição ATUAL (depois da deleção)
            const currentPos = editor.state.selection.from;

            if (result.isFinal) {
                // --- RESULTADO FINAL (PRETO) ---
                // Roda a inserção final como um comando SEPARADO.
                editor.chain().focus()
                    .insertContent(transcript + ' ')
                    .run();
                
                // Reseta a Ref
                lastInsertedRef.current = { from: -1, to: -1, text: '' };

            } else {
                // --- RESULTADO PROVISÓRIO (CINZA) ---
                // Esta é a nova estratégia: "Ligar" a mark, inserir, "Desligar" a mark.
                // Roda tudo como um comando SEPARADO.
                editor.chain()
                    .focus()
                    .setMark('interimMark')      // <-- "Pincel cinza" LIGADO
                    .insertContent(transcript) // <-- Insere o texto
                    .unsetMark('interimMark')    // <-- "Pincel cinza" DESLIGADO
                    .run();
                
                // Atualiza a Ref com a posição do texto cinza
                lastInsertedRef.current = {
                    from: currentPos,
                    to: currentPos + transcript.length,
                    text: transcript
                };
            }
            // Não precisamos mais do 'editorChain.run()' aqui embaixo
        };

        recognition.onerror = (err) => {
            // ... (código do onerror sem mudanças)
        };

        recognition.onend = () => {
            // ... (código do onend sem mudanças)
        };

        recognitionRef.current = recognition;
        
        return () => {
            recognition.stop();
        };
        
    }, [editor, isRecording]);

    const toggleRecording = () => {
        if (!recognitionRef.current) return;
        
        if (isRecording) {
            // Usuário clicou para PARAR
            setIsRecording(false); // <-- Seta o estado
            recognitionRef.current.stop(); // <-- Para a API
            // O 'onend' será chamado e fará a limpeza/confirmação.
        } else {
            // Usuário clicou para COMEÇAR
            editor?.chain().focus().run(); 
            setIsRecording(true); // <-- Seta o estado
            recognitionRef.current.start(); // <-- Inicia a API
        }
    };

    const comandos = {
        toggleBold: () => editor.chain().focus().toggleBold().run(),
        toggleItalic: () => editor.chain().focus().toggleItalic().run(),
        toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
        toggleCodeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
        toggleH1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        toggleH2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        toggleH3: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        toggleParrafo: () => editor.chain().focus().setParagraph().run(),
        toggleListaOrdenada: () => editor.chain().focus().toggleOrderedList().run(),
        toggleListaPontos: () => editor.chain().focus().toggleBulletList().run(),
        agregarImagen: (url) => {
            if (!url) return;
            editor.chain().focus().setImage({ src: url }).run();
        },
        agregarLink: () => {
            const url = window.prompt('URL do link')
            if (url) {
                editor.chain().focus().setLink({ href: url }).run()
            }
        }
    }

    return (
        <div className="page-wrapper">
            <div className="content">
                <h4 className="page-title">Laudo Médico</h4>
                <div className="d-flex flex-column align-items-left mt-5">
                    <Card style={{ width: "100%", borderRadius: "10px" }}>
                        <Card.Header
                            onClick={() => setOpen(!open)}
                            aria-controls="paciente-content"
                            aria-expanded={open}
                            className="d-flex justify-content-between align-items-center"
                            style={{
                                cursor: "pointer",
                                borderRadius: "25px",
                                padding: "12px 20px",
                            }}
                        >
                            <span>Informações do paciente</span>
                            {open ? <ChevronUp /> : <ChevronDown />}
                        </Card.Header>

                        <Collapse in={open}>
                            <div id="paciente-content" className="p-3">
                                <Select
                                    options={options}
                                    placeholder="Pesquisar paciente..."
                                    isClearable
                                    isSearchable
                                    isDisabled
                                    onChange={handlePacienteChange}
                                    value={options.find(option => option.value === laudos.patient_id) || null}>
                                </Select>

                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Diagnóstico"
                                    name='diagnosis'
                                    value={laudos.diagnosis}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    name='exam'
                                    value={laudos.exam}
                                    onChange={handleChange}
                                    placeholder="Exame"
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    name='conclusion'
                                    value={laudos.conclusion}
                                    onChange={handleChange}
                                    placeholder="Conclusão"
                                />
                            </div>
                        </Collapse>
                    </Card>
                </div>
                <Bar comandos={comandos} handleSubmit={handleSubmit} toggleRecording={toggleRecording} isRecording={isRecording} />
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export default LaudoConsulta;