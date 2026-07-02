import { useEffect, useState } from "react";
import "./MisTurnosPage.css"
import { turnosService } from "../../services/api";
import TurnoReservadoCard from "../../components/turnoReservadoCard/TurnoReservadoCard"

const MisTurnosPage = () => {

    const [turnos, setTurnos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function cargarTurnos(){

            try {

                const respuesta = 
                    await turnosService.obtenerTurnosPaciente(
                        "654321abcdef1234567890ab",
                        {
                            estado: "RESERVADO"
                        }
                    )

                    setTurnos(respuesta.data)
            }catch(e){
                console.error(e)
            }finally{
                
                setLoading(false)
            }
        }
        cargarTurnos()
    }
, [])

return(
    <main className="mis-turnos-page">
        <h1>Mis Turnos</h1>

        <p className="subtitulo">
            Consultá todos tus turnos reservados
        </p>

        {
            loading && <p>Cargando...</p>
        }

        {!loading && turnos.length === 0 && 
            
            <p>No tenés turnos reservados</p>
        
        }

        <section className="turnos-container">

            {turnos.map(turno => (

                <TurnoReservadoCard
                    key={turno.id}
                    turno={turno}
                />
            ))}

        </section>

    </main>

)

}

export default MisTurnosPage