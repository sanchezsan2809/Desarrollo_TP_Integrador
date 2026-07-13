import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa'; 
import { notificacionesService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './NotificacionesIndicador.css';

const NotificacionesIndicador = () => {
    const { user } = useAuth();
    // const idUsuario = user?.usuario?.id;
    const idUsuario = user?.id;

    const [cantidadSinLeer, setCantidadSinLeer] = useState(0);

    useEffect(() => {
        if (!idUsuario) {
            return;
        }

        let activo = true;

        const cargarConteo = async () => {
            try {
                const noLeidas = await notificacionesService.obtenerNoLeidas(idUsuario);

                if (activo) {
                    setCantidadSinLeer(noLeidas.length);
                }
            } catch (err) {
                if (activo) {
                    setCantidadSinLeer(0);
                }
            }
        };

        cargarConteo();

        const intervalId = setInterval(cargarConteo, 15000);

        return () => {
            activo = false;
            clearInterval(intervalId);
        };
    }, [idUsuario]);

    if (!idUsuario) {
        return null;
    }

    return (
        <Link 
            to={'/notificaciones'} 
            className="notificaciones-link"
            aria-label={`${cantidadSinLeer} notificaciones`}
            title={`${cantidadSinLeer} notificaciones`}
        >
        <div className="notificaciones-contenedor"> 
                <div className="icono-wrapper">
                    
                    <FaBell className="notificaciones-icono" size={24} color= "rgba(65,139,24,1.000)" />
                    
                    {cantidadSinLeer > 0 && (
                        <span className="notificaciones-badge"
                        
                         >
                            {cantidadSinLeer}
                        </span>
                    )}
                    
                </div>
            </div> 
        </Link>
    );
};

export default NotificacionesIndicador;
