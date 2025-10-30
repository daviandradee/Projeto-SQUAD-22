import "../../../assets/css/index.css";
import { withMask } from "use-mask-input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../utils/auth";   


function DoctorForm() {
  const [doctorData, setDoctorData] = useState({
    full_name: "",
    cpf: "",
    email: "",
    crm: "",
    crm_uf: "",
    specialty: "",
    birth_date: "",
    phone_mobile: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    active: false,
  });

  const tokenUsuario = getAccessToken();
  const navigate = useNavigate();

  const estados = {
    AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas",
    BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo",
    GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
    MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
    PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina",
    SP: "São Paulo", SE: "Sergipe", TO: "Tocantins"
  };

  const buscarCep = () => {
    const cep = doctorData.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
        .then((response) => response.json())
        .then((data) => {
          setDoctorData((prev) => ({
            ...prev,
            city: data.city || '',
            street: data.street || '',
            neighborhood: data.neighborhood || '',
            state: estados[data.state] || data.state
          }));
        })
        .catch(() => {
          Swal.fire({ title: "Erro ao buscar CEP", icon: "error" });
        });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDoctorData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "full_name", "cpf", "email", "phone_mobile", "crm", "crm_uf",
      "specialty", "birth_date", "cep", "street", "number",
      "neighborhood", "city", "state"
    ];

    const missingFields = requiredFields.filter(
      (field) => !doctorData[field] || doctorData[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      Swal.fire({
        title: "Campos obrigatórios faltando",
        text: "Por favor, preencha todos os campos antes de continuar.",
        icon: "warning"
      });
      return;
    }

    try {
      // === 2️⃣ ETAPA 1: CRIAR O USUÁRIO NO AUTH (CHAMANDO A FUNCTION) ===
      const authHeaders = new Headers();
      authHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
      authHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
      authHeaders.append("Content-Type", "application/json");
      const authRaw = JSON.stringify({
        ...doctorData,
        password: "12345678", // Usando CRM como senha
        role: "medico"
      });

      console.log("📤 Body enviado para Auth:", authRaw);
      console.log("🌐 Endpoint:", 'https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/create-user-with-password');

      const authResponse = await fetch(
        'https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/create-user-with-password',
        {
          method: 'POST',
          headers: authHeaders,
          body: authRaw,
          redirect: 'follow'
        }
      );
      console.log("📥 Status da resposta:", authResponse.status, authResponse.statusText);
      if (!authResponse.ok) {
        console.log("❌ Resposta não OK de criação de usuário no Auth");
      }else{
        navigate("/admin/doctorlist")
      }
    } catch (error) {
      console.error("❌ Erro no cadastro em duas etapas:", error);
      Swal.fire({
        title: "Erro ao cadastrar",
        text: error.message, // Exibe a mensagem de erro específica
        icon: "error"
      });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Nome completo */}
                  <div className="col-sm-12">
                    <hr />
                    <h2>Dados pessoais</h2>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Nome Completo <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        name="full_name"
                        value={doctorData.full_name}
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
                        value={doctorData.cpf}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Email <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        value={doctorData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Telefone Celular <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        ref={withMask("+99 (99) 99999-9999")}
                        name="phone_mobile"
                        value={doctorData.phone_mobile}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* CRM */}
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label>CRM <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        name="crm"
                        value={doctorData.crm}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* CRM UF */}
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label>CRM - UF <span className="text-danger">*</span></label>
                      <select
                        className="form-control"
                        name="crm_uf"
                        value={doctorData.crm_uf}
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
                      <label>Especialidade <span className="text-danger">*</span></label>
                      <select
                        className="form-control"
                        name="specialty"
                        value={doctorData.specialty}
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
                      <label>Data de Nascimento <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        name="birth_date"
                        value={doctorData.birth_date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/*<div className="col-sm-6">
                  <div className="form-group gender-select">
                    <label className="gen-label">Sexo:<span className="text-danger">*</span></label>
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="radio" name="sex" className="form-check-input"
                          value={"Masculino"}
                          checked={doctorData.sex === "Masculino"}
                          onChange={handleChange}
                        /> Masculino
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="radio" name="sex" className="form-check-input"
                          value={"Feminino"}
                          checked={doctorData.sex === "Feminino"}
                          onChange={handleChange}
                        /> Feminino
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <label className="form-check-label">
                        <input type="radio" name="sex" className="form-check-input"
                          value={"outro"}
                          checked={doctorData.sex === "outro"}
                          onChange={handleChange}
                        /> Outro
                      </label>
                    </div>
                </div>
                </div>*/}
                  <div className="col-sm-12">
                    <hr />
                    <h2>Endereço</h2>
                  </div>


                  {/* CEP */}
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>CEP <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="cep"
                        value={doctorData.cep}
                        onChange={handleChange}
                        onBlur={buscarCep}
                      />
                    </div>
                  </div>

                  {/* Rua */}
                  <div className="col-sm-8">
                    <div className="form-group">
                      <label>Logradouro <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="street"
                        value={doctorData.street}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Número */}
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Número <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="number"
                        value={doctorData.number}
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
                        value={doctorData.complement}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Bairro */}
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Bairro <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="neighborhood"
                        value={doctorData.neighborhood}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Cidade */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Cidade <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={doctorData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Estado <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={doctorData.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Ativo/Inativo */}
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label className="d-block">Status <span className="text-danger">*</span></label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="active"
                          id="ativo"
                          value="true"
                          checked={doctorData.active === true}
                          onChange={() => setDoctorData((prev) => ({ ...prev, active: true }))}
                        />
                        <label className="form-check-label" htmlFor="ativo">Ativo</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="active"
                          id="inativo"
                          value="false"
                          checked={doctorData.active === false}
                          onChange={() => setDoctorData((prev) => ({ ...prev, active: false }))}
                        />
                        <label className="form-check-label" htmlFor="inativo">Inativo</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="m-t-20 text-center">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Cadastrar Médico
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

export default DoctorForm;