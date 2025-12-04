import "../../assets/css/index.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/auth.js";
import { getUserRole } from "../../utils/userInfo.js";
import Select from 'react-select';
import Swal from 'sweetalert2';

function AgendaForm() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [weekday, setWeekday] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("presencial");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const role = getUserRole();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yuanqfswhberkoevtmfr.supabase.co";
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

  const navigate = useNavigate();
  const tokenUsuario = getAccessToken();

  const headers = {
    apikey:
      supabaseAK,
    Authorization: `Bearer ${tokenUsuario}`,
    "Content-Type": "application/json",
  };

  // Buscar médicos
  useEffect(() => {
    setLoading(true);
    fetch(`${supabaseUrl}/rest/v1/doctors`, {
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
      `${supabaseUrl}/rest/v1/doctor_availability`,
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
        Swal.fire({
          title: 'Sucesso!',
          text: 'Agenda criada com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate(`/${role}/agendadoctor`);
        });
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
                  <Select
                    classNamePrefix="react-select"
                    options={doctors.map((doc) => ({
                      value: doc.id,
                      label: doc.full_name || doc.name || `ID: ${doc.id}`
                    }))}
                    value={doctors.length ? doctors.map((doc) => ({
                      value: doc.id,
                      label: doc.full_name || doc.name || `ID: ${doc.id}`
                    })).find(opt => String(opt.value) === String(doctorId)) : null}
                    onChange={option => setDoctorId(option ? option.value : "")}
                    isClearable
                    isLoading={loading}
                    placeholder={loading ? "Carregando..." : "Selecionar médico"}
                    required
                  />
                </div>
              </div>

              {/* Dias */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>Dias disponíveis</label>
                  <Select
                    classNamePrefix="react-select"
                    options={[
                      { value: "monday", label: "Segunda" },
                      { value: "tuesday", label: "Terça" },
                      { value: "wednesday", label: "Quarta" },
                      { value: "thursday", label: "Quinta" },
                      { value: "friday", label: "Sexta" },
                      { value: "saturday", label: "Sábado" },
                      { value: "sunday", label: "Domingo" }
                    ]}
                    value={(() => {
                      const opts = [
                        { value: "monday", label: "Segunda" },
                        { value: "tuesday", label: "Terça" },
                        { value: "wednesday", label: "Quarta" },
                        { value: "thursday", label: "Quinta" },
                        { value: "friday", label: "Sexta" },
                        { value: "saturday", label: "Sábado" },
                        { value: "sunday", label: "Domingo" }
                      ];
                      return opts.find(opt => opt.value === weekday) || null;
                    })()}
                    onChange={option => setWeekday(option ? option.value : "")}
                    isClearable
                    placeholder="Selecionar dia da semana"
                    required
                  />
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
              <Select
                classNamePrefix="react-select"
                options={[
                  { value: "presencial", label: "Presencial" },
                  { value: "telemedicina", label: "Telemedicina" }
                ]}
                value={(() => {
                  const opts = [
                    { value: "presencial", label: "Presencial" },
                    { value: "telemedicina", label: "Telemedicina" }
                  ];
                  return opts.find(opt => opt.value === appointmentType) || null;
                })()}
                onChange={option => setAppointmentType(option ? option.value : "")}
                isClearable
                placeholder="Selecionar tipo de consulta"
                required
              />
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

export default AgendaForm;
