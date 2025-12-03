// --- SEU JSX COMPLETO ---

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

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;
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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { apikey: supabaseAK, Authorization: `Bearer ${tokenUsuario}` },
        };

        const response = await fetch(
          `${supabaseUrl}/rest/v1/appointments?doctor_id=eq.${doctor_id}`, requestOptions
        );

        const result = await response.json();
        const consultas = Array.isArray(result) ? result : [];

        const idsUnicos = [...new Set(consultas.map((c) => c.patient_id))];
        const promises = idsUnicos.map(async (id) => {
          try {
            const res = await fetch(
              `${supabaseUrl}/rest/v1/patients?id=eq.${id}`,
              {
                method: "GET",
                headers: { apikey: supabaseAK, Authorization: `Bearer ${tokenUsuario}` },
              }
            );
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

        const calendarEvents = consultas.map((consulta) => {
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

    if (doctor_id) fetchAppointments();
  }, [doctor_id, tokenUsuario]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setNewEvent({ title: "", time: "" });
    setStep(1);
    setEditingEvent(null);
    setShowPopup(true);
  };

  const handleAddEvent = () => {
    const eventToAdd = {
      id: Date.now(),
      title: newEvent.title,
      time: newEvent.time,
      date: selectedDate,
      start: `${selectedDate}T${newEvent.time}:00`,
      color: colorsByType[newEvent.type] || "#4dabf7"
    };
    setEvents((prev) => [...prev, eventToAdd]);
    setShowPopup(false);
  };

  const handleEditEvent = () => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id.toString() === editingEvent.id.toString()
          ? {
              ...ev,
              title: newEvent.title,
              time: newEvent.time,
              start: `${ev.date}T${newEvent.time}:00`,
              color: colorsByType[newEvent.type] || "#4dabf7"
            }
          : ev
      )
    );
    setEditingEvent(null);
    setShowPopup(false);
    setShowActionModal(false);
  };

  const handleNextStep = () => {
    if (step < 2) setStep(step + 1);
    else editingEvent ? handleEditEvent() : handleAddEvent();
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowActionModal(true);
  };

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
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        title={`${eventInfo.event.title} • ${typeLabel} • ${eventInfo.event.extendedProps.time}`}
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
      <div className="calendar-container" style={{ padding: 20, display: "flex", justifyContent: "center" }}>
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

            /* intervalos de meia hora */
            slotDuration="00:30:00"
            slotLabelInterval="00:30"

            /* ADICIONADO PARA DEIXAR A PARTE AZUL ESTILIZÁVEL */
            slotLabelContent={(arg) => {
              return {
                html: `<span class="fc-timegrid-slot-label-cushion" data-time="${arg.text}">${arg.text}</span>`
              };
            }}

            events={events.map((ev) => ({
              id: ev.id,
              title: ev.title,
              start: `${ev.date}T${ev.time}:00`,
              color: ev.color,
              extendedProps: {
                type: ev.type,
                time: ev.time,
                color: ev.color,
                appointmentData: ev.appointmentData
              }
            }))}

            eventContent={renderEventContent}
            eventClick={handleEventClick}
            dayCellClassNames="calendar-day-cell"
          />

        </div>
      </div>
    </div>
  );
}
