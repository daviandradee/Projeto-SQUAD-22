import { useState } from "react";
import { useEffect } from "react";
import "../../assets/css/index.css";
import { withMask } from "use-mask-input";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getAccessToken } from "../../utils/auth.js";
const AvatarForm = "/img/AvatarForm.jpg";
const AnexoDocumento = "/img/AnexoDocumento.png";
import { useResponsive } from '../../utils/useResponsive.js';
import { getUserRole } from "../../utils/userInfo.js";


function PatientEdit() {
    //testando
    const role = getUserRole();
    const tokenUsuario = getAccessToken()
    const [patients, setpatients] = useState([""])
    const { id } = useParams()
    // carregando a lista e adicionando no usestate
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
                const paciente = result.find(p => p.id == id);
                setpatients(paciente || []);
                console.log(paciente)
            })
            .catch(error => console.log('error', error));
    }, [])

    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (patients.foto_url) {
            setPreview('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr6OBNqnFlVKC6fAk-mzSuzmOKgjWMYq9y0g&s');
        }
    }, [patients.foto_url]);

    const handleEdit = async (e) => {
            e.preventDefault()
            Swal.fire({
                title: "Você deseja salvar as alterações?",
                text: "As modificações serão salvas permanentemente.",
                icon: "question",
                showDenyButton: true,
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Salvar",
                denyButtonText: "Não salvar",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        var myHeaders = new Headers();
                        myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
                        myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
                        myHeaders.append("Content-Type", "application/json");
                        var raw = JSON.stringify(patients);
    
                        var requestOptions = {
                            method: "PATCH",
                            headers: myHeaders,
                            body: raw,
                            redirect: "follow",
                        };
    
                        const response = await fetch(
                            `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients?id=eq.${id}`,
                            requestOptions
                        );
    
                        if (response.ok) {
                            Swal.fire("Salvo!", "", "success").then(() => {
                                navigate(`/${role}/patientlist`);
                            })
                        } else {
                            Swal.fire("Error saving changes", "", "error");
                        }
                    } catch (error) {
                        Swal.fire("Something went wrong", "", "error");
                        console.error(error);
                    }
                } else if (result.isDenied) {
                    Swal.fire("As alterações não foram salvas", "", "info");
                }
            });
        }
    // aqui eu fiz uma funçao onde atualiza o estado do paciente, eu poderia ir mudando com o onchange em cada input mas assim ficou melhor
    // e como se fosse 'onChange={(e) => setpatientData({ ...patientData, rg: e.target.value })}'
    // prev= pega o valor anterio
    const handleChange = (e) => {
        const { name, value } = e.target;
        setpatients((prev) => ({
            ...prev,
            [name]: value
        }));
    };
        const buscarCep = (e) => {
        const cep = patients.cep.replace(/\D/g, '');
        console.log(cep);
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // salvando os valores para depois colocar nos inputs
                setValuesFromCep(data)
                // estou salvando os valoeres no patientData
                setpatients((prev) => ({
                    ...prev,
                    city: data.localidade || '',
                    street: data.logradouro || '',
                    neighborhood: data.bairro || '',
                    state: data.estado || ''
                }));
            })
    }
    // aqui esta sentando os valores nos inputs 
    const setValuesFromCep = (data) => {
        document.getElementById('street').value = data.logradouro || '';
        document.getElementById('neighborhood').value = data.bairro || '';
        document.getElementById('city').value = data.localidade || '';
        document.getElementById('state').value = data.uf || '';
    }
    // aqui eu fiz uma funçao onde atualiza o estado do paciente, eu poderia ir mudando com o onchange em cada input mas assim ficou melhor
    // e como se fosse 'onChange={(e) => setpatientData({ ...patientData, rg: e.target.value })}'
    // prev= pega o valor anterio
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
                //alert("Não foi possível validar o CPF.");
                return false;
            }
        } catch (error) {
            alert("Erro ao validar CPF.");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cpfValido = await validarCpf(patientData.cpf);

        // Calcula idade a partir da data de nascimento
        const hoje = new Date();
        const nascimento = new Date(patientData.data_nascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        let cpfRespValido = true;
        if (idade < 18) {
            cpfRespValido = await validarCpf(patientData.cpf_responsavel);
        }

        if (!cpfValido || !cpfRespValido) {
            console.log("CPF inválido. Não enviando o formulário.");
            // Não envia se algum CPF for inválido
            return;
        }
        // aqui estou fazendo o update

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
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Avatar</label>
                                            <div className="profile-upload">
                                                <div className="upload-img">
                                                    <img alt="" src={preview || AvatarForm} />
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-9">
                                                        <div className="upload-input">
                                                            <input
                                                                name="foto_url"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                                                }}
                                                                type="file"
                                                                accept="image/png, image/jpeg"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div
                                                            className="btn btn-primary"
                                                            onClick={async () => {
                                                                // Remove no Frontend
                                                                setpatients(prev => ({ ...prev, foto_url: "" }));
                                                                setPreview(null); // Limpa a pré-visualização
                                                                document.getElementsByName('foto_url')[0].value = null;

                                                                // Remove na API e mostra resposta no console
                                                                try {
                                                                    const response = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${id}/foto`, {
                                                                        method: "DELETE",
                                                                    });
                                                                    const data = await response.json();
                                                                    console.log("Resposta da API ao remover foto:", data);

                                                                    if (response.ok || response.status === 200) {
                                                                        alert("Foto removida com sucesso!");
                                                                    }
                                                                } catch (error) {
                                                                    console.log("Erro ao remover foto:", error);
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
                                                id="full_name"
                                                name="full_name"
                                                value={patients.full_name}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>RG</label>
                                            <input className="form-control" type="text"

                                                name="rg"
                                                value={patients.rg}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Outros documentos de identidade </label>
                                            <select id="outrosdoc" className="form-control"
                                                name="outros_documentos"
                                                value={patients.outros_documentos}
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
                                                value={patients.ethnicity}
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
                                                value={patients.profession}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome da mãe</label>
                                            <input className="form-control" type="text"
                                                name="mother_name"
                                                value={patients.mother_name}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão da mãe</label>
                                            <input className="form-control" type="text"
                                                name="mother_profession"
                                                value={patients.mother_profession}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome do responsável</label>
                                            <input className="form-control" type="text"
                                                name="guardian_name"
                                                value={patients.guardian_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-check-inline">
                                            <label className="form-check-label">
                                                <input type="checkbox" name="rn" className="form-check-input"
                                                    value={true}
                                                    checked={patients.rn === true}
                                                    onChange={(e) => setpatients({ ...patients, rn: e.target.checked })}
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
                                                value={patients.social_name}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CPF</label>
                                            <input className="form-control" type="text" ref={withMask('cpf')}
                                                name="cpf"
                                                value={patients.cpf}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número do documento</label>
                                            <input className="form-control" type="text"
                                                name="document_number"
                                                value={patients.document_number}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Estado civil</label>
                                            <select id="marital_status" className="form-control"
                                                name="marital_status"
                                                value={patients.marital_status}
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
                                            <label>Data de Nascimento</label>
                                            <input type="date" className="form-control"
                                                name="birth_date"
                                                value={patients.birth_date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome do pai</label>
                                            <input className="form-control" type="text"

                                                name="father_name"
                                                value={patients.father_name}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão do pai</label>
                                            <input className="form-control" type="text"
                                                name="father_profession"
                                                value={patients.father_profession}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CPF do responsável</label>
                                            <input className="form-control" type="text" ref={withMask('cpf')}
                                                name="guardian_cpf"
                                                value={patients.guardian_cpf}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Código legado</label>
                                            <input className="form-control" type="text"
                                                name="legacy_code"
                                                value={patients.legacy_code}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group gender-select">
                                            <label className="gen-label">Sexo:</label>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sex" className="form-check-input"
                                                        value={"Masculino"}
                                                        checked={patients.sex === "Masculino"}
                                                        onChange={handleChange}
                                                    /> Masculino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sex" className="form-check-input"
                                                        value={"Feminino"}
                                                        checked={patients.sex === "Feminino"}
                                                        onChange={handleChange}
                                                    /> Feminino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sex" className="form-check-input"
                                                        value={"outro"}
                                                        checked={patients.sex === "Outro"}
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
                                            <label>Celular</label>
                                            <input className="form-control" type="text" ref={withMask('+55 (99) 99999-9999')}
                                                name="phone_mobile"
                                                value={patients.phone_mobile}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 1</label>
                                            <input className="form-control" type="text" ref={withMask('+55 (99) 99999-9999')}
                                                name="phone1"
                                                value={patients.phone1}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input className="form-control" type="email"
                                                name="email"
                                                value={patients.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 2</label>
                                            <input className="form-control" type="text" ref={withMask('+55 (99) 99999-9999')}
                                                name="phone2"
                                                value={patients.phone2}
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
                                            <label>CEP</label>
                                            <input className="form-control" type="text"
                                                name="cep"
                                                value={patients.cep}
                                                onChange={handleChange}
                                                onBlur={buscarCep}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cidade</label>
                                            <input className="form-control" type="text"
                                                id="city"
                                                name="city"
                                                value={patients.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Logradouro</label>
                                            <input className="form-control" type="text"
                                                id="street"
                                                name="street"
                                                value={patients.street}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Complemento</label>
                                            <input className="form-control" type="text"
                                                id="complement"
                                                name="complement"
                                                value={patients.complement}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Estado</label>
                                            <input className="form-control" type="text"
                                                id="state"
                                                name="state"
                                                value={patients.state}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número</label>
                                            <input className="form-control" type="text"
                                                name="number"
                                                value={patients.number}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bairro</label>
                                            <input className="form-control" type="text"
                                                id="neighborhood"
                                                name="neighborhood"
                                                value={patients.neighborhood}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Referência </label>
                                            <input className="form-control" type="text"
                                                name="reference"
                                                value={patients.reference}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <hr />
                                </div>

                                <div className="form-group">
                                    <label className="display-block">Status</label>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="status"
                                            id="patient_active"
                                            value={"ativo"}
                                            checked={patients.status === "ativo"}
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
                                            checked={patients.status === "inativo"}
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
                                        value={patients.observaçao}
                                        onChange={handleChange}
                                    ></textarea>

                                </div>
                                <div className="form-group">
                                    <label>Documentos</label>
                                    <div className="profile-upload">
                                        <div className="upload-img">
                                            <img alt="" src={AnexoDocumento} />
                                        </div>
                                        <div className="upload-input">
                                            <input type="file" accept="image/png, image/jpeg" className="form-control" />
                                        </div>
                                    </div>
                                </div>



                                <div className="m-t-20 text-center">
                                    <Link to="/admin/patientlist"><button
                                        type="button"
                                        className="btn btn-primary submit-btn"
                                        onClick={handleEdit}
                                    >Editar Paciente</button></Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientEdit;
