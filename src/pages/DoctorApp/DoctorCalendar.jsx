import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import "../../assets/css/index.css";
import { getAccessToken } from '../../utils/auth';
import { getDoctorId } from "../../utils/userInfo";

// Função para formatar data/hora igual ao ConsultaList
function formatDateTime(dateString) {
  if (!dateString) return '';
  try {
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return `${day}/${month}/${year} ${hour}:${minute}`;
  } catch {
    return dateString;
  }
}

export default function DoctorCalendar() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [step, setStep] = useState(1);
  const [newEvent, setNewEvent] = useState({ title: "", time: "" });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pacientesMap, setPacientesMap] = useState({});

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yuanqfswhberkoevtmfr.supabase.co";
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";
  const colorsByType = {
    presencial: "#4dabf7",
    online: "#f76c6c",
    Rotina: "#4dabf7",
    Cardiologia: "#f76c6c",
    Otorrino: "#f7b84d",
    Pediatria: "#6cf78b"
  };

  const doctor_id = getDoctorId();
  const tokenUsuario = getAccessToken();

  // Buscar consultas do médico logado
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            apikey: supabaseAK,
            Authorization: `Bearer ${tokenUsuario}`,
          },
          redirect: "follow",
        };

        const response = await fetch(
          `${supabaseUrl}/rest/v1/appointments?doctor_id=eq.${doctor_id}`,
          requestOptions
        );

        const result = await response.json();
        const consultas = Array.isArray(result) ? result : [];

        // Buscar nomes dos pacientes
        const idsUnicos = [...new Set(consultas.map((c) => c.patient_id))];
        const promises = idsUnicos.map(async (id) => {
          try {
            const res = await fetch(
              `${supabaseUrl}/rest/v1/patients?id=eq.${id}`,
              {
                method: "GET",
                headers: {
                  apikey: supabaseAK,
                  Authorization: `Bearer ${tokenUsuario}`,
                },
              }
            );
            if (!res.ok) return { id, full_name: "Paciente não encontrado" };
            const data = await res.json();
            return { id, full_name: data?.[0]?.full_name || "Nome não encontrado" };
          } catch {
            return { id, full_name: "Nome não encontrado" };
          }
        });

        const pacientes = await Promise.all(promises);
        const map = {};
        pacientes.forEach((p) => (map[p.id] = p.full_name));
        setPacientesMap(map);

        // Converter consultas para eventos do calendário
        const calendarEvents = consultas.map((consulta) => {
          // Extrai data e horário diretamente da string ISO, sem criar Date
          const [date, timeFull] = consulta.scheduled_at.split('T');
          const time = timeFull ? timeFull.substring(0, 5) : '';
          return {
            id: consulta.id,
            title: map[consulta.patient_id] || "Paciente",
            date: date,
            time: time,
            start: `${date}T${time}:00`,
            type: consulta.appointment_type || "presencial",
            color: colorsByType[consulta.appointment_type] || "#4dabf7",
            appointmentData: consulta,
          };
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
      }
    };

    if (doctor_id) {
      fetchAppointments();
    }
  }, [doctor_id, tokenUsuario]);

  // Clicar em um dia -> abrir popup 3 etapas
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setNewEvent({ title: "", time: "" });
    setStep(1);
    setEditingEvent(null);
    setShowPopup(true);
  };

  // Adicionar nova consulta
  const handleAddEvent = () => {
    const eventToAdd = {
      id: Date.now(), // number
      title: newEvent.title,
      time: newEvent.time,
      date: selectedDate,
      color: colorsByType[newEvent.type] || "#4dabf7"
    };
    setEvents((prev) => [...prev, eventToAdd]);
    setShowPopup(false);
  };

  // Editar consulta existente
  const handleEditEvent = () => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id.toString() === editingEvent.id.toString()
          ? {
              ...ev,
              title: newEvent.title,
              time: newEvent.time,
              color: colorsByType[newEvent.type] || "#4dabf7"
            }
          : ev
      )
    );
    setEditingEvent(null);
    setShowPopup(false);
    setShowActionModal(false);
  };

  // Próxima etapa no popup
  const handleNextStep = () => {
    if (step < 2) setStep(step + 1);
    else editingEvent ? handleEditEvent() : handleAddEvent();
  };

  // Clicar em uma consulta -> abre modal de ação (Editar/Apagar)
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowActionModal(true);
  };

  // Apagar consulta
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setEvents((prevEvents) =>
      prevEvents.filter(
        (ev) => ev.id.toString() !== selectedEvent.id.toString()
      )
    );
    setShowActionModal(false);
  };

  // Começar a editar
  const handleStartEdit = () => {
    if (!selectedEvent) return;
    setEditingEvent(selectedEvent);
    setNewEvent({
      title: selectedEvent.title,
      time: selectedEvent.extendedProps.time
    });
    setStep(1);
    setShowActionModal(false);
    setShowPopup(true);
  };

  // Aparência da consulta dentro do calendário
  const renderEventContent = (eventInfo) => {
    const bg =
      eventInfo.event.backgroundColor ||
      eventInfo.event.extendedProps?.color ||
      "#4dabf7";
    
    const appointmentType = eventInfo.event.extendedProps?.type || "presencial";
    const typeLabel = appointmentType === "presencial" ? "Presencial" : "Online";

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.72rem",
          padding: "1px 6px",
          lineHeight: 1.1,
          borderRadius: 4,
          backgroundColor: bg,
          color: "#fff",
          cursor: "pointer",
          // Mantém o retângulo pequeno e evita estourar a célula:
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        title={`${eventInfo.event.title} • ${typeLabel} • ${eventInfo.event.extendedProps.time}`} // tooltip
      >
        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
          {eventInfo.event.title}
        </span>
        <span>•</span>
        <span>{eventInfo.event.extendedProps.time}</span>
      </div>
    );
  };

  return (
    <div className="page-wrapper">
    <div
      className="calendar-container"
      style={{ padding: 20, display: "flex", justifyContent: "center" }}
    >
      <div style={{ width: "95%", maxWidth: "none" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today,dayGridMonth,timeGridWeek,timeGridDay"
          }}
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia"
          }}
          locale={ptBrLocale}
          height="80vh"
          dateClick={handleDateClick}
          events={events.map((ev) => ({
            id: ev.id,
            title: ev.title,
            date: ev.date,
            color: ev.color, // para o FullCalendar
            extendedProps: {
              type: ev.type,
              time: ev.time,
              color: ev.color, // para o nosso renderEventContent
              appointmentData: ev.appointmentData // dados completos da consulta
            }
          }))}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          dayCellClassNames="calendar-day-cell"
        />
      </div>

      {/* POPUP 3 etapas (Adicionar/Editar) */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
              width: 320
            }}
          >
            {step === 1 && (
              <>
                <h3 style={{ marginBottom: 8 }}>Nome do paciente</h3>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Digite o nome"
                  style={{
                    width: "100%",
                    marginBottom: 12,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd"
                  }}
                />
                <button
                  onClick={handleNextStep}
                  disabled={!newEvent.title}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "none",
                    background: newEvent.title ? "#4dabf7" : "#c7dbf8",
                    color: "#fff",
                    cursor: newEvent.title ? "pointer" : "not-allowed"
                  }}
                >
                  Próximo
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3 style={{ marginBottom: 8 }}>Horário</h3>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                  style={{
                    width: "100%",
                    marginBottom: 12,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd"
                  }}
                />
                <button
                  onClick={handleNextStep}
                  disabled={!newEvent.time}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "none",
                    background: newEvent.time ? "#4dabf7" : "#c7dbf8",
                    color: "#fff",
                    cursor: newEvent.time ? "pointer" : "not-allowed"
                  }}
                >
                  {editingEvent ? "Salvar Alterações" : "Adicionar"}
                </button>
              </>
            )}

            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: 10,
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "none",
                background: "#ccc",
                color: "#222",
                cursor: "pointer"
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL de ação ao clicar em consulta */}
      {showActionModal && selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
              width: 360,
              textAlign: "left"
            }}
          >
            <h3 style={{ marginBottom: 12, textAlign: "center" }}>Detalhes da Consulta</h3>
            <div style={{ marginBottom: 16, fontSize: "0.9rem" }}>
              <p style={{ margin: "8px 0" }}>
                <strong>Paciente:</strong> {selectedEvent.title}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Tipo:</strong> {selectedEvent.extendedProps?.type === "presencial" ? "Presencial" : "Online"}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Horário:</strong> {selectedEvent.extendedProps?.time || "Não informado"}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Data:</strong> {
                  selectedEvent.start
                    ? (() => {
                        let dateStr =
                          typeof selectedEvent.start === "string"
                            ? selectedEvent.start
                            : selectedEvent.start instanceof Date
                            ? selectedEvent.start.toISOString()
                            : "";
                        return formatDateTime(dateStr).split(" ")[0];
                      })()
                    : "Não informado"
                }
              </p>
              {selectedEvent.extendedProps?.appointmentData?.chief_complaint && (
                <p style={{ margin: "8px 0" }}>
                  <strong>Queixa:</strong> {selectedEvent.extendedProps.appointmentData.chief_complaint}
                </p>
              )}
              {selectedEvent.extendedProps?.appointmentData?.patient_notes && (
                <p style={{ margin: "8px 0" }}>
                  <strong>Observações:</strong> {selectedEvent.extendedProps.appointmentData.patient_notes}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowActionModal(false)}
              style={{
                marginTop: 10,
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "none",
                background: "#4dabf7",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}