import { useState, useEffect, useRef } from "react";
import "../../../assets/css/index.css"
import { withMask } from "use-mask-input";
import supabase from "../../../Supabase";
import { redirect, useNavigate } from "react-router-dom";
import { getAccessToken } from "../../../utils/auth";
import AvatarForm from "../../../../public/img/AvatarForm.jpg"
import AnexoDocumento from "../../../../public/img/AnexoDocumento.png"
import Swal from "sweetalert2";
import { useResponsive } from '../../../utils/useResponsive';
function Patientform() {
    const tokenUsuario = getAccessToken()
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
    })
    const [previewUrl, setPreviewUrl] = useState(AvatarForm);
    const [fotoFile, setFotoFile] = useState(null);
    const fileRef = useRef(null);

    useEffect(() => {
        console.log("Estado atualizado:", patientData);
    }, [patientData]);

    // aqui eu fiz uma funçao onde atualiza o estado do paciente, eu poderia ir mudando com o onchange em cada input mas assim ficou melhor
    // e como se fosse 'onChange={(e) => setpatientData({ ...patientData, rg: e.target.value })}'
    // prev= pega o valor anterior
    const handleChange = (e) => {
        const { name, value } = e.target;
        setpatientData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const estados = {
        AC: "Acre",
        AL: "Alagoas",
        AP: "Amapá",
        AM: "Amazonas",
        BA: "Bahia",
        CE: "Ceará",
        DF: "Distrito Federal",
        ES: "Espírito Santo",
        GO: "Goiás",
        MA: "Maranhão",
        MT: "Mato Grosso",
        MS: "Mato Grosso do Sul",
        MG: "Minas Gerais",
        PA: "Pará",
        PB: "Paraíba",
        PR: "Paraná",
        PE: "Pernambuco",
        PI: "Piauí",
        RJ: "Rio de Janeiro",
        RN: "Rio Grande do Norte",
        RS: "Rio Grande do Sul",
        RO: "Rondônia",
        RR: "Roraima",
        SC: "Santa Catarina",
        SP: "São Paulo",
        SE: "Sergipe",
        TO: "Tocantins"
    };
    // aqui esta sentando os valores nos inputs 
    const setValuesFromCep = (data) => {
        document.getElementById('street').value = data.street || '';
        document.getElementById('neighborhood').value = data.neighborhood || '';
        document.getElementById('city').value = data.city || '';
        document.getElementById('state').value = data.state || '';
    }
    const buscarCep = (e) => {
        const cep = patientData.cep.replace(/\D/g, '');
        console.log(cep);
        fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // salvando os valores para depois colocar nos inputs
                setValuesFromCep(data)
                // estou salvando os valoeres no patientData
                setpatientData((prev) => ({
                    ...prev,
                    city: data.city || '',
                    street: data.street || '',
                    neighborhood: data.neighborhood || '',
                    state: estados[data.state] || data.state
                }));
            })
    }

    const navigate = useNavigate();
    // enviando para o supabase
    const handleSubmit = async (e) => {
        e.preventDefault();

        // === 1️⃣ VALIDA CAMPOS OBRIGATÓRIOS ===
        const requiredFields = [
            "full_name",
            "cpf",
            "birth_date",
            "sex",
            "phone_mobile",
            "cep",
            "street",
            "number",
            "neighborhood",
            "state",
            "email"
        ];

        const missingFields = requiredFields.filter(
            (field) => !patientData[field] || patientData[field].toString().trim() === ""
        );

        if (missingFields.length > 0) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            // === 2️⃣ CRIA PACIENTE ===
            const myHeaders = new Headers();
            myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
            myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify(patientData);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            const response = await fetch(
                "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients",
                requestOptions
            );

            if (!response.ok) {
                throw new Error("Erro ao cadastrar paciente");
            }

            const text = await response.text();
            console.log("✅ Paciente criado:", text || "Sem conteúdo (provável sucesso)");


            // === 3️⃣ CRIA USUÁRIO APÓS PACIENTE ===
            const myHeadersUser = new Headers();
            myHeadersUser.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
            myHeadersUser.append("Authorization", `Bearer ${tokenUsuario}`);
            myHeadersUser.append("Content-Type", "application/json");

            const rawUser = JSON.stringify({
                email: patientData.email,
                password: patientData.password, // <- certifique-se que patientData tem esse campo
                full_name: patientData.full_name,
                phone: patientData.phone_mobile,
                role: "secretaria",
                redirect_url: "https://mediconnect-neon.vercel.app/"
            });

            const requestOptionsUser = {
                method: "POST",
                headers: myHeadersUser,
                body: rawUser,
                redirect: "follow"
            };

            const resUser = await fetch(
                `https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/create-user`,
                requestOptionsUser
            );

            if (!resUser.ok) {
                throw new Error("Erro ao criar usuário no Supabase");
            }

            const usuarioCriado = await resUser.text();
            console.log("👤 Usuário criado:", usuarioCriado);

            // === 4️⃣ ALERTA DE SUCESSO ===
            Swal.fire({
                title: "Paciente e usuário criados com sucesso!",
                icon: "success",
                draggable: true
            });

            navigate("/admin/patientlist");
            console.log(patientData);

        } catch (error) {
            console.error("❌ Erro:", error);
            Swal.fire({
                title: "Erro ao cadastrar",
                text: error.message,
                icon: "error"
            });
        }
    };


    const validarCpf = async (cpf) => {
        const cpfLimpo = cpf.replace(/\D/g, "");
        try {
            const response = await fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes/validar-cpf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cpf: cpfLimpo })
            });
            const data = await response.json();
            if (data.valido === false) {
                alert("CPF inválido!");
                return false;
            } else if (data.valido === true) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            alert("Erro ao validar CPF.");
            return false;
        }
    };


    const verificarCpfExistente = async (cpf) => {
        const cpfLimpo = cpf.replace(/\D/g, "");
        try {
            const response = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes?cpf=${cpfLimpo}`);
            const data = await response.json();
            // Ajuste conforme o formato de resposta da sua API
            if (data && data.data && data.data.length > 0) {
                return true; // Já existe paciente com esse CPF
            }
            return false;
        } catch (error) {
            console.log("Erro ao verificar CPF existente.");
            return false;
        }
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
                                                                onChange={handleFileChange}>
                                                            </input>
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

                                                                // Remove no backend e mostra resposta no console
                                                                if (patientData.id) {
                                                                    try {
                                                                        const response = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientData.id}/foto`, {
                                                                            method: "DELETE",
                                                                        });
                                                                        const data = await response.json();
                                                                        console.log("Resposta da API ao remover foto:", data);
                                                                        if (response.ok || response.status === 200) {
                                                                            console.log("Foto removida com sucesso na API.");
                                                                        }
                                                                    } catch (error) {
                                                                        console.log("Erro ao remover foto:", error);
                                                                    }
                                                                } else {
                                                                    console.log("Ainda não existe paciente cadastrado para remover foto na API.");
                                                                }
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
                                                name="rg"
                                                value={patientData.rg}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Outros documentos de identidade </label>
                                            <select id="outrosdoc" className="form-control"
                                                name="outros_documentos"
                                                value={patientData.outros_documentos}
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
                                                <option value="casa">Preta</option>
                                                <option value="branca">Branca</option>
                                                <option value="parda">Parda</option>
                                                <option value="amarela">Amarela</option>
                                                <option value="Indigena">Indígena</option>
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
                                                    checked={patientData.rn === true}
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
                                            <label>CPF</label><span className="text-danger">*</span>
                                            <input className="form-control" type="text" ref={withMask('cpf')}
                                                name="cpf"
                                                value={patientData.cpf}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número do documento</label>
                                            <input className="form-control" type="text"
                                                name="document_number"
                                                value={patientData.document_number}
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
                                                <option value="viúvo">Viúvo(a)</option>
                                                <option value="amarela">Separado(a)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Data de Nascimento</label><span className="text-danger">*</span>
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
                                            <input className="form-control" type="text" ref={withMask('cpf')}
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
                                                        value={"outro"}
                                                        checked={patientData.sex === "outro"}
                                                        onChange={handleChange}
                                                    /> Outro
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <hr />
                                        <h2>Contato</h2>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Celular</label><span className="text-danger">*</span>
                                            <input className="form-control" type="text" ref={withMask('(99) 99999-9999')}
                                                name="phone_mobile"
                                                value={patientData.phone_mobile}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 1</label>
                                            <input className="form-control" type="text" ref={withMask('+55 (99) 99999-9999')}
                                                name="phone1"
                                                value={patientData.phone1}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email</label><span className="text-danger">*</span>
                                            <input className="form-control" type="email"
                                                name="email"
                                                value={patientData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 2</label>
                                            <input className="form-control" type="text" ref={withMask('+55 (99) 99999-9999')}
                                                name="phone2"
                                                value={patientData.phone2}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-12">
                                        <hr />
                                        <h2>Endereço</h2>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>CEP</label><span className="text-danger">*</span>
                                            <input className="form-control" type="text"
                                                name="cep"
                                                value={patientData.cep}
                                                onChange={handleChange}
                                                onBlur={buscarCep}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cidade</label><span className="text-danger">*</span>
                                            <input className="form-control" type="text"
                                                id="city"
                                                name="city"
                                                value={patientData.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Rua<span className="text-danger">*</span></label>
                                            <input className="form-control" type="text"
                                                id="street"
                                                name="street"
                                                value={patientData.street}
                                                onChange={handleChange}
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
                                                onChange={handleChange}
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
                                            <label>Bairro</label>
                                            <input className="form-control" type="text"
                                                id="neighborhood"
                                                name="neighborhood"
                                                value={patientData.neighborhood}
                                                onChange={handleChange}
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
                                        name="observaçao"
                                        value={patientData.observaçao}
                                        onChange={handleChange}
                                    ></textarea>

                                </div>
                                <div className="form-group">
                                    <label>Documentos</label>
                                    <div className="profile-upload">
                                        <div className="upload-img">
                                            <img alt="" src={AnexoDocumento} />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-9">
                                                <div className="upload-input">
                                                    <input
                                                        type="file"
                                                        accept="image/png, image/jpeg, application/pdf"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setpatientData((prev) => ({ ...prev, documentoFile: file }));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                {patientData.anexos?.length > 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={async () => {
                                                            // Remove o primeiro anexo (ou adapte para remover específico)
                                                            const anexoId = patientData.anexos[0].id;
                                                            try {
                                                                const myHeaders = new Headers();
                                                                myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
                                                                myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
                                                                myHeaders.append("Content-Type", "application/json");

                                                                var requestOptions = {
                                                                    method: 'DELETE',
                                                                    headers: myHeaders,
                                                                    redirect: 'follow'
                                                                };
                                                                await fetch(
                                                                    `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients?${patientData.id}`, requestOptions

                                                                );
                                                                setpatientData((prev) => ({
                                                                    ...prev,
                                                                    anexos: prev.anexos.filter((a) => a.id !== anexoId)
                                                                }));
                                                                alert("Anexo removido com sucesso!");
                                                            } catch (err) {
                                                                console.error("Erro ao remover anexo:", err);
                                                            }
                                                        }}
                                                    >
                                                        Remover
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Lista anexos */}
                                        {patientData.anexos?.length > 0 &&
                                            patientData.anexos.map((anexo) => (
                                                <div key={anexo.id} className="mt-2">
                                                    <a href={anexo.url} target="_blank" rel="noreferrer">
                                                        {anexo.nome || "Documento"}
                                                    </a>
                                                </div>
                                            ))}
                                    </div>
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