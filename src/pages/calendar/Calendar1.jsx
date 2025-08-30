import "../../assets/css/index.css"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'   




function Calendar() {
  const handleDateClick = () => {
    alert(arg.dateStr)
  }

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-sm-4 col-3">
              <h4 className="page-title">Calendario</h4>
            </div>
          </div>
          <div>
              <FullCalendar
                plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
                initialView={"dayGridMonth"}
                locale={ptBrLocale}
                headerToolbar={{
                    start: 'today prev,next', 
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay' 
                  }}
                
              />
            </div>
        </div>    
      </div> 
    </div>
)
}

export default Calendar
          