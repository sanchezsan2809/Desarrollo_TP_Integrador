import { useLocation } from 'react-router-dom';
import './TablaBusquedaDeTurnos.css'
import { useTurnoCart } from "../../hooks/useTurnoCart.js"
import { useState, useEffect } from "react"
import { turnosService } from '../../services/api.js' 
import { useAuth } from "../../context/AuthContext";
import BusquedaItem from '../busquedaItem/BusquedaItem.jsx';

const TablaBusquedaDeTurnos = () => {
    const { user } = useAuth();

    const { agregarTurno } = useTurnoCart()
    const location = useLocation();

    const servicioInicial = location.state?.servicioSeleccionado || "";

    const [filtroServicio, setFiltroServicio] = useState(servicioInicial);

    const medicoInicial = location.state?.medicoSeleccionado || "";

    const [filtroMedico, setFiltroMedico] = useState(medicoInicial);

    const [filtroSede, setFiltroSede] = useState("")
    const [fechaDesde, setFechaDesde] = useState("")
    const [fechaHasta, setFechaHasta] = useState("")

    const [turnos, setTurnos] = useState([]);
    const [paginacion, setPaginacion] = useState({ page: 1, totalPages: 1 });
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTurnos = async () => {
            setCargando(true);
            setError(null);
            try {
                const filtros = {
                    nombreEspecialidad: filtroServicio,
                    nombrePractica: filtroServicio,
                    nombreSede: filtroSede,
                    nombreMedico: filtroMedico,
                    fechaDesde: fechaDesde ? new Date(fechaDesde).toISOString() : undefined,
                    fechaHasta: fechaHasta ? new Date(fechaHasta).toISOString() : undefined
                };

                const resultado = await turnosService.buscarDisponibles(user.perfilId ,filtros, paginacion.page, 10);

                setTurnos(resultado.turnosConCobertura || []);
                if (resultado.paginacion) {
                    setPaginacion(resultado.paginacion);
                }
            } catch (err) {
                setError("No se pudieron recuperar los turnos del backend NoSQL.");
            } finally {
                setCargando(false);
            }
        };

        fetchTurnos();
    }, [filtroServicio, filtroSede, filtroMedico, fechaDesde, fechaHasta, paginacion.page]);

    return (
        <>
        <div className="busquedaDeTurnos-Container">
            
            <div className="busqueda">
                <div className="filtrosDeBusqueda">
                    <input
                        type="text"
                        placeholder="Buscar por servicio..."
                        value={filtroServicio}
                        onChange={(e) => setFiltroServicio(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Buscar por médico..."
                        value={filtroMedico}
                        onChange={(e) => setFiltroMedico(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Elegir Sede"
                        value={filtroSede}
                        onChange={(e) => setFiltroSede(e.target.value)}
                    />
                   <input
                        type={fechaDesde ? "date" : "text"}
                        placeholder="Fecha Desde"
                        value={fechaDesde}
                        onClick={(e) => {
                            e.currentTarget.type = "date";
                            if (e.currentTarget.showPicker) e.currentTarget.showPicker();
                        }}
                        onBlur={(e) => {
                            if (!fechaDesde) e.currentTarget.type = "text";
                        }}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />

                    <input
                        type={fechaHasta ? "date" : "text"}
                        placeholder="Fecha Hasta"
                        value={fechaHasta}
                        onClick={(e) => {
                            e.currentTarget.type = "date";
                            if (e.currentTarget.showPicker) e.currentTarget.showPicker();
                        }}
                        onBlur={(e) => {
                            if (!fechaHasta) e.currentTarget.type = "text";
                        }}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
            </div>

            <div className="tablaDeTurnosDisponibles">
                
                {cargando && <div className="loader">Cargando turnos disponibles...</div>}
                
                {error && <div className="error-message">{error}</div>}

                {!cargando && !error && (
                    <table className="tablaHistorial">
                        <thead>
                            <tr>
                                <th scope="col" data-label="Dia y horario" className="cabecerasTablaHistorial">Dia y horario</th>
                                <th scope="col" data-label="Servicio" className="cabecerasTablaHistorial">Servicio</th>
                                <th scope="col" data-label="Sede" className="cabecerasTablaHistorial">Sede</th>
                                <th scope="col" data-label="Medico" className="cabecerasTablaHistorial">Medico</th>
                                <th scope="col" data-label="Costo" className="cabecerasTablaHistorial">Costo</th>
                                <th scope="col" data-label="" className="cabecerasTablaHistorial"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{textAlign: "center", padding: "20px"}}>
                                        No hay turnos disponibles para los filtros seleccionados.
                                    </td>
                                </tr>
                            ) : (
                                turnos.map((turno, index) => (
                                    <BusquedaItem
                                        key={`turno-tabla-${index}`}
                                        turno={turno}
                                        onAgregar={() => agregarTurno(turno)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
        </>
    );
};

export default TablaBusquedaDeTurnos;