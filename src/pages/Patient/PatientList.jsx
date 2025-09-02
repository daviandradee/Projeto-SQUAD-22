import { Link } from "react-router-dom";
import "../../assets/css/index.css"
import { useState, useEffect } from "react";
import supabase from "../../Supabase"


function PatientList() {
  // Estado da busca
  const [search, setSearch] = useState("");
  // use state para guardar os pacientes
  const [patients, setPatients] = useState([]);
  // aqui vamos buscar os pacientes no supabase
  useEffect(() => {
    const fetchPatients = async () => {
      const {data, error} = await supabase
        .from('Patient')
        .select('*');
      if(error){
        console.error("Erro ao buscar pacientes:", error);
      }else{
        setPatients(data);
      }
    };
    fetchPatients();
  } , []);
  
  // Filtra pacientes de acordo com o texto digitado
  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.toLowerCase().includes(search.toLowerCase()) ||
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
                      <th>Cpf</th>
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
                          <td>{p.cpf}</td>
                          <td>{p.data_nascimento}</td>
                          <td>{p.celular}</td>
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