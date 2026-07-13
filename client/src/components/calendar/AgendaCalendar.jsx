import { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./AgendaCalendar.css"; 

dayjs.locale("es");
const localizer = dayjsLocalizer(dayjs);

export default function AgendaCalendar({ turnos = [], onSelectTurno }) {
    const [fechaActual, setFechaActual] = useState(
        turnos[0]?.start ?? new Date()
    );

    const eventStyleGetter = (evento) => {
        const colores = {
            RESERVADO: "#418B18",
            CONFIRMADO: "#1976D2",
            CANCELADO: "#D32F2F",
            REALIZADO: "#757575"
        };

        return {
            style: {
                backgroundColor: colores[evento.estado] || "#418B18",
                border: "none",
                borderRadius: "8px",
                color: "white"
            }
        };
    };

    const messages = {
        today: "Volver a Hoy",
        previous: "‹ Mes Anterior", 
        next: "Mes Siguiente ›",
        month: "Mes",
        week: "Semana",
        day: "Día",
        agenda: "Agenda",
        date: "Fecha",
        time: "Hora",
        event: "Turno",
        noEventsInRange: "No hay turnos para este período."
    };

    return (
        <div style={{ height: "70vh" }}>
            <Calendar
                localizer={localizer}
                events={turnos}
                startAccessor="start"
                endAccessor="end"
                date={fechaActual}
                onNavigate={setFechaActual}
                defaultView="month"
                views={["month"]}
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={onSelectTurno}
            />
        </div>
    );
}