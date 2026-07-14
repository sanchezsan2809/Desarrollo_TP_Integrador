import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react';

import { notificacionesService } from '../services/api';
import { useAuth } from './AuthContext';

const NotificacionesContext = createContext(null);

export function NotificacionesProvider({ children }) {
    const { user } = useAuth();

    const idUsuario = user?.id;

    const [noLeidas, setNoLeidas] = useState([]);

    const recargarNotificaciones = useCallback(async () => {
        if (!idUsuario) {
            setNoLeidas([]);
            return;
        }

        try {
            const respuesta =
                await notificacionesService.obtenerNoLeidas(
                    idUsuario
                );

            const notificaciones = Array.isArray(respuesta)
                ? respuesta
                : respuesta?.data ??
                  respuesta?.notificaciones ??
                  [];

            setNoLeidas(notificaciones);
        } catch (error) {
            console.error(
                'Error al cargar las notificaciones:',
                error
            );

            setNoLeidas([]);
        }
    }, [idUsuario]);

    useEffect(() => {
        if (!idUsuario) {
            setNoLeidas([]);
            return;
        }

        recargarNotificaciones();

        const intervalId = setInterval(
            recargarNotificaciones,
            5000
        );

        return () => {
            clearInterval(intervalId);
        };
    }, [idUsuario, recargarNotificaciones]);

    const quitarNotificacionNoLeida = (idNotificacion) => {
        setNoLeidas((notificacionesActuales) =>
            notificacionesActuales.filter(
                (notificacion) =>
                    notificacion.id !== idNotificacion
            )
        );
    };

    return (
        <NotificacionesContext.Provider
            value={{
                noLeidas,
                cantidadSinLeer: noLeidas.length,
                recargarNotificaciones,
                quitarNotificacionNoLeida
            }}
        >
            {children}
        </NotificacionesContext.Provider>
    );
}

export function useNotificaciones() {
    const contexto = useContext(NotificacionesContext);

    if (!contexto) {
        throw new Error(
            'useNotificaciones debe utilizarse dentro de NotificacionesProvider'
        );
    }

    return contexto;
}