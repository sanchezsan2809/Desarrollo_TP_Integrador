import React, { useState, useEffect, useCallback } from 'react';
import { notificacionesService } from '../../services/api';
import { SEED_IDS } from '../../mockdata/seedIDs';
import './NotificacionesPage.css';

const ID_USUARIO = SEED_IDS.USUARIO_PACIENTE;

const NotificacionesPage = () => {
    const [noLeidas, setNoLeidas] = useState([]);
    const [leidas, setLeidas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargarNotificaciones = useCallback(async () => {
        setCargando(true);
        setError('');

        try {
            const [sinLeer, yaLeidas] = await Promise.all([
                notificacionesService.obtenerNoLeidas(ID_USUARIO),
                notificacionesService.obtenerLeidas(ID_USUARIO)
            ]);

            setNoLeidas(sinLeer);
            setLeidas(yaLeidas);
        } catch (err) {
            setError('No pudimos cargar tus notificaciones. Intentá de nuevo.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarNotificaciones();
    }, [cargarNotificaciones]);

    const handleMarcarLeida = async (id) => {
        try {
            await notificacionesService.marcarComoLeida(ID_USUARIO, id);

            setNoLeidas(prev => {
                const notif = prev.find(n => n.id === id);

                if (notif) {
                    setLeidas(prevLeidas => [
                        ...prevLeidas,
                        { ...notif, leida: true, fechaHoraLeida: new Date().toISOString() }
                    ]);
                }

                return prev.filter(n => n.id !== id);
            });
        } catch (err) {
            setError('No pudimos marcar la notificación como leída.');
        }
    };

    if (cargando) {
        return (
            <div className="notificaciones-page-container">
                <h2>Mis Notificaciones</h2>
                <p>Cargando notificaciones...</p>
            </div>
        );
    }

    return (
        <div className="notificaciones-page-container">
            <h2>Mis Notificaciones</h2>

            {error && <p className="notificaciones-error">{error}</p>}

            <section className="notificaciones-seccion">
                <h3>Sin Leer ({noLeidas.length})</h3>
                {noLeidas.length === 0 ? (
                    <p>No tenés notificaciones nuevas.</p>
                ) : (
                    <div className="notificaciones-lista">
                        {noLeidas.map(notif => (
                            <div key={notif.id} className="notificacion-card no-leida">
                                <div className="notificacion-header">
                                    <strong>De: {notif.remitente}</strong>
                                    <span>{new Date(notif.fechaHoraCreacion).toLocaleDateString('es-AR')}</span>
                                </div>
                                <p>{notif.mensaje}</p>
                                <button 
                                    className="btn-marcar-leida"
                                    onClick={() => handleMarcarLeida(notif.id)}
                                >
                                    Marcar como leída
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <hr className="separador-seccion" />

            <section className="notificaciones-seccion">
                <h3>Leídas</h3>
                {leidas.length === 0 ? (
                    <p>No hay notificaciones en el historial.</p>
                ) : (
                    <div className="notificaciones-lista">
                        {leidas.map(notif => (
                            <div key={notif.id} className="notificacion-card leida">
                                <div className="notificacion-header">
                                    <strong>De: {notif.remitente}</strong>
                                    <span>{new Date(notif.fechaHoraCreacion).toLocaleDateString('es-AR')}</span>
                                </div>
                                <p>{notif.mensaje}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default NotificacionesPage;
