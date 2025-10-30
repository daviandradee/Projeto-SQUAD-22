export default function FinanceiroDashboard(){

    return(
        <div className="content">
      <h1>Bem vindo, Lucas</h1>
        <div className="row">
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg1"><i className="fa fa-stethoscope" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>3</h3>
              <span className="widget-title1">Exames <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg2"><i className="fa fa-user-md" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>1</h3>
              <span className="widget-title2">Consulta <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        </div>
        </div>
    )
}