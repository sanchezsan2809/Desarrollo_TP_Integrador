import { useEffect, useState } from "react";
import "./MisTurnosPage.css"
import { turnosService } from "../../services/api";
import TurnoReservadoCard from "./TurnoReservadoCard"
import MisTurnosTabs from "./MisTurnosTabs";
import { SEED_IDS } from "../../mockdata/seedIDs";
import AgendaCalendar from "../../components/calendar/AgendaCalendar";

const MisTurnosPage = () => {

    const [turnos, setTurnos] = useState([])
    const [loading, setLoading] = useState(true)
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("RESERVADO")

    useEffect(() => {
        async function cargarTurnos(){

            try {

                const respuesta = 
                    await turnosService.obtenerTurnosPaciente(
                        SEED_IDS.PACIENTE,
                        {
                            estado: estadoSeleccionado
                        },
                    )

                console.log("Respuesta:", respuesta);
                console.log("¿Es array?", Array.isArray(respuesta));
                console.log("respuesta.data:", respuesta.data);
                console.log("¿data es array?", Array.isArray(respuesta.data));

                    setTurnos(respuesta.data)

            }catch(e){
                console.error(e)
            }finally{
                
                setLoading(false)
            }
        }
        cargarTurnos()
    }
, [estadoSeleccionado])

    useEffect(() => {
        console.log("Turnos: ", turnos)
    }, [turnos])

    const eventosCalendario = turnos.map(turno => {
        const inicio = new Date(turno.fechaHora)

        const fin = new Date(
            inicio.getTime() + turno.servicio.duracionTurnoEnMins * 60000
        )

        return {
            ...turno,

            title: turno.servicio.nombre,

            start: inicio, 

            end: fin
        }
    })


return(
    
    <main className="mis-turnos-page">
        <header className="mis-turnos-header">
            <h1>Mis Turnos</h1>
        
            <p>
                Acá podés ver todos tus turnos reservados y próximos
            </p>

        </header>
        
        
        <section className="mis-turnos-content">

            <div className="panel-turnos">

                <MisTurnosTabs
                    estadoSeleccionado={estadoSeleccionado}
                    onSeleccionar={setEstadoSeleccionado}
                />

                {loading ? (
                    <p>Cargando...</p>
                ) : turnos.length === 0 ? (
                    <p>No tenés turnos.</p>
                ) : (
                    <div className="turnos-container">
                        {turnos.map(turno => (
                            <TurnoReservadoCard
                                key={turno.id}
                                turno={turno}
                            />
                        ))}
                    </div>
                )}

            </div>

        </section>

        <section className="panel-calendario">

            <h2>Calendario</h2>

            <AgendaCalendar
                turnos={eventosCalendario}

                onSelectTurno={(turno)=>{
                    console.log(turno)
                }}
            />

        </section>

        <section className="mis-turnos-info">

            {/* Información útil */}

        </section>
        
    </main>

)

}

/*

*/

export default MisTurnosPage