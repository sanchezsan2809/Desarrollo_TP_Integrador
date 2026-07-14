import React, {
    useCallback,
    useEffect,
    useState
} from 'react';

import { notificacionesService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotificaciones } from '../../context/NotificacionesContext';

import './NotificacionesPage.css';

const NotificacionesPage = () => {
    const { user } = useAuth();

    const idUsuario = user?.id;

    const {
        quitarNotificacionNoLeida,
        recargarNotificaciones
    } = useNotificaciones();

    const [noLeidas, setNoLeidas] = useState([]);
    const [leidas, setLeidas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargarNotificaciones = useCallback(async () => {
        if (!idUsuario) {
            setCargando(false);
            return;
        }

        setCargando(true);
        setError('');

        try {
            const [
                respuestaNoLeidas,
                respuestaLeidas
            ] = await Promise.all([
                notificacionesService.obtenerNoLeidas(
                    idUsuario
                ),
                notificacionesService.obtenerLeidas(
                    idUsuario
                )
            ]);

            const notificacionesNoLeidas =
                Array.isArray(respuestaNoLeidas)
                    ? respuestaNoLeidas
                    : respuestaNoLeidas?.data ??
                      respuestaNoLeidas?.notificaciones ??
                      [];

            const notificacionesLeidas =
                Array.isArray(respuestaLeidas)
                    ? respuestaLeidas
                    : respuestaLeidas?.data ??
                      respuestaLeidas?.notificaciones ??
                      [];

            setNoLeidas(notificacionesNoLeidas);
            setLeidas(notificacionesLeidas);
        } catch (err) {
            console.error(
                'Error al cargar notificaciones:',
                err
            );

            setError(
                'No pudimos cargar tus notificaciones. Intentá de nuevo.'
            );
        } finally {
            setCargando(false);
        }
    }, [idUsuario]);

    useEffect(() => {
        cargarNotificaciones();
    }, [cargarNotificaciones]);

    const handleMarcarLeida = async (idNotificacion) => {
        if (!idUsuario) return;

        setError('');

        const notificacionOriginal = noLeidas.find(
            (notificacion) =>
                notificacion.id === idNotificacion
        );

        if (!notificacionOriginal) {
            return;
        }

        const notificacionActualizada = {
            ...notificacionOriginal,
            leida: true,
            fechaHoraLeida: new Date().toISOString()
        };

        // Actualización optimista de la página
        setNoLeidas((notificacionesActuales) =>
            notificacionesActuales.filter(
                (notificacion) =>
                    notificacion.id !== idNotificacion
            )
        );

        setLeidas((notificacionesActuales) => [
            notificacionActualizada,
            ...notificacionesActuales
        ]);

        // Actualización inmediata del badge
        quitarNotificacionNoLeida(idNotificacion);

        try {
            await notificacionesService.marcarComoLeida(
                idUsuario,
                idNotificacion
            );
        } catch (err) {
            console.error(
                'Error al marcar notificación como leída:',
                err
            );

            // Revertimos la página si el backend falla
            setLeidas((notificacionesActuales) =>
                notificacionesActuales.filter(
                    (notificacion) =>
                        notificacion.id !== idNotificacion
                )
            );

            setNoLeidas((notificacionesActuales) => [
                notificacionOriginal,
                ...notificacionesActuales
            ]);

            // Recuperamos el estado real del backend
            await recargarNotificaciones();

            setError(
                'No pudimos marcar la notificación como leída.'
            );
        }
    };

    const obtenerNombreRemitente = (remitente) => {
        if (!remitente) {
            return 'Usuario desconocido';
        }

        if (typeof remitente === 'string') {
            return remitente;
        }

        return (
            remitente.nombreUsuario ||
            `${remitente.nombre ?? ''} ${remitente.apellido ?? ''}`.trim() ||
            remitente.email ||
            'Usuario desconocido'
        );
    };

    const formatearFecha = (fecha) => {
        if (!fecha) {
            return '';
        }

        return new Date(fecha).toLocaleString(
            'es-AR',
            {
                dateStyle: 'short',
                timeStyle: 'short'
            }
        );
    };

    if (!idUsuario) {
        return (
            <div className="notificaciones-page-container">
                <h2>Mis Notificaciones</h2>

                <p>
                    Iniciá sesión para ver tus notificaciones.
                </p>
            </div>
        );
    }

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

            {error && (
                <p className="notificaciones-error">
                    {error}
                </p>
            )}

            <section className="notificaciones-seccion">
                <h3>
                    Sin leer ({noLeidas.length})
                </h3>

                {noLeidas.length === 0 ? (
                    <p>
                        No tenés notificaciones nuevas.
                    </p>
                ) : (
                    <div className="notificaciones-lista">
                        {noLeidas.map((notificacion) => (
                            <div
                                key={notificacion.id}
                                className="notificacion-card no-leida"
                            >
                                <div className="notificacion-header">
                                    <strong>
                                        De:{' '}
                                        {obtenerNombreRemitente(
                                            notificacion.remitente
                                        )}
                                    </strong>

                                    <span>
                                        {formatearFecha(
                                            notificacion.fechaHoraCreacion
                                        )}
                                    </span>
                                </div>

                                <p>
                                    {notificacion.mensaje}
                                </p>

                                <button
                                    type="button"
                                    className="btn-marcar-leida"
                                    onClick={() =>
                                        handleMarcarLeida(
                                            notificacion.id
                                        )
                                    }
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
                <h3>
                    Leídas ({leidas.length})
                </h3>

                {leidas.length === 0 ? (
                    <p>
                        No hay notificaciones en el historial.
                    </p>
                ) : (
                    <div className="notificaciones-lista">
                        {leidas.map((notificacion) => (
                            <div
                                key={notificacion.id}
                                className="notificacion-card leida"
                            >
                                <div className="notificacion-header">
                                    <strong>
                                        De:{' '}
                                        {obtenerNombreRemitente(
                                            notificacion.remitente
                                        )}
                                    </strong>

                                    <span>
                                        {formatearFecha(
                                            notificacion.fechaHoraCreacion
                                        )}
                                    </span>
                                </div>

                                <p>
                                    {notificacion.mensaje}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default NotificacionesPage;