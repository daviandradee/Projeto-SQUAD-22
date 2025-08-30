import { Link } from "react-router-dom";
import "../../assets/css/index.css"
import { useState } from "react";

function PatientList() {
  // Estado da busca
  const [search, setSearch] = useState("");

  // Aqui futuramente você pode substituir pelos pacientes vindos do backend
  const patients = [
    {
      id: 1,
      nome: "João Silva",
      rg: "12345678",
      nascimento: "10/05/1990",
      telefone: "(11) 99999-9999",
      email: "joao@email.com",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      rg: "87654321",
      nascimento: "22/08/1985",
      telefone: "(11) 98888-8888",
      email: "maria@email.com",
    },
    {
      id: 3,
      nome: "Carlos Souza",
      rg: "45678912",
      nascimento: "03/12/1975",
      telefone: "(11) 97777-7777",
      email: "carlos@email.com",
    },
  ];

  // Filtra pacientes de acordo com o texto digitado
  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.rg.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-wrapper">
      {/* Conteúdo da página */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row ">
            <div className="col-sm-4 col-3">
              <div className="col-sm4 input-group m-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <h4 className="page-title">Lista de Pacientes</h4>
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <Link to="/patient" className="btn btn-primary btn-rounded">
                <i className="fa fa-plus"></i> Adicionar Paciente
              </Link>
            </div>
          </div>

          {/* Tabela de Pacientes */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-border table-striped custom-table datatable mb-0">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>RG</th>
                      <th>Data de Nascimento</th>
                      <th>Telefone</th>
                      <th>Email</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((p) => (
                        <tr key={p.id}>
                          <td>{p.nome}</td>
                          <td>{p.rg}</td>
                          <td>{p.nascimento}</td>
                          <td>{p.telefone}</td>
                          <td>{p.email}</td>
                          <td className="text-right">
                            <div className="dropdown dropdown-action">
                              <a
                                href="#"
                                className="action-icon dropdown-toggle"
                                data-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fa fa-ellipsis-v"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link
                                  className="dropdown-item"
                                  to={`/patients/edit/${p.id}`}
                                >
                                  <i className="fa fa-pencil m-r-5"></i> Editar
                                </Link>
                                <a className="dropdown-item" href="#">
                                  <i className="fa fa-trash-o m-r-5"></i> Excluir
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          Nenhum paciente encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientList;