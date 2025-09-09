import React, { useState } from "react";

function PatientList() {
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    {
      nome: "João Miguel",
      cpf: "091.959.495-69",
      telefone: "+55 (75) 99961-7296",
      email: "Joaomiguel80@gmail.com",
    },
  ];

  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content">
      {/* Barra de Pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar por nome, CPF ou e-mail"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Tabela */}
      <div className="table-container">
        <h3 className="text-center mb-4">Lista de Pacientes</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p, idx) => (
              <tr key={idx}>
                <td>{p.nome}</td>
                <td>{p.cpf}</td>
                <td>{p.telefone}</td>
                <td>{p.email}</td>
                <td>
                  <button className="btn btn-primary btn-sm mr-2">Laudo</button>
                  <button className="btn btn-success btn-sm">Receita</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientList;
