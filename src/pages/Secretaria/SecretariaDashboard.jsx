// src/pages/Secretaria/SecretariaDashboard.jsx
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SecretariaDashboard() {
  const lineData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Pacientes",
        data: [120, 150, 180, 200, 250, 300],
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Receita (R$)",
        data: [12000, 15000, 18000, 14000, 20000, 22000],
        backgroundColor: "#50E3C2",
      },
    ],
  };

  // estilos inline
  const dashboardStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    background: "#f4f6f9",
    minHeight: "100vh",
  };

  const cardsContainer = {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "30px",
  };

  const cardStyle = {
    flex: "1 1 180px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  const cardH3 = {
    fontSize: "28px",
    margin: "0",
    color: "#4a90e2",
  };

  const cardP = {
    margin: "5px 0 0",
    fontSize: "16px",
    color: "#666",
  };

  const chartsContainer = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  };

  const chartStyle = {
    flex: "1 1 400px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={dashboardStyle}>
      <h2>Dashboard da Secretaria</h2>

      <div style={cardsContainer}>
        <div style={cardStyle}>
          <h3 style={cardH3}>98</h3>
          <p style={cardP}>Médicos</p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardH3}>1072</h3>
          <p style={cardP}>Pacientes</p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardH3}>72</h3>
          <p style={cardP}>Consultas</p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardH3}>54</h3>
          <p style={cardP}>Laudos</p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardH3}>32</h3>
          <p style={cardP}>Agendamentos</p>
        </div>
      </div>

      <div style={chartsContainer}>
        <div style={chartStyle}>
          <h4>Pacientes por mês</h4>
          <Line data={lineData} />
        </div>
        <div style={chartStyle}>
          <h4>Receita da Clínica</h4>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
