import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../assets/css/index.css";
import { getAccessToken } from "../../../utils/auth";

function AdicionarConsulta() {
  const [minDate, setMinDate] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const tokenUsuario = getAccessToken();

  const [formData, setFormData] = useState({
    appointment_type: "presencial",
    chief_complaint: "",
    doctor_id: "",
    duration_minutes: 30,
    insurance_provider: "",
    patient_id: "",
    patient_notes: "",
    scheduled_date: "",
    scheduled_time: "",
  });

  const navigate = useNavigate();

  // 🔹 Define a data mínima
  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    setMinDate(today.toISOString().split("T")[0]);
  }, []);

  // 🔹 Buscar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients",
          {
            headers: {
              apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
              Authorization: `Bearer ${tokenUsuario}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPacientes(data);
        } else {
          console.error("Erro ao buscar pacientes");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchPacientes();
  }, []);

  // 🔹 Buscar médicos
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors",
          {
            headers: {
              apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
              Authorization: `Bearer ${tokenUsuario}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMedicos(data);
        } else {
          console.error("Erro ao buscar médicos");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchMedicos();
  }, []);

  // 🔹 Buscar horários disponíveis
  const fetchHorariosDisponiveis = async (doctorId, date) => {
    if (!doctorId || !date) return;

    try {
      const response = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/get-available-slots",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
            Authorization: `Bearer ${tokenUsuario}`,
          },
          body: JSON.stringify({ doctor_id: doctorId, date }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHorariosDisponiveis(data || []);
      } else {
        setHorariosDisponiveis([]);
        Swal.fire("Erro", "Erro ao buscar horários disponíveis", "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      Swal.fire("Erro", "Não foi possível conectar ao servidor", "error");
    }
  };

  // 🔹 Atualiza campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Atualiza horários quando médico ou data mudam
  useEffect(() => {
    if (formData.doctor_id && formData.scheduled_date) {
      fetchHorariosDisponiveis(formData.doctor_id, formData.scheduled_date);
    }
  }, [formData.doctor_id, formData.scheduled_date]);

  // 🔹 Envia formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.scheduled_date || !formData.scheduled_time) {
      Swal.fire("Atenção", "Selecione uma data e horário válidos", "warning");
      return;
    }

    const scheduled_at = new Date(
      `${formData.scheduled_date}T${formData.scheduled_time}:00`
    ).toISOString();

    const formattedData = {
      ...formData,
      scheduled_at,
    };

    try {
      const response = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
            Authorization: `Bearer ${tokenUsuario}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Sucesso!",
          text: "Consulta criada com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/secretaria/secretariaconsultalist");
        });
      } else {
        const error = await response.json();
        console.error(error);
        Swal.fire("Erro", "Não foi possível criar a consulta", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Erro de conexão com o servidor", "error");
    }
  };

  return (
    <div className="content">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h1>Nova consulta</h1>
          <hr />
          <h3>Informações do paciente</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Paciente */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Nome do paciente<span className="text-danger">*</span>
                  </label>
                  <select
                    className="select form-control"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione o paciente</option>
                    {pacientes.map((p) => {
                      const nomePaciente =
                        p.name ||
                        p.nome ||
                        p.full_name ||
                        p.paciente_nome ||
                        `Paciente #${p.id}`;
                      return (
                        <option key={p.id} value={p.id}>
                          {nomePaciente}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Tipo da consulta */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>Tipo da consulta</label>
                  <select
                    className="select form-control"
                    name="appointment_type"
                    value={formData.appointment_type}
                    onChange={handleChange}
                  >
                    <option value="presencial">Presencial</option>
                    <option value="telemedicina">Telemedicina</option>
                  </select>
                </div>
              </div>
            </div>

            <hr />
            <h3>Informações do atendimento</h3>

            {/* Médico */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Médico<span className="text-danger">*</span>
                  </label>
                  <select
                    className="select form-control"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione o médico</option>
                    {medicos.map((m) => {
                      const nomeMedico =
                        m.name ||
                        m.nome ||
                        m.full_name ||
                        m.doctor_name ||
                        `Médico #${m.id}`;
                      return (
                        <option key={m.id} value={m.id}>
                          {nomeMedico}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Convênio */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>Convênio</label>
                  <input
                    type="text"
                    className="form-control"
                    name="insurance_provider"
                    value={formData.insurance_provider}
                    onChange={handleChange}
                    placeholder="Ex: Unimed, Bradesco..."
                  />
                </div>
              </div>
            </div>

            {/* Motivo */}
            <div className="form-group">
              <label>Motivo / Queixa principal</label>
              <input
                type="text"
                className="form-control"
                name="chief_complaint"
                value={formData.chief_complaint}
                onChange={handleChange}
                required
              />
            </div>

            {/* Data e hora */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Data</label>
                  <input
                    type="date"
                    className="form-control"
                    min={minDate}
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Horário</label>
                  <select
                    className="select form-control"
                    name="scheduled_time"
                    value={formData.scheduled_time}
                    onChange={handleChange}
                    required
                    disabled={!horariosDisponiveis.length}
                  >
                    <option value="">
                      {horariosDisponiveis.length
                        ? "Selecione um horário"
                        : "Nenhum horário disponível"}
                    </option>
                    {horariosDisponiveis.map((hora) => (
                      <option key={hora} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="form-group">
              <label>Anotações do paciente</label>
              <textarea
                cols="30"
                rows="4"
                className="form-control"
                name="patient_notes"
                value={formData.patient_notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="m-t-20 text-center">
              <button className="btn btn-primary submit-btn" type="submit">
                Criar consulta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdicionarConsulta;
