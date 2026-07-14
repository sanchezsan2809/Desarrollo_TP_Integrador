import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';
import { useNotificaciones } from '../../context/NotificacionesContext';

import './NotificacionesIndicador.css';

const NotificacionesIndicador = () => {
    const { user } = useAuth();

    const {
        cantidadSinLeer
    } = useNotificaciones();

    if (!user?.id) {
        return null;
    }

    return (
        <Link
            to="/notificaciones"
            className="notificaciones-link"
            aria-label={`${cantidadSinLeer} notificaciones`}
            title={`${cantidadSinLeer} notificaciones`}
        >
            <div className="notificaciones-contenedor">
                <div className="icono-wrapper">
                    <FaBell
                        className="notificaciones-icono"
                        size={24}
                        color="rgba(65,139,24,1)"
                    />

                    {cantidadSinLeer > 0 && (
                        <span className="notificaciones-badge">
                            {cantidadSinLeer}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default NotificacionesIndicador;