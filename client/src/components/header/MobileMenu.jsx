import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CarritoIndicador from "./CarritoIndicador";
import NotificacionesIndicador from "./NotificacionesIndicador";
import './MobileMenu.css';


export default function MobileMenu({ onClose }) {

    const { user, isAuthenticated, isPaciente, logout } = useAuth();

    return (
        <div className="mobile-menu">

            {
                user?.roles.includes("MEDICO")
                ? (
                    <>
                        <Link to="/medico" onClick={onClose}>
                            Agenda
                        </Link>

                        <Link to="/dh" onClick={onClose}>
                            Disponibilidad
                        </Link>

                        <Link to="/gs" onClick={onClose}>
                            Servicios
                        </Link>

                        <button
                             className="mobile-menu__logout"
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                        >
                            Cerrar sesión
                        </button>
                    </>
                )
                : (
                    <>
                        <Link to="/servicios" onClick={onClose}>
                            Servicios
                        </Link>

                        <Link to="/medicos" onClick={onClose}>
                            Médicos
                        </Link>

                        <Link to="/como-funciona" onClick={onClose}>
                            Cómo funciona
                        </Link>

                        <Link to="/busquedaDeTurnos" onClick={onClose}>
                            Reservar Turnos
                        </Link>

                        {isAuthenticated && isPaciente && (
                            <Link to="/historialDeTurnos" onClick={onClose}>
                                Historial de turnos
                            </Link>
                        )}

                        {isAuthenticated && isPaciente && (
                            <Link to="/mis-turnos" onClick={onClose}>
                                Mis turnos
                            </Link>
                        )}

                        <CarritoIndicador />

                        <NotificacionesIndicador />

                        {isAuthenticated && (
                            <button
                                className="mobile-menu__logout"
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                            >
                                Cerrar sesión
                            </button>
                        )}
                    </>
                )
            }

        </div>
    );
}