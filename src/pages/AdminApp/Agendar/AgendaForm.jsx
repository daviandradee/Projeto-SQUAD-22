import { useState, useEffect } from "react";
import { withMask } from "use-mask-input";
import { Link } from "react-router-dom";
import "../../../assets/css/index.css";
import { getAccessToken } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";

function AgendaForm() {
  const tokenUsuario = getAccessToken();
  const [minDate, setMinDate] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [formData, setFormData] = useState({
    appointment_type: "presencial",
    chief_complaint: "",
    doctor_id: "",
    duration_minutes: 30,
    insurance_provider: "",
    patient_id: "",
    patient_notes: "",
    scheduled_at: "",
  });

  const navigate = useNavigate();


  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    setMinDate(today.toISOString().split("T")[0]);
  }, []);


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
        console.error("Erro de conexão:", error);
      }
    };
    fetchPacientes();
  }, []);


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
        console.error("Erro ao buscar médicos.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  };

  fetchMedicos();
}, []);


  // 🔹 Atualiza os campos do form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Envia dados para Supabase conforme o modelo da API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Concatena data e hora em um único campo ISO (scheduled_at)
      const scheduledDateTime = new Date(formData.scheduled_at);
      const formattedData = {
        ...formData,
        scheduled_at: scheduledDateTime.toISOString(),
      };

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
        alert("Consulta criada com sucesso!");
        navigate("admin/agendalist");
      } else {
        const error = await response.json();
        console.error(error);
        alert("Erro ao criar consulta.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    }
  }

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
              {/* Paciente vindo da API */}
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
                      // 🔹 Detecta automaticamente o campo de nome correto
                      const nomePaciente =
                        p.name ||
                        p.nome ||
                        p.full_name ||
                        p.paciente_nome ||
                        p.patient_name ||
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
                  <label>
                    Tipo da consulta<span className="text-danger">*</span>
                  </label>
                  <select
                    className="select form-control"
                    name="appointment_type"
                    value={formData.appointment_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="presencial">Presencial</option>
                    <option value="telemedicina">Telemedicina</option>
                  </select>
                </div>
              </div>
            </div>

            <hr />
            <h3>Informações do atendimento</h3>

            <div className="row">
              {/* Médico (ID) */}
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
                      // 🔹 Detecta automaticamente o campo de nome correto
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
                    placeholder="Ex: Unimed, Bradesco Saúde..."
                  />
                </div>
              </div>
            </div>

            {/* Motivo da consulta */}
            <div className="form-group">
              <label>
                Motivo / Queixa principal<span className="text-danger">*</span>
              </label>
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
                  <label>
                    Data e hora agendada<span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    min={minDate}
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Duração */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>Duração (minutos)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    min="15"
                    step="5"
                  />
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
export default AgendaForm;