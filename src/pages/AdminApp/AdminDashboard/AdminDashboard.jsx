import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../../utils/auth";
import "../../../assets/css/index.css"; 

function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [consulta, setConsulta] = useState([]);
  const [countPaciente, setCountPaciente] = useState(0);
  const [countMedico, setCountMedico] = useState(0);

  const tokenUsuario = getAccessToken();

  const [currentPage1, setCurrentPage1] = useState(1);
  const itemsPerPage1 = 4;
  const indexOfLastPatient = currentPage1 * itemsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage1;
  const currentPatients = Array.isArray(patients)
    ? patients.slice(indexOfFirstPatient, indexOfLastPatient)
    : [];
  const totalPages1 = Math.ceil(currentPatients.length / itemsPerPage1);

  const [currentPage2, setCurrentPage2] = useState(1);
  const itemsPerPage2 = 4;
  const indexOfLastDoctor = currentPage2 * itemsPerPage2;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage2;
  const currentDoctors = Array.isArray(doctors)
    ? doctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
    : [];
  const totalPages2 = Math.ceil(currentDoctors.length / itemsPerPage2);

  const [currentPage3, setCurrentPage3] = useState(1);
  const itemsPerPage3 = 5;
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

  return (
 <div className="main-wrapper">
  <div className="page-wrapper">
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

      {/* Gráfico de pizza */}
      <div className="sdc-pie-chart-wrapper">
        <div className="sdc-pie-chart-label">
          {countPaciente} Pacientes<br />
          {countMedico} Médicos
        </div>
      </div>

      {/* Gráfico de colunas */}
      <div className="sdc-bar-chart-wrapper">
        <div className="sdc-bar" style={{ height: "120px" }}>
          <span>{countMedico}</span>
        </div>
        <div className="sdc-bar sdc-bar-red" style={{ height: "150px" }}>
          <span>80</span>
        </div>
        <div className="sdc-bar sdc-bar-orange" style={{ height: "100px" }}>
          <span>{countPaciente}</span>
        </div>
        <div className="sdc-bar sdc-bar-green" style={{ height: "180px" }}>
          <span>{countPaciente}</span>
        </div>
      </div>

      {/* Cards Médicos */}
      <div className="row">
        <div className="col-md-6">
          <div className="sdc-card">
            <div className="sdc-card-header">
              <h4>Médicos</h4>
              <Link
                className="sdc-btn sdc-btn-primary float-right"
                to="/secretaria/medicoslista"
              >
                Ver todos
              </Link>
            </div>
            <div>
              {currentDoctors.map((d) => (
                <div
                  key={d.id}
                  className="sdc-card"
                  style={{ marginBottom: "10px" }}
                >
                  <strong>{d.full_name}</strong>
                  <br />
                  {d.email}
                  <br />
                  {d.phone_mobile}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Pacientes */}
        <div className="col-md-6">
          <div className="sdc-card">
            <div className="sdc-card-header">
              <h4>Pacientes</h4>
              <Link
                className="sdc-btn sdc-btn-primary float-right"
                to="/secretaria/pacientelista"
              >
                Ver todos
              </Link>
            </div>
            <div>
              {currentPatients.map((p) => (
                <div
                  key={p.id}
                  className="sdc-card"
                  style={{ marginBottom: "10px" }}
                >
                  <strong>{p.full_name}</strong>
                  <br />
                  {p.email}
                  <br />
                  {p.phone_mobile}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div >
</div>
  );
}

export default AdminDashboard;