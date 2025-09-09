import { Link } from "react-router-dom";
import "../../assets/css/index.css"


function AgendaForm() {
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <h4 className="page-title">Adicionar consulta</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>ID da consulta</label>
                      <input
                        className="form-control"
                        type="text"
                        value="APT-0001"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Nome do paciente</label>
                        <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Especialidade</label>
                      <select className="select form-control">
                        <option>Selecione</option>
                        <option>Cardiologia</option>
                        <optio>Pediatria</optio>
                        <option>Dermatologia</option>
                        <option>Ginecologia</option>
                        <option>Neurologia</option>
                        <option>Psiquiatria</option>
                         <option>Ortopedia</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Médico</label>
                      <select className="select form-control">
                        <option>Selecione</option>
                        <option>Davi Andrade</option>
                        <option>Caio Pereira</option>
                        <option>Paulo Lucas</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Data</label>
                      <div className="cal-icon">
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Horas</label>
                     < div className="time-icon">
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email do paciente</label>
                      <input className="form-control" type="email" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Número de telefone do paciente</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Observação</label>
                  <textarea cols="30" rows="4" className="form-control"></textarea>
                </div>

                <div className="form-group">
                  <label className="display-block">Status da consulta</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="product_active"
                      value="option1"
                      defaultChecked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="product_active"
                    >
                      Ativo
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="product_inactive"
                      value="option2"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="product_inactive"
                    >
                      Inativo
                    </label>
                  </div>
                </div>

                <div className="m-t-20 text-center">
                  <Link to="/agendalist"><button 
                  className="btn btn-primary submit-btn"
                  type="button">
                    Criar consulta"
                  </button></Link>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AgendaForm;