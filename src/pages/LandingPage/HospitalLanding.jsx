import React from "react";
import "../../assets/css/hospital.css";
import { useEffect } from "react";

export default function HospitalLanding() {
    const especialidades = [
        { nome: "Cardiologia", img: "/img/specialities-04.png" },
        { nome: "Neurologia", img: "/img/specialities-02.png" },
        { nome: "Ortopedia", img: "/img/specialities-03.png" },
        { nome: "Odontologia", img: "/img/specialities-05.png" },
        { nome: "Urologia", img: "/img/specialities-01.png" },
    ];
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector(".landing-header");
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div className="landing-root">
            {/* HEADER */}
            <header className="landing-header">
                <div className="container header-content">
                    <div className="logo-area">
                        <img src="/img/logo50.png" alt="Logo Medi-Connect" />
                        <h1>Medi-Connect</h1>
                    </div>
                    <nav className="nav-links">
                        <a href="#sobre">Sobre</a>
                        <a href="#especialidades">Especialidades</a>
                        <a href="#profissional">Profissionais</a>
                        <a href="#contato">Contato</a>
                        <a href="/login" className="btn-login">
                            Acessar Sistema
                        </a>
                    </nav>
                </div>
            </header>

            {/* HERO - NOVO COM IMAGEM DE FUNDO */}
            <section className="hero-bg-section">
                <div className="hero-overlay">
                    <div className="hero-bg-text">
                        <h1>Cuidamos de Você com Excelência e Tecnologia</h1>
                        <p>
                            Atendimento humanizado e especializado — sua saúde é nossa
                            prioridade.
                        </p>
                        <a href="/login" className="btn-primary">
                            Acessar Sistema
                        </a>
                    </div>
                </div>
            </section>

            {/* SOBRE */}
            <section id="sobre" className="about-section">
                <div className="container about-content">
                    <div className="about-image">
                        <img
                            src="/img/banner.png"
                            alt="Interior da clínica"
                        />
                    </div>
                    <div className="about-text">
                        <h3>Sobre Nós</h3>
                        <p>
                             Oferecendo atendimento médico de excelência,
                            com estrutura moderna e uma equipe comprometida com a vida. No
                            <strong> Medi-Connect</strong>, cada detalhe é pensado para
                            oferecer segurança, conforto e confiança.
                        </p>
                        <div className="about-highlights">
                            <div>🏥 Estrutura moderna</div>
                            <div>👨‍⚕️ Profissionais qualificados</div>
                            <div>🕓 Atendimento 24h</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ESPECIALIDADES */}
            <section id="especialidades" className="specialities-section">
                <div className="container">
                    <div className="section-header">
                        <h3>Nossas Especialidades</h3>
                        <p>
                            Conheça as áreas que fazem do Medi-Connect um centro de referência.
                        </p>
                    </div>

                    <div className="specialities-grid">
                        {especialidades.map((esp, i) => (
                            <div key={i} className="speciality-card">
                                <img src={esp.img} alt={esp.nome} />
                                <h4>{esp.nome}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MÉDICO GIGANTE */}
            <section id="profissional" className="doctor-highlight-section">
                <div className="container doctor-highlight">
                    <div className="doctor-image">
                        <img
                            src="/img/Doctor-Free-PNG-Image.png"
                            alt="Médico sorridente"
                        />
                    </div>
                    <div className="doctor-text">
                        <h3>Profissionais Dedicados ao Seu Bem-Estar</h3>
                        <p>
                            Nossa equipe médica é formada por especialistas experientes e
                            comprometidos em oferecer um atendimento humano, empático e de
                            alta qualidade. Aqui, o cuidado vai muito além do tratamento — é
                            sobre confiança, respeito e dedicação a cada paciente.
                        </p>
                        <a href="#contato" className="btn-primary">
                            Fale Conosco
                        </a>
                    </div>
                </div>
            </section>

            {/* CONTATO */}
            <section className="contact-section" id="contato">
                <div className="container contact-wrapper">
                    <div className="contact-info">
                        <h3>Entre em Contato</h3>
                        <p>Estamos prontos para atender você. Tire suas dúvidas, agende uma consulta ou fale com nossa equipe de atendimento.</p>

                        <div className="contact-cards">
                            <div className="contact-item">
                                <i className="fas fa-phone-alt"></i>
                                <div>
                                    <h4>Telefone</h4>
                                    <p>(11) 4002-8922</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <div>
                                    <h4>Email</h4>
                                    <p>contato@mediconnect.com</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <div>
                                    <h4>Localização</h4>
                                    <p>Av. Paulista, 1000 - São Paulo, SP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form">
                        <h4>Envie uma mensagem</h4>
                        <input type="text" placeholder="Seu nome" required />
                        <input type="email" placeholder="Seu e-mail" required />
                        <textarea placeholder="Sua mensagem" rows="4" required></textarea>
                        <button type="submit" className="btn-primary">Enviar</button>
                    </form>
                </div>
            </section>

            {/* FOOTER */}
            {/* FOOTER */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src="/img/logo50.png" alt="Medi-Connect" />
                        <span>Medi-Connect</span>
                    </div>

                    <div className="footer-socials">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>

                    <div className="footer-bottom">
                        © {new Date().getFullYear()} Medi-Connect — Cuidando da sua saúde com excelência.
                    </div>
                </div>
            </footer>

        </div>
    );
}
