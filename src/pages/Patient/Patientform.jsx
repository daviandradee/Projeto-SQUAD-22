import { useState } from "react";
import "../../assets/css/index.css"
import { withMask } from "use-mask-input";
import supabase from "../../Supabase"
function Patientform() {
    const [patientData, setpatientData] = useState({
        nome: null,
        nome_social: null,
        cpf: null,
        rg: null,
        outros_documentos: null,
        numero_documento: null,
        estado_civil: null,
        raça: null,
        data_nascimento: null,
        profissao: null,
        nome_pai: null,
        profissao_pai: null,
        nome_mae: null,
        profissao_mae: null,
        nome_responsavel:null,
        codigo_legado: null,  
        rn: "false",
        sexo: null,
        celular: null,
        email: null,
        telefone1: null,
        telefone2: null,
        cep: null,
        estado: null,
        logradouro: null,
        bairro: null,
        numero: null,
        complemento: null,
        referencia: null,
        status: "inativo",
        observaçao: null
    })
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(patientData);

        const{data, error} = await supabase
        .from("Patient")
        .insert([patientData])
        .select()
        if(error){
            console.log("Erro ao inserir paciente:", error);
        }else{
            console.log("Paciente inserido com sucesso:", data);
        }
        e.target.reset(patientData)
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
                                                    <img alt="" src="assets/img/user.jpg" />
                                                </div>
                                                <div className="upload-input">
                                                    <input type="file" accept="image/png, image/jpeg" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Nome completo<span className="text-danger">*</span>
                                            </label>
                                            <input className="form-control" type="text" 
                                                required
                                                name="nome"
                                                value={patientData.nome}
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
                                                name="raça"
                                                id="raça"
                                                className="form-control"
                                                value={patientData.raça}
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
                                                name="profissao"
                                                value={patientData.profissao}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome da mãe</label>
                                            <input className="form-control" type="text"
                                                name="nome_mae"
                                                value={patientData.nome_mae}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão da mãe</label>
                                            <input className="form-control" type="text"
                                                name="profissao_mae"
                                                value={patientData.profissao_mae}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome do responsável</label>
                                            <input className="form-control" type="text"
                                                name="nome_responsavel"
                                                value={patientData.nome_responsavel}
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
                                                name="nome_social"
                                                value={patientData.nome_social}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CPF</label>
                                            <input className="form-control" type="text" ref={withMask('cpf')}
                                                name="cpf"
                                                value={patientData.cpf}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número do documento</label>
                                            <input className="form-control" type="text"
                                                name="numero_documento"
                                                value={patientData.numero_documento}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Estado civil</label>
                                            <select id="civil" className="form-control"
                                                name="estado_civil"
                                                value={patientData.estado_civil}
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
                                                name="data_nascimento"
                                                value={patientData.data_nascimento}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome do pai</label>
                                            <input className="form-control" type="text"
                                                name="nome_pai"
                                                value={patientData.nome_pai}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão do pai</label>
                                            <input className="form-control" type="text"
                                                name="profissao_pai"
                                                value={patientData.profissao_pai}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CPF do responsável</label>
                                            <input className="form-control" type="text" ref={withMask('cpf')}
                                                name="cpf_responsavel"
                                                value={patientData.cpf_responsavel}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Código legado</label>
                                            <input className="form-control" type="text"
                                                name="codigo_legado"
                                                value={patientData.codigo_legado}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group gender-select">
                                            <label className="gen-label">Sexo:</label>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sexo" className="form-check-input"
                                                        value={"masculino"}
                                                        checked={patientData.sexo === "masculino"}
                                                        onChange={handleChange}
                                                    /> Masculino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sexo" className="form-check-input"
                                                        value={"feminino"}
                                                        checked={patientData.sexo === "feminino"}
                                                        onChange={handleChange}
                                                    /> Feminino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sexo" className="form-check-input"
                                                        value={"outro"}
                                                        checked={patientData.sexo === "outro"}
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
                                                name="celular"
                                                value={patientData.celular}
                                                onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 1</label>
                                            <input className="form-control" type="text" ref={withMask('+55 (99) 99999-9999')}
                                                name="telefone1"
                                                value={patientData.telefone1}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input className="form-control" type="email" 
                                                name="email"
                                                value={patientData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Telefone 2</label>
                                            <input className="form-control" type="text" ref={withMask('+55 (99) 99999-9999')}
                                                name="telefone2"
                                                value={patientData.telefone2}
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
                                                value={patientData.cep}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cidade</label>
                                            <input className="form-control" type="text"
                                                name="cidade"
                                                value={patientData.cidade}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Logradouro</label>
                                            <input className="form-control" type="text"
                                                name="logradouro"
                                                value={patientData.logradouro}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Complemento</label>
                                            <input className="form-control" type="text"
                                                name="complemento"
                                                value={patientData.complemento}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Estado</label>
                                            <input className="form-control" type="text" 
                                                name="estado"
                                                value={patientData.estado}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número</label>
                                            <input className="form-control" type="text"
                                                name="numero"
                                                value={patientData.numero}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bairro</label>
                                            <input className="form-control" type="text"
                                                name="bairro"
                                                value={patientData.bairro}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Referência </label>
                                            <input className="form-control" type="text"
                                                name="referencia"
                                                value={patientData.referencia}
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
                                            <img alt="" src="assets/img/user.jpg" />
                                        </div>
                                        <div className="upload-input">
                                            <input type="file" accept="image/png, image/jpeg" className="form-control" />
                                        </div>
                                    </div>
                                </div>



                                <div className="m-t-20 text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary submit-btn"
                                        
                                        
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
