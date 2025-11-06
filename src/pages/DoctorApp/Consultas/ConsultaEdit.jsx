import { useState, useEffect } from "react";
import { withMask } from "use-mask-input";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../../../assets/css/index.css";
import { getAccessToken } from "../../../utils/auth";
import Swal from "sweetalert2";


function ConsultaEdit() {
  const tokenUsuario = getAccessToken()
  const { id } = useParams();
  const navigate = useNavigate();

  const [minDate, setMinDate] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Dados do formulário

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

  // Define a data mínima
  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    setMinDate(today.toISOString().split("T")[0]);
  }, []);

  // Busca consulta existente
  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        const res = await fetch(
          `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${id}`,
          {
            headers: {
              apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
              Authorization: `Bearer ${tokenUsuario}`,
            },
          }
        );
        const data = await res.json();
        if (data.length > 0) {
          const consulta = data[0];
          const date = consulta.scheduled_at
            ? consulta.scheduled_at.split("T")[0]
            : "";
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
      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Falha ao carregar os dados da consulta.", "error");
      }
    };
    fetchConsulta();
  }, [id]);

  // Busca pacientes
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

  // Busca médicos
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
  const fetchHorariosDisponiveis = async (doctorId, date, appointmentType) => {
    if (!doctorId || !date) {
      setHorariosDisponiveis([]);
      setApiResponse(null);
      return;
    }

    setCarregandoHorarios(true);

    const startDate = `${date}T00:00:00.000Z`;
    const endDate = `${date}T23:59:59.999Z`;

    const payload = {
      doctor_id: doctorId,
      start_date: startDate,
      end_date: endDate,
      appointment_type: appointmentType || "presencial",
    };

    console.log("Payload get-available-slots:", payload);

    try {
      const response = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/get-available-slots",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
            Authorization: `Bearer ${tokenUsuario}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setApiResponse(data);

      if (!response.ok) throw new Error(data.error || "Erro ao buscar horários");

      const slotsDisponiveis = (data?.slots || []).filter((s) => s.available);
      setHorariosDisponiveis(slotsDisponiveis);

      if (slotsDisponiveis.length === 0)
        Swal.fire("Atenção", "Nenhum horário disponível para este dia.", "info");
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      setHorariosDisponiveis([]);
      setApiResponse(null);
      Swal.fire("Erro", "Não foi possível obter os horários disponíveis.", "error");
    } finally {
      setCarregandoHorarios(false);
    }
  };

  // Atualiza horários sempre que o médico, data ou tipo de consulta mudam
  useEffect(() => {
    if (formData.doctor_id && formData.scheduled_date) {
      console.log("Buscando horários para:", {
        doctor_id: formData.doctor_id,
        scheduled_date: formData.scheduled_date,
        appointment_type: formData.appointment_type
      });
      fetchHorariosDisponiveis(formData.doctor_id, formData.scheduled_date, formData.appointment_type);
    } else {
      setHorariosDisponiveis([]);
    }
  }, [formData.doctor_id, formData.scheduled_date, formData.appointment_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Atualiza consulta
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!formData.scheduled_date || !formData.scheduled_time) {
      Swal.fire("Atenção", "Selecione uma data e horário válidos", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Deseja salvar as alterações?",
      text: "As modificações serão salvas permanentemente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const scheduled_at = `${formData.scheduled_date}T${formData.scheduled_time}:00Z`;

    const updatedData = {
      appointment_type: formData.appointment_type,
      chief_complaint: formData.chief_complaint,
      doctor_id: formData.doctor_id,
      duration_minutes: formData.duration_minutes,
      insurance_provider: formData.insurance_provider,
      patient_id: formData.patient_id,
      patient_notes: formData.patient_notes,
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
          navigate("/doctor/consultas")
        );
      } else {
        const error = await res.json();
        console.error(error);
        Swal.fire("Erro", "Não foi possível atualizar a consulta.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Erro", "Falha de conexão com o servidor.", "error");
    }
  };

  return (

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
                    <label>Data da consulta<span className="text-danger">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      min={minDate}
                      name="scheduled_date"
                      value={formData.scheduled_date || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Horário */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Horário<span className="text-danger">*</span></label>
                    {carregandoHorarios ? (
                      <select className="select form-control" disabled>
                        <option>Carregando horários...</option>
                      </select>
                    ) : (
                      <select
                        className="select form-control"
                        name="scheduled_time"
                        value={formData.scheduled_time || ""}
                        onChange={handleChange}
                        required
                        disabled={!horariosDisponiveis.length && formData.doctor_id && formData.scheduled_date}
                      >
                        <option value="">
                          {!formData.doctor_id || !formData.scheduled_date
                            ? "Selecione médico e data primeiro"
                            : horariosDisponiveis.length
                            ? "Selecione um horário"
                            : "Nenhum horário disponível"}
                        </option>
                        {horariosDisponiveis.map((slot) => {
                          const time = slot.datetime.split("T")[1].substring(0, 5);
                          return (
                            <option key={slot.datetime} value={time}>
                              {time}
                            </option>
                          );
                        })}
                      </select>
                    )}
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
                <Link to="/doctor/consultas" className="btn btn-secondary mr-3">
                  <i className="fa fa-arrow-left"></i> Voltar
                </Link>
                <button 
                  className="btn btn-primary submit-btn" 
                  type="submit"
                  disabled={!formData.doctor_id || !formData.patient_id || !formData.scheduled_date || !formData.scheduled_time}
                >
                  <i className="fa fa-save"></i> Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
  );
}

export default ConsultaEdit;