import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa'; 
import { notificacionesService } from '../../services/api';
import { SEED_IDS } from '../../mockdata/seedIDs';
import './NotificacionesIndicador.css';

const ID_USUARIO = SEED_IDS.USUARIO_PACIENTE;

const NotificacionesIndicador = () => {

    const [cantidadSinLeer, setCantidadSinLeer] = useState(0);

    useEffect(() => {
        let activo = true;

        const cargarConteo = async () => {
            try {
                const noLeidas = await notificacionesService.obtenerNoLeidas(ID_USUARIO);

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

        return () => {
            activo = false;
        };
    }, []);

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
