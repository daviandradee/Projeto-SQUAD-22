import { useState, useEffect, useRef } from "react";
import "../../../assets/css/index.css";
import { withMask } from "use-mask-input";
import supabase from "../../../Supabase";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../../utils/auth";
import AvatarForm from "../../../../public/img/AvatarForm.jpg";
import AnexoDocumento from "../../../../public/img/AnexoDocumento.png";
import Swal from "sweetalert2";

function Patientform() {
    const tokenUsuario = getAccessToken();
    const [patientData, setpatientData] = useState({
        full_name: "",
        cpf: "",
        email: "",
        birth_date: "",
        social_name: "",
        sex: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        cep: "",
        ethnicity: "",
        father_name: "",
        father_profession: "",
        legacy_code: "",
        marital_status: "",
        mother_name: "",
        mother_profession: "",
        phone1: "",
        phone2: "",
        phone_mobile: "",
        profession: "",
        reference: "",
        guardian_cpf: "",
        guardian_name: "",
        complement: "",
    });
    const [previewUrl, setPreviewUrl] = useState(AvatarForm);
    const [fotoFile, setFotoFile] = useState(null);
    const fileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Estado atualizado:", patientData);
    }, [patientData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setpatientData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const estados = {
        AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia",
        CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
        MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
        MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
        PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
        RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina",
        SP: "São Paulo", SE: "Sergipe", TO: "Tocantins"
    };

    const setValuesFromCep = (data) => {
        setpatientData((prev) => ({
            ...prev,
            city: data.city || '',
            street: data.street || '',
            neighborhood: data.neighborhood || '',
            state: estados[data.state] || data.state || '',
        }));
    };

    const buscarCep = (e) => {
        const cep = patientData.cep.replace(/\D/g, "");
        if (cep.length !== 8) return;

        fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
            .then((response) => response.json())
            .then((data) => {
                if (data && !data.errors) {
                    setValuesFromCep(data);
                } else {
                    console.log("CEP não encontrado");
                }
            })
            .catch(err => console.error("Erro ao buscar CEP:", err));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "full_name", "cpf", "birth_date", "sex", "phone_mobile",
            "cep", "street", "number", "neighborhood", "state", "email"
        ];

        const missingFields = requiredFields.filter(
            (field) => !patientData[field] || patientData[field].toString().trim() === ""
        );

        if (missingFields.length > 0) {
            Swal.fire("Atenção", `Campos obrigatórios faltando: ${missingFields.join(", ")}`, "warning");
            return;
        }

        try {
            const headers = new Headers();
            headers.append("apikey",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"
            );
            headers.append("Authorization", `Bearer ${tokenUsuario}`);
            headers.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                ...patientData,
                password: "12345678", // senha padrão
                role: "paciente", // role padrão
                create_patient_record: true
            });

            console.log("📤 Enviando dados:", raw);

            const response = await fetch(
                "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/create-user-with-password",
                {
                    method: "POST",
                    headers,
                    body: raw,
                    redirect: "follow"
                }
            );

            console.log("📥 Status:", response.status, response.statusText);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao cadastrar paciente");
            }

            Swal.fire({
                title: "Paciente cadastrado com sucesso!",
                icon: "success",
            });

            navigate("/admin/patientlist");

        } catch (error) {
            console.error("❌ Erro no cadastro:", error);
            Swal.fire({
                title: "Erro ao cadastrar",
                text: error.message,
                icon: "error",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFotoFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="main-wrapper">
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <h2 className="">Dados pessoais</h2>
                            <hr />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Avatar</label>
                                            <div className="profile-upload">
                                                <div className="upload-img">
                                                    <img
                                                        alt=""
                                                        src={previewUrl}
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-9">
                                                        <div className="upload-input">
                                                            <input
                                                                name="foto_url"
                                                                type="file"
                                                                ref={fileRef}
                                                                accept="image/png, image/jpeg"
                                                                className="form-control"
                                                                onChange={handleFileChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div
                                                            className="btn btn-primary"
                                                            onClick={async () => {
                                                                setpatientData((prev) => ({
                                                                    ...prev,
                                                                    foto_url: "",
                                                                }));
                                                                setFotoFile(null);
                                                                setPreviewUrl(AvatarForm);
                                                                if (fileRef.current) fileRef.current.value = null;
                                                            }}
                                                        >
                                                            Limpar
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Nome completo<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                required
                                                name="full_name"
                                                value={patientData.full_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>RG</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="rg"
                                                value={patientData.rg || ""}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Outros documentos de identidade</label>
                                            <select
                                                id="outrosdoc"
                                                className="form-control"
                                                name="outros_documentos"
                                                value={patientData.outros_documentos || ""}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecionar</option>
                                                <option value="cnh">CNH</option>
                                                <option value="passaporte">Passaporte</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Raça</label>
                                            <select
                                                name="ethnicity"
                                                id="ethnicity"
                                                className="form-control"
                                                value={patientData.ethnicity}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecionar</option>
                                                <option value="preta">Preta</option>
                                                <option value="branca">Branca</option>
                                                <option value="parda">Parda</option>
                                                <option value="amarela">Amarela</option>
                                                <option value="indigena">Indígena</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Profissão</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="profession"
                                                value={patientData.profession}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Nome da mãe</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="mother_name"
                                                value={patientData.mother_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Profissão da mãe</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="mother_profession"
                                                value={patientData.mother_profession}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Nome do responsável</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="guardian_name"
                                                value={patientData.guardian_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-check-inline">
                                            <label className="form-check-label">
                                                <input
                                                    type="checkbox"
                                                    name="rn"
                                                    className="form-check-input"
                                                    value={true}
                                                    checked={patientData.rn === true}
                                                    onChange={(e) =>
                                                        setpatientData({
                                                            ...patientData,
                                                            rn: e.target.checked,
                                                        })
                                                    }
                                                />
                                                RN na Guia do convênio
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Nome social</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="social_name"
                                                value={patientData.social_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>CPF<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                ref={withMask("999.999.999-99")}
                                                name="cpf"
                                                value={patientData.cpf}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Número do documento</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="document_number"
                                                value={patientData.document_number || ""}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Estado civil</label>
                                            <select
                                                id="marital_status"
                                                className="form-control"
                                                name="marital_status"
                                                value={patientData.marital_status}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecionar</option>
                                                <option value="solteiro">Solteiro(a)</option>
                                                <option value="casado">Casado(a)</option>
                                                <option value="viuvo">Viúvo(a)</option>
                                                <option value="separado">Separado(a)</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Data de Nascimento<span className="text-danger">*</span></label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="birth_date"
                                                value={patientData.birth_date}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Nome do pai</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="father_name"
                                                value={patientData.father_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Profissão do pai</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="father_profession"
                                                value={patientData.father_profession}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>CPF do responsável</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                ref={withMask("999.999.999-99")}
                                                name="guardian_cpf"
                                                value={patientData.guardian_cpf}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Código legado</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="legacy_code"
                                                value={patientData.legacy_code}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group gender-select">
                                            <label className="gen-label">
                                                Sexo:<span className="text-danger">*</span>
                                            </label>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input
                                                        type="radio"
                                                        name="sex"
                                                        className="form-check-input"
                                                        value={"Masculino"}
                                                        checked={patientData.sex === "Masculino"}
                                                        onChange={handleChange}
                                                    />{" "}
                                                    Masculino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input
                                                        type="radio"
                                                        name="sex"
                                                        className="form-check-input"
                                                        value={"Feminino"}
                                                        checked={patientData.sex === "Feminino"}
                                                        onChange={handleChange}
                                                    />{" "}
                                                    Feminino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input
                                                        type="radio"
                                                        name="sex"
                                                        className="form-check-input"
                                                        value={"Outro"}
                                                        checked={patientData.sex === "Outro"}
                                                        onChange={handleChange}
                                                    />{" "}
                                                    Outro
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contato */}
                                    <div className="col-sm-12">
                                        <hr />
                                        <h2>Contato</h2>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Celular<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                ref={withMask("(99) 99999-9999")}
                                                name="phone_mobile"
                                                value={patientData.phone_mobile}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 1</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                ref={withMask("(99) 9999-9999")}
                                                name="phone1"
                                                value={patientData.phone1}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="email"
                                                name="email"
                                                value={patientData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 2</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                ref={withMask("(99) 9999-9999")}
                                                name="phone2"
                                                value={patientData.phone2}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Endereço */}
                                    <div className="col-sm-12">
                                        <hr />
                                        <h2>Endereço</h2>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>CEP<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                ref={withMask("99999-999")}
                                                name="cep"
                                                value={patientData.cep}
                                                onChange={handleChange}
                                                onBlur={buscarCep}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cidade<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={patientData.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Rua<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="street"
                                                name="street"
                                                value={patientData.street}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Complemento</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="complement"
                                                name="complement"
                                                value={patientData.complement}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Estado<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={patientData.state}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="number"
                                                value={patientData.number}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bairro<span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="neighborhood"
                                                name="neighborhood"
                                                value={patientData.neighborhood}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Referência</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="reference"
                                                value={patientData.reference}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-12">
                                    <hr />
                                </div>

                                <div className="form-group">
                                    <label className="display-block">
                                        Status<span className="text-danger">*</span>
                                    </label>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="status"
                                            id="patient_active"
                                            value={"ativo"}
                                            checked={patientData.status === "ativo"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="patient_active">
                                            Ativo
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="status"
                                            id="patient_inactive"
                                            value="inativo"
                                            checked={patientData.status === "inativo"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="patient_inactive">
                                            Inativo
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Observação</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="observacao"
                                        value={patientData.observacao || ""}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Documentos</label>
                                </div>

                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary submit-btn" type="submit">
                                        Criar Paciente
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

export default Patientform;

