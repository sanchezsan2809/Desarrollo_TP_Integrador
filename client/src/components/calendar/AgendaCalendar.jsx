import { useState } from "react";
import{
    Calendar,
    dayjsLocalizer
} from "react-big-calendar"
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = dayjsLocalizer(dayjs)

export default function AgendaCalendar({

    turnos = [],

    onSelectTurno
}){
    const[
        fechaActual,
        setFechaActual
    ] = useState(
        turnos[0]?.start ??
        new Date()
    )

    return (

        <div
            style={{
                height: "70vh"
            }}
        >
            <Calendar
                localizer={localizer}

                events={turnos}

                startAccessor="start"

                endAccessor="end"

                date={fechaActual}

                onNavigate={setFechaActual}

                defaultDate="month"

                views={[
                    "month",
                    "week",
                    "day"
                ]}

                onSelectEvent={onSelectTurno}
            />
        </div>
    )
}