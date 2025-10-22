import { useState, useEffect } from "react";
import { withMask } from "use-mask-input";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../../../assets/css/index.css";
import { getAccessToken } from "../../../utils/auth";
import Swal from "sweetalert2";
import { useResponsive } from '../../utils/useResponsive';

function Editconsulta() {
  const tokenUsuario = getAccessToken()
  const { id } = useParams();
  const navigate = useNavigate();

  const [minDate, setMinDate] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

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

  // 🔹 Data mínima
  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    setMinDate(today.toISOString().split("T")[0]);
  }, []);

  // 🔹 Buscar dados da consulta atual
  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        const res = await fetch(
          `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${id}`,
          {
            headers: {
              apikey: "YOUR_SUPABASE_ANON_KEY",
              Authorization: "Bearer YOUR_SUPABASE_ANON_KEY",
            },
          }
        );
        const data = await res.json();
        if (data.length > 0) {
          const consulta = data[0];
          const date = consulta.scheduled_at?.split("T")[0] || "";
          const time = consulta.scheduled_at
            ? consulta.scheduled_at.split("T")[1].substring(0, 5)
            : "";

          setFormData({
            appointment_type: consulta.appointment_type || "presencial",
            chief_complaint: consulta.chief_complaint || "",
            doctor_id: consulta.doctor_id || "",
            duration_minutes: consulta.duration_minutes || 30,
            insurance_provider: consulta.insurance_provider || "",
            patient_id: consulta.patient_id || "",
            patient_notes: consulta.patient_notes || "",
            scheduled_date: date,
            scheduled_time: time,
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Erro", "Não foi possível carregar a consulta.", "error");
      }
    };
    fetchConsulta();
  }, [id]);

  // 🔹 Buscar pacientes
  useEffect(() => {
    fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
         Authorization: `Bearer ${tokenUsuario}`,
      },
    })
      .then((r) => r.json())
      .then(setPacientes)
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Buscar médicos
  useEffect(() => {
    fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
        Authorization: `Bearer ${tokenUsuario}`,
      },
    })
      .then((r) => r.json())
      .then(setMedicos)
      .catch((err) => console.error(err));
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
        setHorariosDisponiveis(data);
      } else {
        setHorariosDisponiveis([]);
      }
    } catch (error) {
      console.error(error);
      setHorariosDisponiveis([]);
    }
  };

  // Atualiza horários sempre que o médico ou data mudam
  useEffect(() => {
    if (formData.doctor_id && formData.scheduled_date) {
      fetchHorariosDisponiveis(formData.doctor_id, formData.scheduled_date);
    }
  }, [formData.doctor_id, formData.scheduled_date]);

  // 🔹 Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Editar consulta
  const handleEdit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Deseja salvar as alterações?",
      text: "As modificações serão salvas permanentemente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const scheduled_at = new Date(
      `${formData.scheduled_date}T${formData.scheduled_time}:00`
    ).toISOString();

    const updatedData = {
      ...formData,
      scheduled_at,
    };

    try {
      const res = await fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
            Authorization: `Bearer ${tokenUsuario}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (res.ok) {
        Swal.fire("Sucesso!", "Consulta atualizada com sucesso!", "success").then(() =>
          navigate("/patientapp/minhasconsultas")
        );
      } else {
        const error = await res.json();
        console.error(error);
        Swal.fire("Erro", "Não foi possível atualizar a consulta.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Falha de conexão com o servidor.", "error");
    }
  };

  return (
    <div className="page-wrapper">
    <div className="content">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h1>Editar consulta</h1>
          <hr />
          <h3>Informações do paciente</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <form onSubmit={handleEdit}>
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

              {/* Tipo */}
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
                  <label>Médico<span className="text-danger">*</span></label>
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
                    value={formData.insurance_provider || ""}
                    onChange={handleChange}
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
                value={formData.chief_complaint || ""}
                onChange={handleChange}
              />
            </div>

            {/* Data e horário */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Data</label>
                  <input
                    type="date"
                    className="form-control"
                    min={minDate}
                    name="scheduled_date"
                    value={formData.scheduled_date || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Horário</label>
                  <select
                    className="select form-control"
                    name="scheduled_time"
                    value={formData.scheduled_time || ""}
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
                value={formData.patient_notes || ""}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="m-t-20 text-center">
              <button className="btn btn-primary submit-btn" type="submit">
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Editconsulta;