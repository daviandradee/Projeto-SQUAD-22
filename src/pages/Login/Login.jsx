import React, { useState } from "react";
import "../../assets/css/Login.css"
import { FaUser, FaLock } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const Navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Navigate("/app")
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2> Faça seu Login</h2>
                <form onSubmit={handleSubmit}>
                    {/* Usuário */}
                    <div className="input-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Usuário"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Senha */}
                    <div className="input-group">
                        <FaLock className="icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">Entrar</button>
                </form>
                <p className="signup">
                    Não tem conta? <a href="#">Cadastre-se</a>
                </p>
            </div>
        </div>
    );
}
