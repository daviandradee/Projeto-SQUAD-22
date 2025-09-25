import "../../assets/css/index.css"

function AddSchedule() {
  return (
    <div className="main-wrapper">


      {/* Conteúdo da página */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <h4 className="page-title">Adicionar Agenda</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Nome</label>
                      <select className="select form-control">
                        <option>Selecionar</option>
                        <option>Doctor Name 1</option>
                        <option>Doctor Name 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Dias disponíveis</label>
                      <select className="form-control">
                        <option>Selecione</option>
                        <option>Segunda-feira</option>
                        <option>Terça-feira</option>
                        <option>Quarta-feira</option>
                        <option>Quinta-feira</option>
                        <option>Sexta-feira</option>
                        <option>Sábado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Hora</label>
                      <input
                        type="time"
                        className="form-control"
                        id="datetimepicker3"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Fim</label>
                      <input
                        type="time"
                        className="form-control"
                        id="datetime"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mensagem</label>
                  <textarea
                    cols="30"
                    rows="4"
                    className="form-control"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="display-block">Status</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="product_active"
                      value="option1"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="product_active">
                      Ativo
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="product_inactive"
                      value="option2"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="product_inactive"
                    >
                      Inativo
                    </label>
                  </div>
                </div>

                <div className="m-t-20 text-center">
                  <button className="btn btn-primary submit-btn">
                    Criar agenda
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-overlay" data-reff=""></div>
    </div>
  );
};

export default AddSchedule;
