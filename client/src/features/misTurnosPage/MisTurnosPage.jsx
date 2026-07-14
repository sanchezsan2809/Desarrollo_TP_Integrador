import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MisTurnosPage.css"
import { turnosService } from "../../services/api";
import TurnoReservadoCard from "./TurnoReservadoCard"
import MisTurnosTabs from "./MisTurnosTabs";
import AgendaCalendar from "../../components/calendar/AgendaCalendar";
import { useAuth } from "../../context/AuthContext.jsx";

const MisTurnosPage = () => {
    const { user, isPaciente, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [turnos, setTurnos] = useState([])
    const [loading, setLoading] = useState(true)
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("RESERVADO")

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        } else if (!isPaciente) {
            navigate("/medico"); 
        }
    }, [isAuthenticated, isPaciente, navigate]);

    useEffect(() => {
        if (!isPaciente || !user?.perfilId) return;

        async function cargarTurnos(){
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
        }
        cargarTurnos()
    }, [estadoSeleccionado, user, isPaciente])

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
                                />
                            ))}
                        </div>
                    )}
                </div>

                <section className="panel-calendario">
                    <h2>Calendario</h2>
                    <AgendaCalendar
                        turnos={eventosCalendario}
                        onSelectTurno={(turno)=>{
                            console.log(turno)
                        }}
                    />
                </section>
            </section>
        </main>
    )
}

export default MisTurnosPage;