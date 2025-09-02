import "../../assets/css/index.css"
import { withMask } from "use-mask-input";
import { useState } from "react";
import supabase from "../../Supabase"

function DoctorForm() {

  const [doctorData, setdoctorData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    crm: "",
    senha: "",
    confirmarsenha: "",
    email: "",
    data_nascimento: "",
    telefone: "",
    sexo: "",
    endereco: "",
    pais: "",
    cidade: "",
    estado: "",
    cep: "",
    biografia: "",
    status: "inativo",
    especialidade: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdoctorData((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(doctorData);

    const { data, error } = await supabase
      .from("Doctor")
      .insert([doctorData])
    if (error) {
      console.log("Erro ao inserir paciente:", error);
    } else {
      console.log("Paciente inserido com sucesso:", data);
    }
  };

  const buscarCep = (e) => {
    const cep = doctorData.cep.replace(/\D/g, '');
    console.log(cep);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        // salvando os valores para depois colocar nos inputs
        setValuesFromCep(data)
        // estou salvando os valoeres no patientData
        setdoctorData((prev) => ({
          ...prev,
          cidade: data.localidade || '',
          estado: data.estado || '',
        }));
      })
  }
  const setValuesFromCep = (data) => {
    document.getElementById('cidade').value = data.localidade || '';
    document.getElementById('estado').value = data.uf || '';
  }
  return (
    <div className="main-wrapper">
      {/* FORMULÁRIO*/}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <h4 className="page-title">Cadastrar Doutor</h4>
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
                        value={doctorData.nome}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Sobrenome</label>
                      <input className="form-control" type="text"
                        name="sobrenome"
                        value={doctorData.sobrenome}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CPF <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" ref={withMask('cpf')}
                        name="cpf"
                        value={doctorData.cpf}
                        onChange={handleChange}

                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CRM<span className="text-danger">*</span></label>
                      <input className="form-control" type="text"
                        name="crm"
                        value={doctorData.crm}
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
                      value={doctorData.especialidade}
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
                        value={doctorData.senha}
                        onChange={handleChange} />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input className="form-control" type="email" ref={withMask('email')}
                        name="email"
                        value={doctorData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Confirmar Senha</label>
                      <input className="form-control" type="password"
                        name="confirmarSenha"
                        value={doctorData.confirmarSenha}
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
                          value={doctorData.data_nascimento}
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
                        value={doctorData.telefone}
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
                            checked={doctorData.sexo === "Masculino"}
                            onChange={handleChange}
                          />Masculino
                        </label>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="radio" name="sexo" className="form-check-input"
                            value={"Feminino"}
                            checked={doctorData.sexo === "Feminino"}
                            onChange={handleChange}
                          />Feminino
                        </label>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="radio" name="sexo" className="form-check-input"
                            value={"Outro"}
                            checked={doctorData.sexo === "Outro"}
                            onChange={handleChange}
                          />Outro
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Endereço</label>
                          <input type="text" className="form-control "
                            name="endereco"
                            value={doctorData.endereco}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>País</label>
                          <input type="text" className="form-control "
                            id="pais"
                            name="pais"
                            value={doctorData.pais}
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
                            value={doctorData.cidade}
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
                            value={doctorData.estado}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>CEP</label>
                          <input type="text" className="form-control"
                            id="cep"
                            name="cep"
                            value={doctorData.cep}
                            onChange={handleChange}
                            onBlur={buscarCep}
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
                    value={doctorData.biografia}
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
                      id="doctor_active"
                      value="ativo"
                      checked={doctorData.status === "Ativo"}
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
                      id="doctor_inactive"
                      value="inativo"
                      checked={doctorData.status === "Inativo"}
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
                  <button className="btn btn-primary submit-btn"
                    onClick={handleSubmit}>
                    Cadastrar Doutor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DoctorForm
