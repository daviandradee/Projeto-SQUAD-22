import { Link } from "react-router-dom";
import "../../assets/css/index.css"

function PatientList() {
  return (
    <div className="main-wrapper">
      {/* Conteúdo da página */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row ">
            <div className="col-sm-4 col-3">
              <div className=" col-sm4 input-group m-3">
                <input type="text" class="form-control" placeholder="Pesquisar"/>
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
                    <tr>
                      <td>João Silva</td>
                      <td>12345678</td>
                      <td>10/05/1990</td>
                      <td>(11) 99999-9999</td>
                      <td>joao@email.com</td>
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
                            <Link className="dropdown-item" to="/patients/edit/1">
                              <i className="fa fa-pencil m-r-5"></i> Editar
                            </Link>
                            <a className="dropdown-item" href="#">
                              <i className="fa fa-trash-o m-r-5"></i> Excluir
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* aqui você pode mapear pacientes do backend depois */}
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
