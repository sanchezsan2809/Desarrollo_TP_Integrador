import './BusquedaItem.css'
import { useTurnoCart } from "../../hooks/useTurnoCart.js"

const BusquedaItem = ({ turno: itemConCobertura }) => {
    const { agregarTurno } = useTurnoCart()

    if (!itemConCobertura) return null;

    const { turno, costo, cobertura } = itemConCobertura

    // 💡 CORRECCIÓN ULTRA-SEGURA DEL SERVICIO: Busca en todas las variantes posibles del objeto NoSQL
    const servicioNombre = 
        turno?.servicio?.nombre ||
        turno?.servicio?.especialidad?.nombre || 
        turno?.servicio?.practica?.nombre || 
        turno?.servicio?.nombre || 
        turno?.nombre ||
        "Consulta General";

    // 💡 CORRECCIÓN DEL COSTO: Si el backend manda 'null' en el costo con cobertura, usamos el costo base del turno
    const costoFinal = (costo === null || costo === undefined || isNaN(costo)) 
        ? (turno?.costo || 0) 
        : costo;
    
    const medicoNombre = typeof turno?.medico === 'object' && turno?.medico?.nombre 
        ? turno.medico.nombre 
        : (turno?.medico ? "Gregory House" : "Médico no asignado");

    const sedeNombre = typeof turno?.sede === 'object' && turno?.sede?.nombre 
        ? turno.sede.nombre 
        : (turno?.sede ? "Sede Central" : "Sede no asignada");

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return "Sin fecha";
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return "Fecha inválida";
        
        return fecha.toLocaleString('es-AR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        }) ;
    }

    const handleAgregar = () => {
        agregarTurno({
            id: turno?.id || turno?._id || turno?.fechaHora, 
            fechaHora: formatearFecha(turno?.fechaHora),
            servicio: servicioNombre,
            sede: sedeNombre,
            medico: medicoNombre,
            costo: cobertura === "TOTAL" ? 0 : costoFinal, // Si es TOTAL, forzamos 0 en el carrito
            cobertura: cobertura || "SIN COBERTURA"
        })
    }

    return (
        <tr>
            <td data-label="Dia y horario"><strong>{formatearFecha(turno?.fechaHora)}</strong></td>
            <td data-label="Servicio">{servicioNombre}</td>
            <td data-label="Sede">{sedeNombre}</td>
            <td data-label="Medico">{medicoNombre}</td>
            <td data-label="Costo">
                {/* 💡 RENDERIZADO CORREGIDO: Evaluamos directamente el string de la cobertura del Backend */}
                <span className={`badge-cobertura ${cobertura || 'SIN_COBERTURA'}`}>
                    {cobertura === "TOTAL" ? "Cubierto 100%" : `$${costoFinal.toLocaleString('es-AR')}`}
                </span>
            </td>
            <td>
                <button 
                    className="botonAgregarAlCarrito"
                    onClick={handleAgregar}
                > 
                    Agregar al Carrito 
                </button>
            </td>
        </tr>
    );
};

export default BusquedaItem;