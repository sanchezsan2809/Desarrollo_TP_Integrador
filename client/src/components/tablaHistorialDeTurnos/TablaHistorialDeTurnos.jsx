import './TablaHistorialDeTurnos.css'
import { historialTurnos } from '../../mockdata/Turnos.js';
import HistorialItem from '../historialItem/HistorialItem.jsx';
import { useState } from "react"

function parseFecha(fechaStr) {
    const [dia, mes, anio] = fechaStr.split("/");
    return new Date(`${anio}-${mes}-${dia}`);
}
const TablaHistorialDeTurnos = () =>{
    //TODO Quitar columna estado

    const [filtroServicio,setFiltroServicio] = useState("")
    const [ordenAsc, setOrdenAsc] = useState(true)
    const handleOrdenFecha = () => {
        setOrdenAsc(!ordenAsc)
    }
    const turnosFiltrados = historialTurnos.filter((turno) =>
        turno.servicio?.toLowerCase().includes(filtroServicio.toLowerCase())
    )
    const turnosOrdenados = [...turnosFiltrados].sort((a, b) => {
        const fechaA = parseFecha(a.fechaHora)
        const fechaB = parseFecha(b.fechaHora)

        return ordenAsc
            ? fechaA - fechaB   
            : fechaB - fechaA  
    })
    return (
        <>
            <div className="filtro">
            <input
                type="text"
                placeholder="Buscar por servicio..."
                value={filtroServicio}
                onChange={(e) => setFiltroServicio(e.target.value)}
            />
            </div>
            <div className = "contenedor-tabla">
                <table className = "tablaHistorial">
                    <thead>
                        <tr>
                             <th className="cabecerasTablaHistorial clickable" 
                             onClick={handleOrdenFecha}>
                                Dia y horario {ordenAsc ? "↑" : "↓"}
                            </th>
                            <th scope="col" data-label="ID" className="cabecerasTablaHistorial">ID</th>
                            <th scope="col" data-label="Medico" className="cabecerasTablaHistorial">Medico</th>
                            <th scope="col" data-label="Servicio" className="cabecerasTablaHistorial">Servicio</th>
                            <th scope="col" data-label="Sede" className="cabecerasTablaHistorial">Sede</th>
                            <th scope="col" data-label="Estado" className="cabecerasTablaHistorial">Estado</th>
                            <th scope="col" data-label="Costo" className="cabecerasTablaHistorial">Costo</th>
                        </tr>
                    </thead>
                    <tbody>
                       {turnosOrdenados.map((turno) => (
                            <HistorialItem key={turno.id} turno={turno} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TablaHistorialDeTurnos;