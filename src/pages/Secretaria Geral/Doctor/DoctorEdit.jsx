import "../../../assets/css/index.css";
import { withMask } from "use-mask-input";
import { useState } from "react";
import supabase from "../../../Supabase";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function EditDoctor() {
    const [doctors, setdoctors] = useState([]);

    const {id} = useParams()
    useEffect(() => {
    const fetchDoctors = async () => {
      const {data, error} = await supabase
        .from('Doctor')
        .select('*')
        .eq ('id', id)
        .single()
      if(error){
        console.error("Erro ao buscar pacientes:", error);
      }else{
        setdoctors(data);
      }
    };
    fetchDoctors();
  } , []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setdoctors((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  const handleEdit = async (e) => {
    const { data, error } = await supabase
      .from("Doctor")
      .update([doctors])
      .eq ('id', id)
      .single()
    
  };

  const buscarCep = (e) => {
    const cep = doctors.cep.replace(/\D/g, '');
    console.log(cep);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        // salvando os valores para depois colocar nos inputs
        setValuesFromCep(data)
        // estou salvando os valoeres no patientData
        setdoctors((prev) => ({
          ...prev,
          cidade: data.localidade || '',
          estado: data.estado || '',
          logradouro: data.logradouro || "",
          bairro: data.bairro || '',
        }));
      })
  }
  const setValuesFromCep = (data) => {
    document.getElementById('cidade').value = data.localidade || '';
    document.getElementById('estado').value = data.uf || '';
    document.getElementById('logradouro').value= data.logradouro || '';
    document.getElementById('bairro').value= data.bairro || '';
  }
  return (
    <div className="main-wrapper">
      {/* FORMULÁRIO*/}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <h4 className="page-title">Editar Médico</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <form>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>
                        Nome <span className="text-danger">*</span>
                      </label>
                      <input className="form-control" type="text"
                        name="nome"
                        value={doctors.nome}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Sobrenome</label>
                      <input className="form-control" type="text"
                        name="sobrenome"
                        value={doctors.sobrenome}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CPF <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" ref={withMask('cpf')}
                        name="cpf"
                        value={doctors.cpf}
                        onChange={handleChange}

                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CRM<span className="text-danger">*</span></label>
                      <input className="form-control" type="text"
                        name="crm"
                        value={doctors.crm}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label>Especialidade</label>
                    <select
                      name="especialidade"
                      id="especialidade"
                      className="form-control"
                      value={doctors.especialidade}
                      onChange={handleChange}
                    >
                      <option value="">Selecionar</option>
                      <option value="cardiologista">Cardiologista</option>
                      <option value="Pediatria">Pediatria</option>
                      <option value="Dermatologia">Dermatologia</option>
                      <option value="Ginecologia">Ginecologia</option>
                      <option value="Neurologia">Neurologia</option>
                      <option value="Psiquiatria">Psiquiatria</option>
                      <option value="Ortopedia">Ortopedia</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Senha <span className="text-danger">*</span></label>
                      <input className="form-control" type="password"
                        name="senha"
                        value={doctors.senha}
                        onChange={handleChange} />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input className="form-control" type="email" ref={withMask('email')}
                        name="email"
                        value={doctors.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Confirmar Senha</label>
                      <input className="form-control" type="password"
                        name="confirmarSenha"
                        value={doctors.confirmarSenha}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Data de Nascimento</label>
                      <div className="">
                        <input type="date" className="form-control"
                          name="data_nascimento"
                          value={doctors.data_nascimento}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Telefone </label>
                      <input className="form-control" type="text" ref={withMask('+99 (99)99999-9999')}
                        name="telefone"
                        value={doctors.telefone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group gender-select">
                      <label className="gen-label">Sexo:</label>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="radio" name="sexo" className="form-check-input"
                            value={"Masculino"}
                            checked={doctors.sexo === "Masculino"}
                            onChange={handleChange}
                          />Masculino
                        </label>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="radio" name="sexo" className="form-check-input"
                            value={"Feminino"}
                            checked={doctors.sexo === "Feminino"}
                            onChange={handleChange}
                          />Feminino
                        </label>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="radio" name="sexo" className="form-check-input"
                            value={"Outro"}
                            checked={doctors.sexo === "Outro"}
                            onChange={handleChange}
                          />Outro
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <hr />
                    <h2>Endereço</h2>
                  </div>
                  <div className="col-sm-12">
                    <div className="row">
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>CEP</label>
                          <input type="text" className="form-control "
                            id="cep"
                            name="cep"
                            value={doctors.cep}
                            onChange={handleChange}
                            onBlur={buscarCep}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Bairro</label>
                          <input type="text" className="form-control "
                            id="bairro"
                            name="bairro"
                            value={doctors.bairro}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Referência</label>
                          <input type="text" className="form-control "
                            id="referencia"
                            name="referencia"
                            Referência
                            value={doctors.referencia}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Logradouro</label>
                          <input type="text" className="form-control "
                            id="logradouro"
                            name="logradouro"
                            Referência
                            value={doctors.logradouro}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Complemento</label>
                          <input type="text" className="form-control "
                            id="complemento"
                            name="complemento"
                            Referência
                            value={doctors.complemento}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Cidade</label>
                          <input type="text" className="form-control"
                            id="cidade"
                            name="cidade"
                            value={doctors.cidade}
                            onChange={handleChange}

                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Estado</label>
                          <input type="text" className="form-control"
                            id="estado"
                            name="estado"
                            value={doctors.estado}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Número</label>
                          <input type="text" className="form-control"
                            id="numero"
                            name="numero"
                            value={doctors.numero}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Anexo</label>
                    <div className="profile-upload">
                      <div className="upload-img">
                        <img alt="" src="assets/img/user.jpg" />
                      </div>
                      <div className="upload-input">
                        <input type="file" multiple accept="image/png, image/jpeg" className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Foto</label>
                    <div className="profile-upload">
                      <div className="upload-img">
                        <img alt="" src="assets/img/user.jpg" />
                      </div>
                      <div className="upload-input">
                        <input type="file" accept="image/png, image/jpeg" className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Biografia</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    cols="30"
                    name="biografia"
                    value={doctors.biografia}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="display-block">Status</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="status"
                      value="ativo"
                      checked={doctors.status === "ativo"}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="doctor_active"
                    >
                      Ativo
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="status"
                      value="inativo"
                      checked={doctors.status === "inativo"}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="doctor_inactive"
                    >
                      Inativo
                    </label>
                  </div>
                </div>
                <div className="m-t-20 text-center">
                 <Link to="/doctorlist"><button 
                  className="btn btn-primary submit-btn"
                    onClick={handleEdit}>
                    Editar
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
export default EditDoctor
