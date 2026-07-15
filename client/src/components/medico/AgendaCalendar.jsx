import { useState } from 'react'
import {
    Calendar,
    dayjsLocalizer
} from 'react-big-calendar'
import dayjs from 'dayjs'
import TurnoDialog from './TurnoDialog'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dayjsLocalizer(dayjs)

function convertirTurnosAgenda(turnos = []) {
    return turnos.map((turno) => {
        const inicio = new Date(turno.fechaHora)
        const duracion = turno.servicio?.duracionTurnoEnMins ?? 30
        const fin = new Date(inicio)
        fin.setMinutes(fin.getMinutes() + duracion)

        return {
            ...turno,
            start: inicio,
            end: fin,
            title: `${turno.paciente?.nombre ?? 'Disponible'} - ${turno.servicio?.nombre ?? 'Turno'}`
        }
    })
}

export default function AgendaCalendar({
    turnos = [],
    onTurnosActualizados
}) {
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)
    const eventos = convertirTurnosAgenda(turnos)

    const cerrarDialog = () => {
        setTurnoSeleccionado(null)
    }

    const actualizarAgenda = async () => {
        await onTurnosActualizados?.()
        setTurnoSeleccionado(null)
    }

    // NUEVO: Función para dar estilo dinámico a los eventos
    const eventPropGetter = (event) => {
        const tienePropuesta = !!event.fechaHoraPropuesta;
        
        if (tienePropuesta) {
            return {
                style: {
                    backgroundColor: '#e67e22', // Color Naranja
                    color: 'white',
                    borderRadius: '8px',
                    border: '2px solid #d35400',
                    display: 'block'
                }
            };
        }
        
        // Estilo por defecto (Verde/Azul según tu diseño)
        return {
            style: {
                backgroundColor: '#418B18', 
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                display: 'block'
            }
        };
    }

    return (
        <div style={{ height: '75vh', padding: '20px' }}>
            <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                defaultView="month"
                views={['month', 'week', 'day']}
                onSelectEvent={(turno) => setTurnoSeleccionado(turno)}
                eventPropGetter={eventPropGetter} // <-- AGREGADO ACÁ
            />

            <TurnoDialog
                open={Boolean(turnoSeleccionado)}
                turno={turnoSeleccionado}
                onClose={cerrarDialog}
                onTurnoActualizado={actualizarAgenda}
            />
        </div>
    )
}