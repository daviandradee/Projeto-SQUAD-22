import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/auth";
import "./../../assets/css/index.css"; 
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import DoctorCalendar from "../DoctorApp/DoctorCalendar";
import { useResponsive } from '../../utils/useResponsive';


function SecretariaDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [consulta, setConsulta] = useState([]);
  const [countPaciente, setCountPaciente] = useState(0);
  const [countMedico, setCountMedico] = useState(0);

  const tokenUsuario = getAccessToken();

  const [currentPage1, setCurrentPage1] = useState(1);
  const itemsPerPage1 = 8;
  const indexOfLastPatient = currentPage1 * itemsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage1;
  const currentPatients = Array.isArray(patients)
    ? patients.slice(indexOfFirstPatient, indexOfLastPatient)
    : [];
  const totalPages1 = Math.ceil(currentPatients.length / itemsPerPage1);

  const [currentPage2, setCurrentPage2] = useState(1);
  const itemsPerPage2 = 8;
  const indexOfLastDoctor = currentPage2 * itemsPerPage2;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage2;
  const currentDoctors = Array.isArray(doctors)
    ? doctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
    : [];
  const totalPages2 = Math.ceil(currentDoctors.length / itemsPerPage2);

  const [currentPage3, setCurrentPage3] = useState(1);
  const itemsPerPage3 = 8;
  const indexOfLastConsulta = currentPage3 * itemsPerPage3;
  const indexOfFirstConsulta = indexOfLastConsulta - itemsPerPage3;
  const currentConsulta = Array.isArray(consulta)
    ? consulta.slice(indexOfFirstConsulta, indexOfLastConsulta)
    : [];
  const totalPages3 = Math.ceil(currentConsulta.length / itemsPerPage3);

  const requestOptions = {
    method: "GET",
    headers: {
      apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
      Authorization: `Bearer ${tokenUsuario}`,
    },
    redirect: "follow",
  };

  useEffect(() => {
    fetch(
      "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients",
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setPatients(arr);
        setConsulta(arr); // assumindo consultas estão nos pacientes
        setCountPaciente(arr.length);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(
      "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors",
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setDoctors(arr);
        setCountMedico(arr.length);
      })
      .catch((err) => console.log(err));
  }, []);

  const events = [
    { title: "Consulta - Maria", date: "2025-10-10" },
    { title: "Laudo - João", date: "2025-10-12" },
    { title: "Atendimento - Ana", date: "2025-10-15" },
  ];

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: "#4dabf7",
    '&.Mui-selected': {
      color: "#3e7bf6ff",
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);

