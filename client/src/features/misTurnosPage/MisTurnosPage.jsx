import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./MisTurnosPage.css"
import { turnosService } from "../../services/api";
import TurnoReservadoCard from "./TurnoReservadoCard"
import MisTurnosTabs from "./MisTurnosTabs";
import AgendaCalendar from "../../components/calendar/AgendaCalendar";
import { useAuth } from "../../context/AuthContext.jsx";
import TurnoDialogPaciente from "./TurnoDialogPaciente.jsx";

const MisTurnosPage = () => {
    const { user, isPaciente, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [turnos, setTurnos] = useState([])
    const [loading, setLoading] = useState(true)
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("RESERVADO")
    // Estado para manejar el diálogo modal
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        } else if (!isPaciente) {
            navigate("/medico"); 
        }
    }, [isAuthenticated, isPaciente, navigate]);

    // Envolvemos cargarTurnos en useCallback para poder pasarla como callback de refresco
    const cargarTurnos = useCallback(async () => {
        if (!isPaciente || !user?.perfilId) return;
        try {
            setLoading(true);
            const respuesta = await turnosService.obtenerTurnosPaciente(
                user.perfilId,
                {
                    estado: estadoSeleccionado
                }
            )
            setTurnos(respuesta.data || [])
        } catch(e) {
            console.error("Error al cargar los turnos del paciente:", e)
        } finally {
            setLoading(false)
        }
    }, [estadoSeleccionado, user, isPaciente]);

    useEffect(() => {
        cargarTurnos()
    }, [cargarTurnos])

    if (!isAuthenticated || !isPaciente) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <p>Cargando perfil y verificando permisos...</p>
            </div>
        );
    }

    const eventosCalendario = turnos.map(turno => {
        const inicio = new Date(turno.fechaHora)
        const fin = new Date(
            inicio.getTime() + (turno.servicio?.duracionTurnoEnMins || 30) * 60000
        )

        return {
            ...turno,
            title: turno.servicio?.nombre || "Consulta",
            start: inicio, 
            end: fin
        }
    })

    return (
        <main className="mis-turnos-page">
            <header className="mis-turnos-header">
                <h1>Mis Turnos</h1>
                <p>Acá podés ver todos tus turnos reservados y próximos</p>
            </header>
            
            <section className="mis-turnos-content">
                <div className="panel-turnos">
                    <MisTurnosTabs
                        estadoSeleccionado={estadoSeleccionado}
                        onSeleccionar={setEstadoSeleccionado}
                    />

                    {loading ? (
                        <p>Cargando turnos...</p>
                    ) : turnos.length === 0 ? (
                        <p>No tenés turnos en este estado.</p>
                    ) : (
                        <div className="turnos-container">
                            {turnos.map(turno => (
                                <TurnoReservadoCard
                                    key={turno.id || turno._id}
                                    turno={turno}
                                    // Pasamos la acción de abrir el modal a la tarjeta
                                    onVerDetalle={() => setTurnoSeleccionado(turno)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <section className="panel-calendario">
                    <h2>Calendario</h2>
                    <AgendaCalendar
                        turnos={eventosCalendario}
                        // Ahora al hacer clic en el calendario, se guarda el turno y se abre el modal
                        onSelectEvent={(evento) => setTurnoSeleccionado(evento)}
                        onSelectTurno={(evento) => setTurnoSeleccionado(evento)}
                    />
                </section>
            </section>

            {/* Renderizamos el modal en la parte inferior */}
            <TurnoDialogPaciente
                open={Boolean(turnoSeleccionado)}
                turno={turnoSeleccionado}
                onClose={() => setTurnoSeleccionado(null)}
                onTurnoActualizado={cargarTurnos} // Refresca la lista y el calendario automáticamente al confirmar/rechazar
            />
        </main>
    )
}

export default MisTurnosPage;