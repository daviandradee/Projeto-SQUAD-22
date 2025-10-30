import { useState, useEffect, useRef } from "react";
import "../../../assets/css/index.css";
import { withMask } from "use-mask-input";
import supabase from "../../../Supabase"; // <-- Você importa mas não usa, a chamada fetch usa URL e chave
import { redirect, useNavigate } from "react-router-dom";
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
        complement: "", // É bom definir um valor padrão
        // ...outros campos que você possa ter
    });
    const [previewUrl, setPreviewUrl] = useState(AvatarForm);
    const [fotoFile, setFotoFile] = useState(null);
    const fileRef = useRef(null);

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
        // Atualiza o estado E os campos (Inputs controlados)
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
        if (cep.length !== 8) return; // Não busca CEP inválido

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

    const navigate = useNavigate();

    // ========================================================================
    // FUNÇÃO DE SUBMIT CORRIGIDA
    // ========================================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // === 1️⃣ VALIDA CAMPOS OBRIGATÓRIOS ===
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
            var raw = JSON.stringify({
                email: patientData.email,
                password: "minhasenha123",
                full_name: patientData.full_name,
                role: "paciente",
                create_patient_record: true,
                cpf: patientData.cpf,
                phone_mobile: patientData.phone_mobile
            });
            const patientHeaders = new Headers();
            patientHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
            patientHeaders.append("Authorization", `Bearer ${tokenUsuario}`); // Token do admin
            patientHeaders.append("Content-Type", "application/json"); // Não precisa do retorno

            const patientResponse = await fetch(
                'https://yuanqfswhberkoevtmfr.supabase.co/create-user-with-password', // CONFIRME: Este é o nome da sua tabela?
                {
                    method: 'POST',
                    headers: patientHeaders,
                    body: raw,
                    redirect: 'follow'
                }
            );

            if (!patientResponse.ok) {
                // Tenta ler o erro vindo do PostgREST
                const errorData = await patientResponse.json().catch(() => ({ message: patientResponse.statusText }));
                throw new Error(`Erro ao salvar dados do paciente: ${errorData.message}`);
            }

            console.log("✅ Dados do Paciente salvos na tabela 'patients'.");
            
            Swal.fire({
                title: "Paciente cadastrado com sucesso!",
                icon: "success",
                draggable: true
            });

            navigate("/admin/patientlist");

        } catch (error) {
            console.error("❌ Erro no cadastro", error);
            Swal.fire({
                title: "Erro ao cadastrar",
                text: error.message, // Exibe a mensagem de erro específica
                icon: "error"
            });
        }
    };
    // ========================================================================
    // FIM DA FUNÇÃO DE SUBMIT
    // ========================================================================


    // (Funções de validarCpf e verificarCpfExistente permanecem as mesmas)
    const validarCpf = async (cpf) => {
        // ... seu código ...
    };
    const verificarCpfExistente = async (cpf) => {
        // ... seu código ...
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFotoFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file)); // gera preview temporário
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
                                                    <img alt="" src={previewUrl} style={{ width: "40px", height: "40px", objectFit: "cover" }} />
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
                                                                onChange={handleFileChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div
                                                            className="btn btn-primary"
                                                            onClick={async () => {
                                                                // Remove no frontend
                                                                setpatientData(prev => ({ ...prev, foto_url: "" }));
                                                                setFotoFile(null)
                                                                setPreviewUrl(AvatarForm); // Limpa no preview
                                                                if (fileRef.current) fileRef.current.value = null;

                                                                // ... (seu código de remover foto no backend, se precisar) ...
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
                                            <input className="form-control" type="text"
                                                required
                                                name="full_name"
                                                value={patientData.full_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>RG</label>
                                            <input className="form-control" type="text"
                                                name="rg" // <-- Esse campo não está no seu state inicial
                                                value={patientData.rg || ''} // Adicionei '|| '' ' para evitar erro de uncontrolled
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Outros documentos de identidade </label>
                                            <select id="outrosdoc" className="form-control"
                                                name="outros_documentos" // <-- Esse campo não está no seu state inicial
                                                value={patientData.outros_documentos || ''}
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
                                                <option value="preta">Preta</option> {/* Corrigido o value */}
                                                <option value="branca">Branca</option>
                                                <option value="parda">Parda</option>
                                                <option value="amarela">Amarela</option>
                                                <option value="indigena">Indígena</option> {/* Corrigido o value */}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão</label>
                                            <input className="form-control" type="text"
                                                name="profession"
                                                value={patientData.profession}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome da mãe</label>
                                            <input className="form-control" type="text"
                                                name="mother_name"
                                                value={patientData.mother_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão da mãe</label>
                                            <input className="form-control" type="text"
                                                name="mother_profession"
                                                value={patientData.mother_profession}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome do responsável</label>
                                            <input className="form-control" type="text"
                                                name="guardian_name"
                                                value={patientData.guardian_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-check-inline">
                                            <label className="form-check-label">
                                                <input type="checkbox" name="rn" className="form-check-input"
                                                    value={true}
                                                    checked={patientData.rn === true} // <-- Esse campo não está no seu state inicial
                                                    onChange={(e) => setpatientData({ ...patientData, rn: e.target.checked })}
                                                />
                                                RN na Guia do convênio
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Nome social</label>
                                            <input className="form-control" type="text"
                                                name="social_name"
                                                value={patientData.social_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CPF<span className="text-danger">*</span></label>
                                            <input className="form-control" type="text" ref={withMask('999.999.999-99')} // CPF Mask
                                                name="cpf"
                                                value={patientData.cpf}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número do documento</label>
                                            <input className="form-control" type="text"
                                                name="document_number" // <-- Esse campo não está no seu state inicial
                                                value={patientData.document_number || ''}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Estado civil</label>
                                            <select id="marital_status" className="form-control"
                                                name="marital_status"
                                                value={patientData.marital_status}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecionar</option>
                                                <option value="solteiro">Solteiro(a)</option>
                                                <option value="casado">Casado(a)</option>
                                                <option value="viuvo">Viúvo(a)</option> {/* Corrigido o value */}
                                                <option value="separado">Separado(a)</option> {/* Corrigido o value */}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Data de Nascimento<span className="text-danger">*</span></label>
                                            <input type="date" className="form-control"
                                                name="birth_date"
                                                value={patientData.birth_date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome do pai</label>
                                            <input className="form-control" type="text"
                                                name="father_name"
                                                value={patientData.father_name}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão do pai</label>
                                            <input className="form-control" type="text"
                                                name="father_profession"
                                                value={patientData.father_profession}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CPF do responsável</label>
                                            <input className="form-control" type="text" ref={withMask('999.999.999-99')} // CPF Mask
                                                name="guardian_cpf"
                                                value={patientData.guardian_cpf}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Código legado</label>
                                            <input className="form-control" type="text"
                                                name="legacy_code"
                                                value={patientData.legacy_code}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group gender-select">
                                            <label className="gen-label">Sexo:<span className="text-danger">*</span></label>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sex" className="form-check-input"
                                                        value={"Masculino"}
                                                        checked={patientData.sex === "Masculino"}
                                                        onChange={handleChange}
                                                    /> Masculino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sex" className="form-check-input"
                                                        value={"Feminino"}
                                                        checked={patientData.sex === "Feminino"}
                                                        onChange={handleChange}
                                                    /> Feminino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sex" className="form-check-input"
                                                        value={"Outro"} // Corrigido o value
                                                        checked={patientData.sex === "Outro"}
                                                        onChange={handleChange}
                                                    /> Outro
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
                                            <input className="form-control" type="text" ref={withMask('(99) 99999-9999')}
                                                name="phone_mobile"
                                                value={patientData.phone_mobile}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 1</label>
                                            <input className="form-control" type="text" ref={withMask('(99) 9999-9999')} // Mask para Fixo
                                                name="phone1"
                                                value={patientData.phone1}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email<span className="text-danger">*</span></label>
                                            <input className="form-control" type="email"
                                                name="email"
                                                value={patientData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 2</label>
                                            <input className="form-control" type="text" ref={withMask('(99) 9999-9999')} // Mask para Fixo
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
                                            <input className="form-control" type="text" ref={withMask('99999-999')} // Mask CEP
                                                name="cep"
                                                value={patientData.cep}
                                                onChange={handleChange}
                                                onBlur={buscarCep} // Busca CEP ao perder o foco
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cidade<span className="text-danger">*</span></label>
                                            <input className="form-control" type="text"
                                                id="city"
                                                name="city"
                                                value={patientData.city}
                                                onChange={handleChange} // Permite edição manual
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Rua<span className="text-danger">*</span></label>
                                            <input className="form-control" type="text"
                                                id="street"
                                                name="street"
                                                value={patientData.street}
                                                onChange={handleChange} // Permite edição manual
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Complemento</label>
                                            <input className="form-control" type="text"
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
                                            <input className="form-control" type="text"
                                                id="state"
                                                name="state"
                                                value={patientData.state}
                                                onChange={handleChange} // Permite edição manual
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número<span className="text-danger">*</span></label>
                                            <input className="form-control" type="text"
                                                name="number"
                                                value={patientData.number}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bairro<span className="text-danger">*</span></label> {/* Bairro é obrigatório */}
                                            <input className="form-control" type="text"
                                                id="neighborhood"
                                                name="neighborhood"
                                                value={patientData.neighborhood}
                                                onChange={handleChange} // Permite edição manual
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Referencia </label>
                                            <input className="form-control" type="text"
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

                                {/* Status, Observação, Documentos */}
                                <div className="form-group">
                                    <label className="display-block" >Status<span className="text-danger">*</span></label>
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
                                    <textarea className="form-control" rows="3"
                                        name="observacao" // Corrigido 'observaçao'
                                        value={patientData.observacao || ''} // <-- Esse campo não está no seu state inicial
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                {/* Upload de Documentos - A lógica de upload/delete não está no handleSubmit */}
                                {/* Você precisará implementar o upload desses arquivos separadamente */}
                                <div className="form-group">
                                    <label>Documentos</label>
                                    {/* ... (Seu JSX de upload de documentos) ... */}
                                </div>

                                <div className="m-t-20 text-center">
                                    <button
                                        className="btn btn-primary submit-btn"
                                        type="submit"
                                    >Criar Paciente</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patientform;