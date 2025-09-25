import React from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
export default function PatientDashboard() {

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
      <h1>Bem vindo, Lucas</h1>
        <div className="row">
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg1"><i className="fa fa-stethoscope" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>3</h3>
              <span className="widget-title1">Exames <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg2"><i className="fa fa-user-md" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>1</h3>
              <span className="widget-title2">Consulta <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div className="col-24 col-md-12 col-lg-12 col-xl-12">
                                <Link to="/patientapp/meuexame"><div className="card">
                                    <div className="card-header">
                                        <h4 className="text-left">Exames </h4> <Link className="btn btn-primary float-right" to="/patientapp/meuexame">Ver todos</Link>
                                    </div>
                                    <div className="card-block">
                                        <div className="table-responsive">
                                            <table className="table table-border table-striped custom-table mb-0">
                            <thead>
                            <tr >
                              <th>Nome</th>
                              <th>Data</th>
                              <th>Status</th>
                              <th className="text-center">Ação</th>
                            </tr>
                          </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            Hemograma Completo
                                                        </td>
                                                        <td>
                                                            10/09/2025
                                                        </td>
                                                        <td>
                                                            Concluído
                                                        </td>
                                                        <td className="text-center">
                                                        <Link className="btn btn-outline-primary take-btn">Detalhes</Link> 
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Raio-X Tórax
                                                        </td>
                                                        <td>
                                                            05/09/2025
                                                        </td>
                                                        <td>
                                                            Em Andamento
                                                        </td>
                                                        <td className="text-center">
                                                        <Link className="btn btn-outline-primary take-btn">Detalhes</Link> 
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Ressonância Magnética
                                                        </td>
                                                        <td>
                                                            20/08/2025
                                                        </td>
                                                        <td>
                                                            Concluído
                                                        </td>
                                                        <td className="text-center">
                                                        <Link className="btn btn-outline-primary take-btn">Detalhes</Link> 
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div></Link>
                            </div>
        <div className="col-24 col-md-12 col-lg-12 col-xl-12">
                                <Link to="/patientapp/minhasconsultas"><div className="card">
                                    <div className="card-header">
                                        <h4 className="text-left">Consultas </h4> <Link className="btn btn-primary float-right" to="/patientapp/minhasconsultas">Ver todos</Link>
                                    </div>
                                    <div className="card-block">
                                        <div className="table-responsive">
                                            <table className="table table-border table-striped custom-table mb-0">
                            <thead>
                            <tr >
                              <th>Nome do Médico</th>
                              <th>Especialidade</th>
                              <th>Data</th>
                              <th>Hora</th>
                              <th>Status</th>
                              <th className="text-center">Ação</th>
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
                      <td className="text-center">
                        <Link className="btn btn-outline-primary take-btn">Detalhes</Link> 
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
                                </div></Link>
                            </div>
        
        </div>
    </div>
    )
}