import './BusquedaItem.css'
import { useTurnoCart } from "../../hooks/useTurnoCart.js"

const BusquedaItem = ({ turno: itemConCobertura }) => {
    const { agregarTurno } = useTurnoCart()

    if (!itemConCobertura) return null

    const { turno, costo, cobertura } = itemConCobertura

    const servicioNombre =
        turno?.servicio?.nombre ||
        turno?.servicio?.especialidad?.nombre ||
        turno?.servicio?.practica?.nombre ||
        turno?.nombre ||
        "Consulta General"

    const costoBase = Number(turno?.costo ?? 0)

    const costoCalculadoValido =
        costo !== null &&
        costo !== undefined &&
        costo !== "" &&
        Number.isFinite(Number(costo))

    let costoFinal

    if (cobertura === "TOTAL") {
        costoFinal = 0
    } else if (
        cobertura === "PARCIAL" &&
        costoCalculadoValido
    ) {
        costoFinal = Number(costo)
    } else {
        costoFinal = costoBase
    }

    const medicoNombre =
        turno?.medico?.nombre || "Médico no asignado"

    const sedeNombre =
        turno?.sede?.nombre || "Sede no asignada"

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return "Sin fecha"

        const fecha = new Date(fechaStr)

        if (Number.isNaN(fecha.getTime())) {
            return "Fecha inválida"
        }

        return fecha.toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        })
    }

    const handleAgregar = () => {
        agregarTurno({
            id: turno?.id || turno?._id || turno?.fechaHora,
            fechaHora: turno?.fechaHora,
            servicio: servicioNombre,
            sede: sedeNombre,
            medico: medicoNombre,
            costo: costoFinal,
            cobertura: cobertura || "SIN COBERTURA"
        })
    }

    return (
        <tr>
            <td data-label="Día y horario">
                <strong>
                    {formatearFecha(turno?.fechaHora)}
                </strong>
            </td>

            <td data-label="Servicio">{servicioNombre}</td>
            <td data-label="Sede">{sedeNombre}</td>
            <td data-label="Médico">{medicoNombre}</td>

            <td data-label="Costo">
                <span
                    className={`badge-cobertura ${
                        cobertura || "SIN_COBERTURA"
                    }`}
                >
                    ${costoFinal.toLocaleString("es-AR")}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    className="botonAgregarAlCarrito"
                    onClick={handleAgregar}
                >
                    Agregar al carrito
                </button>
            </td>
        </tr>
    )
}

export default BusquedaItem