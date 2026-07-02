import './PreseleccionTurnos.css'
import { useTurnoCart } from '../../hooks/useTurnoCart.js'
import TurnoPreseleccionadoCard from "./TurnoPreseleccionadoCard.jsx"

const PreseleccionTurnosPage = () => {
    const {
        turnos,
        confirmarTurnos,
        cantidadTurnos,
        limpiarTurnos
    } = useTurnoCart()

    const handleConfirmarTurnos = async () => {
        try{
            await confirmarTurnos()
            alert("¡Turnos confirmados con éxito! Procesando su reserva...")
        }catch(e){
            alert("No se pudieron reservar todos los turnos")
        }
        
        
    }

    return (
        <div className="preseleccion-container">
            <h1>Mi Preselección</h1>

            {cantidadTurnos === 0 ? (
                <div className="empty-state">
                    <h3>No hay turnos preseleccionados</h3>
                    <p>Agregá turnos desde la búsqueda de turnos.</p>
                </div>
            ) : (
                <>
                    <div className="turnos-list">
                        {turnos.map(turno => (
                            <TurnoPreseleccionadoCard
                                key={turno.id}
                                turno={turno}
                            />
                        ))}
                    </div>

                    {/* 📊 Bloque de acciones y resumen mejorado */}
                    <div className="resumen-box">
                        <h3>Resumen del Pedido</h3>
                        <p className="resumen-cantidad">
                            Turnos seleccionados: <strong>{cantidadTurnos}</strong>
                        </p>
                        
                        <div className="resumen-acciones">
                            {/* 🔥 El botón estrella que faltaba */}
                            <button 
                                onClick={handleConfirmarTurnos}
                                className="btn-confirmar"
                            >
                                Confirmar Turnos
                            </button>

                            <button
                                onClick={limpiarTurnos}
                                className="btn-vaciar"
                            >
                                Vaciar selección
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default PreseleccionTurnosPage