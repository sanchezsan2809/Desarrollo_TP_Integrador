import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './MobileMenu.css';

export default function MobileMenu({ onClose }) {
    const { user, isAuthenticated } = useAuth();

    // Verificamos de manera segura si el rol es médico
    const esMedico = user?.rol === "MEDICO" || (Array.isArray(user?.roles) && user.roles.includes("MEDICO"));

    return (
        <div className="mobile-menu">
            {esMedico ? (
                <>
                    <Link to="/agenda" onClick={onClose}>
                        Agenda
                    </Link>

                    <Link to="/disponibilidadHoraria" onClick={onClose}>
                        Disponibilidad
                    </Link>

                    <Link to="/gestionDeServicios" onClick={onClose}>
                        Servicios
                    </Link>
                </>
            ) : (
                <>
                    {/* SE ELIMINÓ EL LINK DE SERVICIOS AQUÍ */}

                    <Link to="/medicos" onClick={onClose}>
                        Médicos
                    </Link>

                    <Link to="/como-funciona" onClick={onClose}>
                        Cómo funciona
                    </Link>

                    <Link to="/busquedaDeTurnos" onClick={onClose}>
                        Reservar Turnos
                    </Link>
                </>
            )}
        </div>
    );
}