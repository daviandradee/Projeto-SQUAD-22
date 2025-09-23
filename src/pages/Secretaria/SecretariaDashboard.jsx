import "../../assets/css/SecretariaDashCss.css"

export default function SecretariaDashboard() {
  const menus = [
    { titulo: "Médicos", subtitulo: "Gerenciar médicos da clínica" },
    { titulo: "Pacientes", subtitulo: "Cadastro e acompanhamento de pacientes" },
    { titulo: "Calendário", subtitulo: "Visualizar compromissos e eventos" },
    { titulo: "Agenda Médica", subtitulo: "Controle de horários" },
    { titulo: "Consultas", subtitulo: "Gerenciar consultas" },
    { titulo: "Laudos", subtitulo: "Emitir e organizar laudos médicos" },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard da Secretaria</h1>
      <div className="cards-container">
        {menus.map((item, index) => (
          <div key={index} className="card">
            <h2 className="card-title">{item.titulo}</h2>
            <p className="card-subtitle">{item.subtitulo}</p>
            <button className="card-button">Acessar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