const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = ({ children, value, index }) => {
  return value === index ? <div>{children}</div> : null;
};

  return (
    <div className="sdc-content">
      {/* Widgets */}
      <div className="row">
        <div className="col-md-3">
          <div className="sdc-dash-widget">
            <span className="sdc-dash-widget-bg2">
              <i className="fa fa-user-o" />
            </span>
            <div className="sdc-dash-widget-info">
              <h3>{countPaciente}</h3>
              <span>Pacientes</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="sdc-dash-widget">
            <span className="sdc-dash-widget-bg1">
              <i className="fa fa-stethoscope" />
            </span>
            <div className="sdc-dash-widget-info">
              <h3>{countMedico}</h3>
              <span>Médicos</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="sdc-dash-widget">
            <span className="sdc-dash-widget-bg3">
              <i className="fa fa-user-md" />
            </span>
            <div className="sdc-dash-widget-info">
              <h3>{consulta.length}</h3>
              <span>Consultas</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="sdc-dash-widget">
            <span className="sdc-dash-widget-bg4">
              <i className="fa fa-heartbeat" />
            </span>
            <div className="sdc-dash-widget-info">
              <h3>80</h3>
              <span>Atendidos</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
  {/* Coluna do Calendário */}
  <div className="col-lg-7 col-md-12">
    <div
      className="calendar-container"
      style={{
        padding: 20,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      {DoctorCalendar()}
    </div>
  </div>

  {/* Coluna dos Pacientes */}
  <div className="col-lg-5 col-md-12">
    <Box sx={{ width: '100%', bgcolor: "white" , borderRadius: 2}}>
      <Tabs value={value} onChange={handleChange} centered>
        <StyledTab label="Pacientes" />
        <StyledTab label="Consultas" />
        <StyledTab label="Médicos" />
      </Tabs>
    </Box>
  <div className="card-block"
  style={{
    padding: "6px 8px",
    backgroundColor: "#fff",
    fontSize: "0.85rem",
    lineHeight: "1.1rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    height: "71vh",
    overflowY: "auto",
    overflowX: "hidden", 
    wordWrap: "break-word", 
    whiteSpace: "normal", 
  }}
  >
    <div className="table-responsive"
    style={{
        fontSize: "0.8rem",
      }}
    >

      {/* Aba Pacientes */}
      <TabPanel value={value} index={0}>
                <table className="table table-border table-striped custom-table datatable mb-0">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Telefone</th>
                      <th>Status</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatients.length > 0 ? (
                      currentPatients.map((p) => (
                        <tr key={p.id}>
                          <td>{p.full_name}</td>
                          <td>{p.phone_mobile}</td>
                          <td>Ativo</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          Nenhum paciente encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {/* Ir para a primeira página */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(1)}>
                  {"<<"} {/* ou "Início" */}
                </button>
              </li>

              {/* Botão de página anterior */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => currentPage1 > 1 && setCurrentPage1(currentPage1 - 1)}
                >
                  &lt;
                </button>
              </li>

              {/* Números de página */}

              <li className="page-item active">
                <span className="page-link">{currentPage1}</span>
              </li>
              {/* Botão de próxima página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage1 < totalPages1 && setCurrentPage1(currentPage1 + 1)
                  }
                >
                  &gt;
                </button>
              </li>


              {/* Ir para a última página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(totalPages1)}>
                  {">>"} {/* ou "Fim" */}
                </button>
              </li>
            </ul>
          </nav>
        </TabPanel>

        {/* Aba Consultas */}
      <TabPanel value={value} index={1}>
                <table className="table table-border table-striped custom-table datatable mb-0">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Data</th>
                      <th>Hora</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatients.length > 0 ? (
                      currentPatients.map((c) => (
                        <tr key={c.id}>
                          <td>{c.full_name}</td>
                          <td>{c.created_at}</td>
                          <td>10:00am - 11:00am</td>
                          <td>Ativo</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          Nenhuma consulta encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {/* Ir para a primeira página */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(1)}>
                  {"<<"} {/* ou "Início" */}
                </button>
              </li>

              {/* Botão de página anterior */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => currentPage1 > 1 && setCurrentPage1(currentPage1 - 1)}
                >
                  &lt;
                </button>
              </li>

              {/* Números de página */}

              <li className="page-item active">
                <span className="page-link">{currentPage1}</span>
              </li>
              {/* Botão de próxima página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage1 < totalPages1 && setCurrentPage1(currentPage1 + 1)
                  }
                >
                  &gt;
                </button>
              </li>


              {/* Ir para a última página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(totalPages1)}>
                  {">>"} {/* ou "Fim" */}
                </button>
              </li>
            </ul>
          </nav>
        </TabPanel>

        {/* Aba Prontuários */}
      <TabPanel value={value} index={2}>
                <table className="table table-border table-striped custom-table datatable mb-0">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Especialidade</th>
                      <th>Cidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => (
                        <tr key={doctor.id}>
                          <td>{doctor.full_name}</td>
                          <td>{doctor.specialty}</td>
                          <td>{doctor.city}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          Nenhum médico encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {/* Ir para a primeira página */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(1)}>
                  {"<<"} {/* ou "Início" */}
                </button>
              </li>

              {/* Botão de página anterior */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => currentPage1 > 1 && setCurrentPage1(currentPage1 - 1)}
                >
                  &lt;
                </button>
              </li>

              {/* Números de página */}

              <li className="page-item active">
                <span className="page-link">{currentPage1}</span>
              </li>
              {/* Botão de próxima página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage1 < totalPages1 && setCurrentPage1(currentPage1 + 1)
                  }
                >
                  &gt;
                </button>
              </li>


              {/* Ir para a última página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(totalPages1)}>
                  {">>"} {/* ou "Fim" */}
                </button>
              </li>
            </ul>
          </nav>
        </TabPanel>
  </div>

    </div>
  </div>
</div>
    </div>
  );
}

export default SecretariaDashboard;