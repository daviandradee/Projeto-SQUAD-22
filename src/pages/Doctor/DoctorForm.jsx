import "../../assets/css/index.css"
import { withMask } from "use-mask-input";

function DoctorForm() {
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
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Sobrenome</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CPF <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" ref={withMask('cpf')} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>CRM<span className="text-danger">*</span></label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Senha <span className="text-danger">*</span></label>
                      <input className="form-control" type="password" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input className="form-control" type="email" ref={withMask('email')}/>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Confirmar Senha</label>
                      <input className="form-control" type="password" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Data de Nascimento</label>
                      <div className="">
                        <input type="date" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Telefone </label>
                      <input className="form-control" type="text" ref={withMask('+99 (99)99999-9999')}  />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group gender-select">
                      <label className="gen-label">Sexo:</label>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="radio" name="sexo" className="form-check-input"/>Masculino
                        </label>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="radio" name="sexo" className="form-check-input"/>Feminino
                        </label>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="radio" name="sexo" className="form-check-input"/>Outro
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Endereço</label>
                          <input type="text" className="form-control "/>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>País</label>
                          <input type="text" className="form-control "/>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Cidade</label>
                          <input type="text" className="form-control"/>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Estado</label>
                          <input type="text" className="form-control"/>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>CEP</label>
                          <input type="text" className="form-control"/>
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
                        <img alt="" src=""/>
                      </div>
                      <div className="upload-input">
                        <input type="file" multiple accept="image/png, image/jpeg" className="form-control"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Foto</label>
                    <div className="profile-upload">
                      <div className="upload-img">
                        <img alt="" src=""/>
                      </div>
                      <div className="upload-input">
                        <input type="file" accept="image/png, image/jpeg" className="form-control"/>
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
                        value="option1"
                        defaultChecked
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
                        value="option2"
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
                    <button className="btn btn-primary submit-btn">
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
