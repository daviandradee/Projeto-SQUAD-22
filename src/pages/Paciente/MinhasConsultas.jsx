import "../../assets/css/index.css";
import { useState, useEffect } from "react";

function MinhasConsultas() {
  const [consulta, setConsultas] = useState([]);
  const [search] = useState("");

  useEffect(() => {
    fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes")
      .then((response) => response.json())
      .then((result) => {
        setConsultas(result.data || []);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const filteredConsultas = consulta.filter((c) => {
    if (!c) return false;
    const nome = (c.nome || "").toLowerCase();
    const cpf = (c.cpf || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    const q = search.toLowerCase();
    return nome.includes(q) || cpf.includes(q) || email.includes(q);
  });

  return (
    <div className="content">
      <div className="row mb-4">
        <div className="col-sm-6">
          <h4 className="page-title">Minhas consultas</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table table-striped custom-table">
              <thead>
                <tr>
                  <th>Nome do médico</th>
                  <th>Especialidade</th>
                  <th>Data da consulta</th>
                  <th>Hora da consulta</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultas.length > 0 ? (
                  filteredConsultas.map((c) => (
                    <tr key={c.id}>
                      <td>Davi Andrade</td>
                      <td>Cardiologista</td>
                      <td>{c.created_at}</td>
                      <td>10:00am - 11:00am</td>
                      <td>
                        <span className="custom-badge status-green">
                          Ativo
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      Nenhuma consulta encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinhasConsultas;