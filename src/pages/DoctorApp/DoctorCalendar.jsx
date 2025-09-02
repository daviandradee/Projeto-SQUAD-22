import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

function DoctorCalendar() {
  return (
    <div className="doctor-calendar-container">
      <h2 className="calendar-title">Calendário do Médico</h2>
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          locale={ptBrLocale}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
        />
      </div>

      {/* CSS inline para centralizar */}
      <style jsx>{`
        .doctor-calendar-container {
          display: flex;
          flex-direction: column;
          align-items: center; /* centraliza horizontal */
          justify-content: center; /* centraliza vertical se precisar */
          width: 100%;
          padding: 20px;
        }

        .calendar-title {
          margin-bottom: 20px;
          text-align: center;
        }

        .calendar-wrapper {
          max-width: 900px; /* largura máxima do calendário */
          width: 100%;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default DoctorCalendar;

