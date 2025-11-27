import "../../assets/css/index.css";
import { withMask } from "use-mask-input";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAccessToken } from "../../utils/auth.js";
import { useResponsive } from '../../utils/useResponsive.js';
import { getUserRole } from "../../utils/userInfo.js";


function EditDoctor() {
  const [doctorData, setDoctorData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const role = getUserRole();

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Buscar médico pelo ID
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const tokenUsuario = getAccessToken();

        const response = await fetch(
          `${supabaseUrl}/rest/v1/doctors?id=eq.${id}`,
          {
            method: "GET",
            headers: {
              apikey: supabaseAK,
              Authorization: `Bearer ${tokenUsuario}`,
            },
          }
        );

        const data = await response.json();
        if (data && data.length > 0) {
          setDoctorData(data[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar médico:", err);
      }
    };

    fetchDoctor();
  }, [id]);

  // Atualizar campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Buscar CEP
  const buscarCep = () => {
    const cep = doctorData.cep?.replace(/\D/g, "");
    if (!cep) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        setDoctorData((prev) => ({
          ...prev,
          city: data.localidade || "",
          state: data.uf || "",
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
        }));
      })
      .catch((err) => console.error("Erro ao buscar CEP:", err));
  };

  // Salvar alterações
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
        const tokenUsuario = getAccessToken();

        const response = await fetch(
          `${supabaseUrl}/rest/v1/doctors?id=eq.${id}`,
          {
            method: "PATCH",
            headers: {
              apikey: supabaseAK,
              Authorization: `Bearer ${tokenUsuario}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(doctorData),
          }
        );

        if (!response.ok) {
          const err = await response.json();
          Swal.fire("Erro!", err.message || "Não foi possível salvar.", "error");
          return;
        }

        await Swal.fire("Sucesso!", "As alterações foram salvas.", "success");
        navigate(`/${role}/doctorlist`);
      } catch (err) {
        console.error("Erro inesperado:", err);
        Swal.fire("Erro!", "Não foi possível salvar as alterações.", "error");
      }
    }
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
              <form onSubmit={handleEdit}>
                <div className="row">
                  {/* Nome completo */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Nome Completo</label>
                      <input
                        className="form-control"
                        type="text"
                        name="full_name"
                        value={doctorData.full_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* CPF */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CPF</label>
                      <input
                        className="form-control"
                        type="text"
                        ref={withMask("cpf")}
                        name="cpf"
                        value={doctorData.cpf || ""}
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
                        name="email"
                        value={doctorData.email || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Telefone Celular</label>
                      <input
                        className="form-control"
                        type="text"
                        ref={withMask("+99 (99) 99999-9999")}
                        name="phone_mobile"
                        value={doctorData.phone_mobile || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* CRM */}
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label>CRM</label>
                      <input
                        className="form-control"
                        type="text"
                        name="crm"
                        value={doctorData.crm || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* CRM UF */}
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label>CRM - UF</label>
                      <select
                        className="form-control"
                        name="crm_uf"
                        value={doctorData.crm_uf || ""}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        <option value="AC">AC - Acre</option>
                        <option value="AL">AL - Alagoas</option>
                        <option value="AP">AP - Amapá</option>
                        <option value="AM">AM - Amazonas</option>
                        <option value="BA">BA - Bahia</option>
                        <option value="CE">CE - Ceará</option>
                        <option value="DF">DF - Distrito Federal</option>
                        <option value="ES">ES - Espírito Santo</option>
                        <option value="GO">GO - Goiás</option>
                        <option value="MA">MA - Maranhão</option>
                        <option value="MT">MT - Mato Grosso</option>
                        <option value="MS">MS - Mato Grosso do Sul</option>
                        <option value="MG">MG - Minas Gerais</option>
                        <option value="PA">PA - Pará</option>
                        <option value="PB">PB - Paraíba</option>
                        <option value="PR">PR - Paraná</option>
                        <option value="PE">PE - Pernambuco</option>
                        <option value="PI">PI - Piauí</option>
                        <option value="RJ">RJ - Rio de Janeiro</option>
                        <option value="RN">RN - Rio Grande do Norte</option>
                        <option value="RS">RS - Rio Grande do Sul</option>
                        <option value="RO">RO - Rondônia</option>
                        <option value="RR">RR - Roraima</option>
                        <option value="SC">SC - Santa Catarina</option>
                        <option value="SP">SP - São Paulo</option>
                        <option value="SE">SE - Sergipe</option>
                        <option value="TO">TO - Tocantins</option>
                      </select>
                    </div>
                  </div>

                  {/* Especialidade */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Especialidade</label>
                      <select
                        className="form-control"
                        name="specialty"
                        value={doctorData.specialty || ""}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        <option value="Cardiologia">Cardiologia</option>
                        <option value="Dermatologia">Dermatologia</option>
                        <option value="Endocrinologia">Endocrinologia</option>
                        <option value="Gastroenterologia">Gastroenterologia</option>
                        <option value="Ginecologia">Ginecologia</option>
                        <option value="Neurologia">Neurologia</option>
                        <option value="Oftalmologia">Oftalmologia</option>
                        <option value="Ortopedia">Ortopedia</option>
                        <option value="Otorrinolaringologia">Otorrinolaringologia</option>
                        <option value="Pediatria">Pediatria</option>
                        <option value="Psiquiatria">Psiquiatria</option>
                        <option value="Urologia">Urologia</option>
                      </select>
                    </div>
                  </div>

                  {/* Data de nascimento */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Data de Nascimento</label>
                      <input
                        type="date"
                        className="form-control"
                        name="birth_date"
                        value={doctorData.birth_date || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* CEP */}
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>CEP</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cep"
                        value={doctorData.cep || ""}
                        onChange={handleChange}
                        onBlur={buscarCep}
                      />
                    </div>
                  </div>

                  {/* Rua */}
                  <div className="col-sm-8">
                    <div className="form-group">
                      <label>Logradouro</label>
                      <input
                        type="text"
                        className="form-control"
                        name="street"
                        value={doctorData.street || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Número */}
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Número</label>
                      <input
                        type="text"
                        className="form-control"
                        name="number"
                        value={doctorData.number || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Complemento */}
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Complemento</label>
                      <input
                        type="text"
                        className="form-control"
                        name="complement"
                        value={doctorData.complement || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Bairro */}
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Bairro</label>
                      <input
                        type="text"
                        className="form-control"
                        name="neighborhood"
                        value={doctorData.neighborhood || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Cidade */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Cidade</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={doctorData.city || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Estado</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={doctorData.state || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Ativo/Inativo */}
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label className="d-block">Status</label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="active"
                          id="ativo"
                          value="true"
                          checked={doctorData.active === true}
                          onChange={() =>
                            setDoctorData((prev) => ({ ...prev, active: true }))
                          }
                        />
                        <label className="form-check-label" htmlFor="ativo">
                          Ativo
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="active"
                          id="inativo"
                          value="false"
                          checked={doctorData.active === false}
                          onChange={() =>
                            setDoctorData((prev) => ({ ...prev, active: false }))
                          }
                        />
                        <label className="form-check-label" htmlFor="inativo">
                          Inativo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="m-t-20 text-center">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Salvar Alterações
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

export default EditDoctor;