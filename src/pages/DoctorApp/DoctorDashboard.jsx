import React from "react";
import { Link } from "react-router-dom";
function DoctorDashboard() {
  return (

    <div className="content">
      <h1>Bem vindo, Dr.Davi</h1>
      <div className="row">
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg2"><i className="fa fa-user-o"></i></span>
            <div className="dash-widget-info text-right">
              <h3>1072</h3>
              <span className="widget-title2">Patients <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg1"><i className="fa fa-stethoscope" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>98</h3>
              <span className="widget-title1">Consultas <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg3"><i className="fa fa-user-md" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>72</h3>
              <span className="widget-title3">Atendidos <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg4"><i className="fa fa-heartbeat" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>618</h3>
              <span className="widget-title4">Pendentes <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>

      {/* eh a tabela de consulta do medico*/} 
      <div className="col-12 col-md-6 col-lg-6 col-xl-6">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title d-inline-block">Proximas consultas</h4> <Link to="/doctor/consultas"><a href="appointments.html" className="btn btn-primary float-right">Ver todas</a></Link>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-border table-striped custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Horário</th>
                      <th className="text-center">Ação</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr>
                    <td >
                      <a className="avatar" href="profile.html">B</a>
                      <h2><a href="profile.html">Bernardo Galaviz <span>New York, USA</span></a></h2>
                    </td>
                   
                    <td>

                      <p>6:30 PM</p>
                    </td>
                    <td className="text-center">
                      <a href="appointments.html" className="btn btn-outline-primary take-btn">Detalhes</a>
                    </td>
                  </tr>
                  <tr>
                    <td >
                      <a className="avatar" href="profile.html">B</a>
                      <h2><a href="profile.html">Bernardo Galaviz <span>New York, USA</span></a></h2>
                    </td>
                    
                    <td>
                      <p>7:00 PM</p>
                    </td>
                    <td className="text-center">
                      <a href="appointments.html" className="btn btn-outline-primary take-btn">Detalhes</a>
                    </td>
                  </tr>
                  <tr>
                    <td >
                      <a className="avatar" href="profile.html">B</a>
                      <h2><a href="profile.html">Bernardo Galaviz <span>New York, USA</span></a></h2>
                    </td>
                    
                    <td>

                      <p>8:00 PM</p>
                    </td>
                    <td className="text-center">
                      <a href="appointments.html" className="btn btn-outline-primary take-btn">Detalhes</a>
                    </td>
                  </tr>
                  <tr>
                    <td >
                      <a className="avatar" href="profile.html">B</a>
                      <h2><a href="profile.html">Bernardo Galaviz <span>New York, USA</span></a></h2>
                    </td>
                   
                    <td>

                      <p>9:00 PM</p>
                    </td>
                    <td className="text-center">
                      <a href="appointments.html" className="btn btn-outline-primary take-btn">Detalhes</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* eh os pacientes*/}
      <div class="col-12 col-md-6 col-lg-6 col-xl-6">
						<div class="card">
							<div class="card-header">
								<h4 class="card-title d-inline-block">Pacientes</h4> <Link to="/doctor/patients"><a href="patients.html" class="btn btn-primary float-right">Ver todos</a></Link>
							</div>
							<div class="card-block">
								<div class="table-responsive">
									<table class="table table-border table-striped custom-table mb-0">
                    <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Contato</th>
                      <th className="text-center">Ação</th>
                    </tr>
                  </thead>
										<tbody>
											<tr>
												<td>
													<img  class="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>John Doe</h2>
												</td>
												<td>Johndoe21@gmail.com</td>
												<td>+1-202-555-0125</td>
												<td className="text-center">
                      <a href="appointments.html" className="btn btn-outline-primary take-btn">Detalhes</a>
                    </td>
											</tr>
											<tr>
												<td>
													<img  class="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>Richard</h2>
												</td>
												<td>Richard123@yahoo.com</td>
												<td>202-555-0127</td>
												<td className="text-center">
                      <a href="appointments.html" className="btn btn-outline-primary take-btn">Detalhes</a>
                    </td>
											</tr>
											<tr>
												<td>
													<img  class="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>Villiam</h2>
												</td>
												<td>Richard123@yahoo.com</td>
												<td>+1-202-555-0106</td>
												<td className="text-center">
                      <a href="appointments.html" className="btn btn-outline-primary take-btn">Detalhes</a>
                    </td>
											</tr>
											<tr>
												<td>
													<img  class="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>Martin</h2>
												</td>
												<td>Richard123@yahoo.com</td>
												<td>776-2323 89562015</td>
												<td className="text-center">
                      <a href="appointments.html" className="btn btn-outline-primary take-btn">Detalhes</a>
                    </td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
    </div>
  </div>
  );
}

export default DoctorDashboard;