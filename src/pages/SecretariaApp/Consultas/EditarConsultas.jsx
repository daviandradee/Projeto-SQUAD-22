import { useState, useEffect } from "react";
import { withMask } from "use-mask-input";
import { Link, useParams } from "react-router-dom";
import "../../../assets/css/index.css";
import { getAccessToken } from "../../../utils/auth";

function EditarConsultas() {
  const tokenUsuario = getAccessToken()
  const { id } = useParams()
  const [minDate, setMinDate] = useState("");
  const [consultas, setConsultas] = useState([])
  var myHeaders = new Headers();
  myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  // eh carregda a lista
  useEffect(() => {
    fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients`, requestOptions)
      .then(response => response.json())
      .then(result => {
        const consulta = result.find(c => c.id == id);
        setConsultas(consulta || []);
        console.log(consulta)
      })
      .catch(error => console.log('error', error));
  }, [])

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
          <h1>Editar consulta</h1>
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
                    value={consultas.id}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Nome do paciente<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" value={consultas.full_name} />
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
                  <input type="text" className="form-control" value={consultas.cpf} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Email do paciente</label>
                  <input className="form-control" type="email"  value={consultas.email}/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Número de telefone do paciente<span className="text-danger">*</span></label>
                  <input className="form-control" type="text" value={consultas.phone_mobile} ref={withMask('+55 (99) 99999-9999')} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Data de nascimento<span className="text-danger">*</span></label>
                  <input className="form-control"  value= {consultas.birth_date}type="date" />
                </div>
              </div>
              <div className="form-group gender-select col-md-6">
                <label className="gen-label">Sexo:<span className="text-danger">*</span></label>
                <div className="form-check-inline">
                  <label className="form-check-label">
                    <input type="radio" id="sex" name="sex" className="form-check-input"
                      value={"Masculino"}
                      checked={consultas.sex === "Masculino"}
                      
                    /> Masculino
                  </label>
                </div>
                <div className="form-check-inline">
                  <label className="form-check-label">
                    <input type="radio" id="sex" name="sex" className="form-check-input"
                      value={"Feminino"}
                      checked={consultas.sex === "Feminino"}
                      
                    /> Feminino
                  </label>
                </div>
                <div className="form-check-inline">
                  <label className="form-check-label">
                    <input type="radio" id="sex" name="sex" className="form-check-input"
                      value={"Outro"}
                      checked={consultas.sex === "Outro"}
                      
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
                  Salvar
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default EditarConsultas;