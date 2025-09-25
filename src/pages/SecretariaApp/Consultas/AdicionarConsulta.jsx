import { useState, useEffect } from "react";
import { withMask } from "use-mask-input";
import { Link } from "react-router-dom";
import "../../../assets/css/index.css";

function AdicionarConsulta() {
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const getToday = () => {
      const today = new Date();
      const offset = today.getTimezoneOffset();
      today.setMinutes(today.getMinutes() - offset);
      return today.toISOString().split("T")[0];
    };

    setMinDate(getToday());
  }, []);

  return (
        <div className="content">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <h1>Nova consulta</h1>
              <hr />
              <h3>Informações do paciente</h3>
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
                      <label>Nome do paciente<span className="text-danger">*</span></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>RG</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>CPF<span className="text-danger">*</span></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email do paciente</label>
                      <input className="form-control" type="email" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Número de telefone do paciente<span className="text-danger">*</span></label>
                      <input className="form-control" type="text" ref={withMask('+55 (99) 99999-9999')} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Data de nascimento<span className="text-danger">*</span></label>
                      <input className="form-control" type="date" />
                    </div>
                  </div>
                  <div className="form-group gender-select col-md-6">
                    <label className="gen-label">Sexo:<span className="text-danger">*</span></label>
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="radio" name="sexo" className="form-check-input"
                        /> Masculino
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="radio" name="sexo" className="form-check-input"
                        /> Feminino
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="radio" name="sexo" className="form-check-input"
                        /> Outro
                      </label>
                    </div>
                  </div>
                </div>
                <hr />
                <h3>Informações do atendimento</h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Especialidade<span className="text-danger">*</span></label>
                      <select className="select form-control">
                        <option>Selecione</option>
                        <option>Cardiologia</option>
                        <option>Pediatria</option>
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
                      <label>Médico<span className="text-danger">*</span></label>
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
                      <label>Data<span className="text-danger">*</span></label>
                      <div>
                        <input
                          type="date"
                          className="form-control"
                          min={minDate}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Horas<span className="text-danger">*</span></label>
                      <div>
                        <input type="time" className="form-control" />
                      </div>
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
                  <Link to="/secretaria/secretariaconsultalist">
                    <button className="btn btn-primary submit-btn" type="button">
                      Criar consulta
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
  );
}
export default AdicionarConsulta;