import { useLocation, Link } from "react-router-dom"
import "./ReservaExitosaPage.css"

const ReservaExitosaPage = () => {

    const location = useLocation()

    const reservas = location.state?.reservas || []

    return(
        <div className="reserva-exitosa-container">
            <h1>✅ ¡Reserva realizada!</h1>

            <p>
                Se reservaron correctamente
                <strong> {reservas.length}  turnos(s)</strong>
            </p>

            <div className="reservas-list">
                {reservas.map(({ turno }, index) =>(
                    <div
                        className="reserva-card"
                        key={turno.id || index}
                    >

                        <h3>{turno.servicio.nombre}</h3>

                        <p>
                            <strong>Medico:</strong>{" "}
                            {turno.medico.nombre}
                        </p>

                        <p>
                            <strong>Sede:</strong>{" "}
                            {turno.sede.nombre}
                        </p>

                        <p>
                            <strong>Fecha: </strong>{" "}
                            {new Date(turno.fechaHora).toLocaleString}
                        </p>

                    </div>      
                )
            )}
            </div>

            <div className="acciones">

                <Link
                    className="btn-principal"
                    to="/historial-turnos"
                >
                    Ver mis turnos 
                </Link>

                <Link
                    className="btn-secudario"
                    to="/busquedaDeTurnos"
                >
                    Buscar más turnos

                </Link>

            </div>

        </div>
    )
}

export default ReservaExitosaPage