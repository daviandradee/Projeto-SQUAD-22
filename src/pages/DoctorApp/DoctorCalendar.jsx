import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import "../../assets/css/index.css";
import { useResponsive } from '../../utils/useResponsive';

export default function DoctorCalendar() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [step, setStep] = useState(1);
  const [newEvent, setNewEvent] = useState({ title: "", time: "" });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const colorsByType = {
    Rotina: "#4dabf7",
    Cardiologia: "#f76c6c",
    Otorrino: "#f7b84d",
    Pediatria: "#6cf78b"
  };

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
        title={`${eventInfo.event.title} • ${eventInfo.event.extendedProps.type} • ${eventInfo.event.extendedProps.time}`} // tooltip
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
              color: ev.color // para o nosso renderEventContent
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
              width: 320,
              textAlign: "center"
            }}
          >
            <h3 style={{ marginBottom: 4 }}>Consulta de {selectedEvent.title}</h3>
            <p style={{ margin: 0 }}>
              {selectedEvent.extendedProps.type} às {selectedEvent.extendedProps.time}
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={handleStartEdit}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "#4dabf7",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Editar
              </button>
              <button
                onClick={handleDeleteEvent}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "#f76c6c",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Apagar
              </button>
            </div>

            <button
              onClick={() => setShowActionModal(false)}
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
    </div>
  );
}
