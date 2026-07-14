import './BotonesHome.css'
import { IoSearchSharp } from "react-icons/io5";
import { LuCalendarClock } from "react-icons/lu";
import { Link } from 'react-router-dom';

const BotonesHome = () =>{
    return (
        <>
        <div>
            <ul className="listaDeBotones">
                <li className="globoDeTexto">
                    ¿Qué buscas hoy?
                </li>
                <li>
                    <Link to ={'/busquedaDeTurnos'} className = "link-boton"> 
                        <button className="boton">
                            <span className="icono-btn"><IoSearchSharp /></span> 
                            Buscar turnos nuevos
                        </button>
                    </Link> 
                </li>
                <li>
                    <Link to = {'/mis-turnos'} className = "link-boton">
                        <button className="boton">
                            <span className="icono-btn"><LuCalendarClock /></span> 
                            Consultar historial de turnos
                        </button>
                    </Link>
                </li>
            </ul>
        </div>
        </>
    );
};

export default BotonesHome;