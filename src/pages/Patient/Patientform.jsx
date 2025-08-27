import "../../assets/css/index.css"
import { withMask } from "use-mask-input";
function Patientform() {

    return (
        <div className="main-wrapper">
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <h4 className="page-title">Adicionar Paciente</h4>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>
                                                Nome completo<span className="text-danger">*</span>
                                            </label>
                                            <input className="form-control" type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label>RG</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label>Outros documentos de identidade </label>
                                            <select name="outrosdoc" id="outrosdoc" className="form-control">
                                                <option value="">Selecionar</option>
                                                <option value="cnh">CNH</option>
                                                <option value="branca">Passaporte</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Raça</label>
                                            <select name="raça" id="raça" className="form-control">
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
                                            <input className="form-control" type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label>Nome da mãe</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão da mãe</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Nome social</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label>CPF</label>
                                            <input className="form-control" type="text" ref={withMask('cpf')} />
                                        </div>
                                        <div className="form-group">
                                            <label>Número do documento</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label>Estado civil</label>
                                            <select name="estado civil" id="civil" className="form-control">
                                                <option value="">Selecionar</option>
                                                <option value="solteiro">Solteiro(a)</option>
                                                <option value="casado">Casado(a)</option>
                                                <option value="viúvo">Viúvo(a)</option>
                                                <option value="amarela">Separado(a)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Nome do pai</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label>Profissão do pai</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email <span className="text-danger">*</span></label>
                                            <input className="form-control" type="email" ref={withMask('email')} />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Senha</label>
                                            <input className="form-control" type="password" />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Confirmar senha</label>
                                            <input className="form-control" type="password" />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Data de Nascimento</label>
                                            <input type="date" className="form-control" />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group gender-select">
                                            <label className="gen-label">Sexo:</label>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sexo" className="form-check-input" /> Masculino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sexo" className="form-check-input" /> Feminino
                                                </label>
                                            </div>
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input type="radio" name="sexo" className="form-check-input" /> Outro
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Endereço</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Telefone</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>

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
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="display-block">Status</label>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="status"
                                            id="patient_active"
                                            value="option1"
                                            defaultChecked
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
                                            value="option2"
                                        />
                                        <label className="form-check-label" htmlFor="patient_inactive">
                                            Inativo
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Observação</label>
                                    <textarea className="form-control" rows="3"></textarea>
                                </div>

                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" name="rn" className="form-check-input" /> RN na Guia do convênio
                                    </label>
                                </div>

                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary submit-btn">Criar Paciente</button>
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
