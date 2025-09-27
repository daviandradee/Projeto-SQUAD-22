import React from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/auth";
function DoctorDashboard() {
  const [patients, setPatients] =useState([]);
  const [count, setCount] = useState(0);
  const tokenUsuario = getAccessToken()

  var myHeaders = new Headers();
  myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  useEffect(() => {
    fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients`, requestOptions)
      .then(response => response.json())
      .then(result => setPatients(Array.isArray(result) ? result : []))
      .catch(error => console.log('error', error));
  // ✅ só roda quando 'patients' mudar
  }, [])
useEffect(() => {
  setCount(patients.length);
}, [patients]);

  


  return (
  

    <div className="content">
      <h1>Bem vindo, Dr.Davi</h1>
      <div className="row">
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg2"><i className="fa fa-user-o"></i></span>
            <div className="dash-widget-info text-right">
              <h3>{count}</h3>
              <span className="widget-title2">Patients <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="dash-widget">
            <span className="dash-widget-bg1"><i className="fa fa-stethoscope" aria-hidden="true"></i></span>
            <div className="dash-widget-info text-right">
              <h3>{count}</h3>
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
              <h3>{count}</h3>
              <span className="widget-title4">Pendentes <i className="" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div className="col-24 col-md-12 col-lg-12 col-xl-12">
						<Link to="/doctor/consultas"><div className="card">
							<div className="card-header">
								<h4 className="text-left">Laudo</h4> <Link className="btn btn-primary float-right" to="/doctor/laudolist">Ver todos</Link>
							</div>
							<div className="card-block">
								<div className="table-responsive">
									<table className="table table-border table-striped custom-table mb-0">
                    <thead>
                    <tr >
                      <th>Pedido</th>
                      <th>Data</th>
                      <th>Prazo</th>
                      <th>Paciente</th>
                      <th>CPF</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th>Executante</th>
                      <th>Exame</th>
                      <th className="text-center">Ação</th>
                    </tr>
                  </thead>
										<tbody>
                      {patients.length > 0 ? (
                    patients.map((p) => (
											<tr key={p.id}>
												<td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.created_at}</h2>
												</td>
                        <td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.birth_date}</h2>
												</td>
                        <td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.full_name}</h2>
												</td>
                        <td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.nome}</h2>
												</td>
                        <td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.cpf}</h2>
												</td>
                        <td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.nome}</h2>
												</td>
                        <td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.nome}</h2>
												</td>
                        <td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.nome}</h2>
												</td>
									
												<td>Cardiovascular</td>
												<td className="text-center">
                      <Link className="btn btn-outline-primary take-btn">Detalhes</Link> 
                    </td>
											</tr>
                      ))
                  ) : (
                    <tr>
                    <td colSpan="4">Nenhum paciente encontrado.</td>
                    </tr>
                  )}
										</tbody>
									</table>
								</div>
							</div>
						</div></Link>
					</div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
						<Link to="/doctor/consultas"><div className="card">
							<div className="card-header">
								<h4 className="text-left">Consultas</h4> <Link className="btn btn-primary float-right" to="/doctor/consultas">Ver todos</Link>
							</div>
							<div className="card-block">
								<div className="table-responsive">
									<table className="table table-border table-striped custom-table mb-0">
                    <thead>
                    <tr >
                      <th>Nome</th>
                      <th>Horário</th>
                      <th className="text-center">Ação</th>
                    </tr>
                  </thead>
										<tbody>
                      {patients.length > 0 ? (
                    patients.map((p) => (
											<tr key={p.id}>
												<td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.full_name}</h2>
												</td>
									
												<td>{p.created_at}</td>
												<td className="text-center">
                      <Link className="btn btn-outline-primary take-btn">Detalhes</Link> 
                    </td>
											</tr>
                      ))
                  ) : (
                    <tr>
                    <td colSpan="4">Nenhum paciente encontrado.</td>
                    </tr>
                  )}
										</tbody>
									</table>
								</div>
							</div>
						</div></Link>
					</div>
      {/* eh os pacientes*/}
      <div className="col-12 col-md-6 col-lg-6 col-xl-6">
						<Link to="/doctor/patients"><div className="card">
							<div className="card-header">
								<h4 className="text-left">Pacientes</h4> <Link className="btn btn-primary float-right" to="/doctor/patients">Ver todos</Link>
							</div>
							<div className="card-block">
								<div className="table-responsive">
									<table className="table table-border table-striped custom-table mb-0">
                    <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Contato</th>
                      <th className="text-center">Ação</th>
                    </tr>
                  </thead>
										<tbody>
                      {patients.length > 0 ? (
                    patients.map((p) => (
											<tr key={p.id}>
												<td>
													<img  className="rounded-circle" src="assets/img/user.jpg" alt=""/> 
													<h2>{p.full_name}</h2>
												</td>
												<td>{p.email}</td>
												<td>{p.telefone}</td>
												<td className="text-center">
                      <Link className="btn btn-outline-primary take-btn" >
                        Detalhes
                      </Link>
                    </td>
											</tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="4">Nenhum paciente encontrado.</td>
                    </tr>
                  )}
										</tbody>
									</table>
								</div>
							</div>
						</div></Link>
					</div>
    </div>
    </div>
  );
}

export default DoctorDashboard;