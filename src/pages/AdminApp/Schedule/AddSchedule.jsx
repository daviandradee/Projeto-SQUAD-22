import "../../../assets/css/index.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../../utils/auth";



function AddSchedule() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [weekday, setWeekday] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("presencial");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const tokenUsuario = getAccessToken();

  const headers = {
    apikey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
    Authorization: `Bearer ${tokenUsuario}`,
    "Content-Type": "application/json",
  };

  // Buscar médicos
  useEffect(() => {
    setLoading(true);
    fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", {
      headers,
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Médicos carregados:", data);
        setDoctors(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erro ao carregar médicos:", err);
        setDoctors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Criar disponibilidade
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId || !weekday || !startTime || !endTime) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    // ✅ Tenta pegar o ID do usuário logado, se existir
    // (caso o tokenUsuario contenha JWT com o UUID do usuário)
    let createdBy = null;
    try {
      const payload = JSON.parse(atob(tokenUsuario.split(".")[1]));
      createdBy = payload?.sub || null;
    } catch (error) {
      console.warn("Token inválido ou sem UUID. Usando null para created_by.");
    }

    const body = {
      doctor_id: doctorId,
      weekday,
      start_time: startTime,
      end_time: endTime,
      slot_minutes: 30,
      appointment_type: appointmentType,
      active,
      created_by: createdBy, // ✅ Envia null se não houver UUID válido
    };

    console.log("Enviando agenda:", body);

    fetch(
      "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctor_availability",
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    )
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(`Erro ${res.status}: ${text}`);
        }
        return text ? JSON.parse(text) : {};
      })
      .then(() => {
        alert("✅ Agenda criada com sucesso!");
        navigate("/admin/doctorschedule");
      })
      .catch((err) => {
        console.error("❌ Erro ao criar agenda:", err);
        alert("Erro ao criar agenda. Veja o console para mais detalhes.");
      });
  };

  return (
    <div className="page-wrapper">
    <div className="content">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h4 className="page-title">Adicionar Agenda</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <form onSubmit={handleSubmit}>
            {/* Médico */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Médico</label>
                  <select
                    className="form-control"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    required
                  >
                    <option value="">
                      {loading ? "Carregando..." : "Selecionar"}
                    </option>
                    {!loading && doctors.length === 0 && (
                      <option disabled>Nenhum médico encontrado</option>
                    )}
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.full_name || doc.name || `ID: ${doc.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dias */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>Dias disponíveis</label>
                  <select
                    className="form-control"
                    value={weekday}
                    onChange={(e) => setWeekday(e.target.value)}
                    required
                  >
                    <option value="">Selecionar</option>
                    <option value="monday">Segunda</option>
                    <option value="tuesday">Terça</option>
                    <option value="wednesday">Quarta</option>
                    <option value="thursday">Quinta</option>
                    <option value="friday">Sexta</option>
                    <option value="saturday">Sábado</option>
                    <option value="sunday">Domingo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Horários */}
            <div className="row">
              <div className="col-md-6">
                <label>Início</label>
                <input
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label>Fim</label>
                <input
                  type="time"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Tipo e Status */}
            <div className="form-group mt-3">
              <label>Tipo de consulta</label>
              <select
                className="form-control"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
              >
                <option value="presencial">Presencial</option>
                <option value="telemedicina">Telemedicina</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  value="ativo"
                  checked={active}
                  onChange={() => setActive(true)}
                />
                <label className="form-check-label">Ativo</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  value="inativo"
                  checked={!active}
                  onChange={() => setActive(false)}
                />
                <label className="form-check-label">Inativo</label>
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary submit-btn" type="submit">
                Criar agenda
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AddSchedule;
