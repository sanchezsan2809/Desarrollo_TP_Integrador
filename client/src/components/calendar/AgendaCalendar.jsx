import { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./AgendaCalendar.css"; 

dayjs.locale("es");
const localizer = dayjsLocalizer(dayjs);

export default function AgendaCalendar({ turnos = [], onSelectTurno }) {
    const [fechaActual, setFechaActual] = useState(turnos[0]?.start ?? new Date());
    
    // Detectar si es pantalla móvil para achicar los textos de la botonera
    const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 480);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const eventStyleGetter = (evento) => {
        const colores = {
            RESERVADO: "#418B18",
            CONFIRMADO: "#1976D2",
            CANCELADO: "#D32F2F",
            REALIZADO: "#757575"
        };
        const tienePropuestaPendiente = !!evento.fechaHoraPropuesta;
        const colorFondo = tienePropuestaPendiente ? "#E67E22" : (colores[evento.estado] || "#418B18");

        return {
            style: {
                backgroundColor: colorFondo,
                border: tienePropuestaPendiente ? "2px dashed #D35400" : "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: tienePropuestaPendiente ? "bold" : "normal"
            }
        };
    };

    const messages = {
        today: "Hoy",
        previous: isMobile ? "‹" : "‹ Mes Anterior", 
        next: isMobile ? "›" : "Mes Siguiente ›",
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