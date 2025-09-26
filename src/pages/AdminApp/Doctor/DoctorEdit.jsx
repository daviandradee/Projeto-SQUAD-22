import "../../../assets/css/index.css";
import { withMask } from "use-mask-input";
import { useState, useEffect } from "react";
import supabase from "../../../Supabase";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function EditDoctor() {
  const [doctors, setDoctors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  // Buscar dados do médico
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from("Doctor")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar médicos:", error);
        } else {
          setDoctors(data);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
      }
    };
    fetchDoctors();
  }, [id]);

  // Atualizar campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctors((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Confirmação antes de editar
  const handleEdit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Deseja salvar as alterações?",
      text: "As modificações serão salvas permanentemente.",
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Salvar",
      denyButtonText: `Não salvar`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const { data, error } = await supabase
          .from("Doctor")
          .update([doctors])
          .eq("id", id)
          .single();

        if (error) throw error;

        await Swal.fire("Salvo!", "As alterações foram salvas.", "success");
      
        navigate("/admin/doctorlist");
      
      } catch (err) {
        console.error("Erro ao editar:", err);
        Swal.fire("Erro!", "Não foi possível salvar as alterações.", "error");
      }


    } else if (result.isDenied) {
      Swal.fire("Alterações não salvas", "", "info");
    }


  };

  // Buscar CEP
  const buscarCep = () => {
    const cep = doctors.cep?.replace(/\D/g, "");
    if (!cep) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        setValuesFromCep(data);
        setDoctors((prev) => ({
          ...prev,
          cidade: data.localidade || "",
          estado: data.uf || "",
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
        }));
      })
      .catch((err) => console.error("Erro ao buscar CEP:", err));
  };

  const setValuesFromCep = (data) => {
    document.getElementById("cidade").value = data.localidade || "";
    document.getElementById("estado").value = data.uf || "";
    document.getElementById("logradouro").value = data.logradouro || "";
    document.getElementById("bairro").value = data.bairro || "";
  };

  return (
    <div className="main-wrapper">
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
                  {/* Nome */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>
                        Nome <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="nome"
                        value={doctors.nome || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Sobrenome */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Sobrenome</label>
                      <input
                        className="form-control"
                        type="text"
                        name="sobrenome"
                        value={doctors.sobrenome || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* CPF */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CPF <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        ref={withMask("cpf")}
                        name="cpf"
                        value={doctors.cpf || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* CRM */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CRM<span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        name="crm"
                        value={doctors.crm || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Especialidade */}
                  <div className="col-sm-6">
                    <label>Especialidade</label>
                    <select
                      name="especialidade"
                      id="especialidade"
                      className="form-control"
                      value={doctors.especialidade || ""}
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
                  {/* Senha */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Senha <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="password"
                        name="senha"
                        value={doctors.senha || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        className="form-control"
                        type="email"
                        ref={withMask("email")}
                        name="email"
                        value={doctors.email || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Confirmar senha */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Confirmar Senha</label>
                      <input
                        className="form-control"
                        type="password"
                        name="confirmarSenha"
                        value={doctors.confirmarSenha || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Data de nascimento */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Data de Nascimento</label>
                      <input
                        type="date"
                        className="form-control"
                        name="data_nascimento"
                        value={doctors.data_nascimento || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Telefone */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Telefone </label>
                      <input
                        className="form-control"
                        type="text"
                        ref={withMask("+99 (99)99999-9999")}
                        name="telefone"
                        value={doctors.telefone || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Sexo */}
                  <div className="col-sm-6">
                    <div className="form-group gender-select">
                      <label className="gen-label">Sexo:</label>
                      {["Masculino", "Feminino", "Outro"].map((sexo) => (
                        <div className="form-check-inline" key={sexo}>
                          <label className="form-check-label">
                            <input
                              type="radio"
                              name="sexo"
                              className="form-check-input"
                              value={sexo}
                              checked={doctors.sexo === sexo}
                              onChange={handleChange}
                            />
                            {sexo}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="col-sm-12">
                    <hr />
                    <h2>Endereço</h2>
                  </div>
                  <div className="col-sm-12">
                    <div className="row">
                      {/* CEP */}
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>CEP</label>
                          <input
                            type="text"
                            className="form-control"
                            id="cep"
                            name="cep"
                            value={doctors.cep || ""}
                            onChange={handleChange}
                            onBlur={buscarCep}
                          />
                        </div>
                      </div>
                      {/* Bairro */}
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Bairro</label>
                          <input
                            type="text"
                            className="form-control"
                            id="bairro"
                            name="bairro"
                            value={doctors.bairro || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Referência */}
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Referência</label>
                          <input
                            type="text"
                            className="form-control"
                            id="referencia"
                            name="referencia"
                            value={doctors.referencia || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Logradouro */}
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Logradouro</label>
                          <input
                            type="text"
                            className="form-control"
                            id="logradouro"
                            name="logradouro"
                            value={doctors.logradouro || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Complemento */}
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Complemento</label>
                          <input
                            type="text"
                            className="form-control"
                            id="complemento"
                            name="complemento"
                            value={doctors.complemento || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Cidade */}
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Cidade</label>
                          <input
                            type="text"
                            className="form-control"
                            id="cidade"
                            name="cidade"
                            value={doctors.cidade || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Estado */}
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Estado</label>
                          <input
                            type="text"
                            className="form-control"
                            id="estado"
                            name="estado"
                            value={doctors.estado || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Número */}
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Número</label>
                          <input
                            type="text"
                            className="form-control"
                            id="numero"
                            name="numero"
                            value={doctors.numero || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Anexo e Foto */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Anexo</label>
                      <div className="profile-upload">
                        <div className="upload-img">
                          <img alt="" src="assets/img/user.jpg" />
                        </div>
                        <div className="upload-input">
                          <input
                            type="file"
                            multiple
                            accept="image/png, image/jpeg"
                            className="form-control"
                          />
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
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Biografia */}
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label>Biografia</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        cols="30"
                        name="biografia"
                        value={doctors.biografia || ""}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label className="display-block">Status</label>
                      {["ativo", "inativo"].map((status) => (
                        <div className="form-check form-check-inline" key={status}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="status"
                            value={status}
                            checked={doctors.status === status}
                            onChange={handleChange}
                          />
                          <label className="form-check-label">{status.charAt(0).toUpperCase() + status.slice(1)}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botão de Editar */}
                  <div className="col-sm-12 m-t-20 text-center">
                      <button
                        className="btn btn-primary submit-btn"
                        onClick={handleEdit}
                      >
                        Editar
                      </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDoctor;
