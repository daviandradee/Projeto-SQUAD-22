import "../../../assets/css/index.css"
import { Link } from "react-router-dom";

function Doctorschedule() {
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-sm-4 col-3">
              <h4 className="page-title">Agenda médica</h4>
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <Link
                to ="/admin/addschedule"
                className="btn btn-primary btn-rounded float-right"
              >
                <i className="fa fa-plus"></i> Adicionar agenda
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-border table-striped custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Departamento</th>
                      <th>Dias disponíveis</th>
                      <th>Horário disponível</th>
                      <th>Status</th>
                      <th className="text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img
                          width="28"
                          height="28"
                          src="/img/user.jpg"
                          className="rounded-circle m-r-5"
                          alt="user"
                        />{" "}
                        Henry Daniels
                      </td>
                      <td>Cardiologista</td>
                      <td>Segunda-feira, Terça-feira, Quinta-feira</td>
                      <td>10:00 AM - 7:00 PM</td>
                      <td>
                        <span className="custom-badge status-green">Ativo</span>
                      </td>
                      <td className="text-right">
                        <div className="dropdown dropdown-action">
                          <a
                            href="#"
                            className="action-icon dropdown-toggle"
                          >
                            <i className="fa fa-ellipsis-v"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="edit-schedule.html">
                              <i className="fa fa-pencil m-r-5"></i> Editar
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                            >
                              <i className="fa fa-trash-o m-r-5"></i> Deletar
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de exclusão */}
      <div id="delete_schedule" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Você tem certeza que deseja deletar essa agenda?</h3>
              <div className="m-t-20">
                <a href="#" className="btn btn-white">
                  Fechar
                </a>
                <button type="submit" className="btn btn-danger">
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Doctorschedule
