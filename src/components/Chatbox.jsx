import ChatbotIcon from "./ChatbotIcon"
import "../assets/css/index.css"
import ChatForm from "./ChatForm";
import  ChatMessage  from "./ChatMessage";
import { useState, useRef, useEffect } from "react";
import  {companyInfo}  from "../companyinfo";


function Chatbox() {
    const [chatHistory, setChatHistory] = useState([{
        hideInchat: true,
        role: "model",
        text: companyInfo
    }]);
    const [showChatbot, setShowChatbot] = useState(false);
    const chatBodyRef = useRef()
    const generateBotResponse = async (history) => {
        const   updateHistory = (text, isError = false) =>{
            setChatHistory(prev => [...prev.filter(msg=> msg.text !=="Pensando..."), {role: "model", text, isError}])
        }
        history= history.map(({role, text})=> ({role, parts:[{text}]}))
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "aplication/json"},
            body: JSON.stringify({contents: history })
        }
        try{
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
            const data =await response.json()
            if(!response.ok) throw new error(data.error.message || "Algo deu errado")
            
            const apiResponseText= data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
            updateHistory(apiResponseText)
        } catch (error){
            updateHistory(error.message, true)
        }
    }

    useEffect(()=>{
        chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior:"smooth"})
    }, [chatHistory])
    {/*
        nosso chat */}
    return (
        <div className={`container-chatbox ${showChatbot ? "show-chatbot" : ""}`}>
                <button onClick={()=> setShowChatbot(prev => !prev)} id="chatbot-toggler">
                <span className="material-symbols-rounded">mode_comment</span>
                <span className="material-symbols-rounded">close</span>
            </button>
            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">MediChat</h2>
                    </div>
                    <button onClick={()=> setShowChatbot(prev => !prev)}
                    className="material-symbols-rounded">keyboard_arrow_down</button>
                </div>
                <div  ref= {chatBodyRef}className="chat-body">
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            Bem-vindo 👋 <br /> Sou a assistente virtual da MediConnect, como posso te ajudar?
                        </p>
                    </div>
                    {chatHistory.map((chat,index) => (
                        <ChatMessage kay={index} chat={chat}/>
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