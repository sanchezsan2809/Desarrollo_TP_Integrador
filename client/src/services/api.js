import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8081/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const turnosService = {
    buscarDisponibles: async ( idPaciente, filtrosFormulario, pagina = 1, limite = 10) => {
        try {
            const body = {
                idPaciente,
                ...filtrosFormulario 
            };

            const response = await api.post('/turnos/disponibles/busqueda', body, {
                params: {
                    page: pagina,
                    limit: limite
                }
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error en el sistema de turnos.');
        }
    },

    reservar: async (idTurno, pacienteId) => {
        try {
            const response = await api.patch(
                `/turnos/${idTurno}/reservar`,
                {
                    pacienteId
                }
            );

            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudo reservar el turno.");
        }
    },

    obtenerTurnosPaciente: async(
        pacienteId,
        filtros = {},
        pagina = 1,
        limite = 10
    ) => {

        try {

            const response = await api.get(
                `/paciente/${pacienteId}/turnos`,
                {
                    params: {
                        ...filtros,
                        page: pagina, 
                        limit: limite
                    }
                }
            )
            
            return response.data
        }catch(error){
            throw error.response?.data || new Error(
                "No se pudieron recuperar los turnos"
            )
        }
    },

    obtenerTurnosReservadosMedico: async(
        medicoId,
        filtros = {},
        pagina = 1,
        limite = 10
    ) =>{
        try{
            const response = await api.get(
                `/medico/${medicoId}/turnos`
            )

            return response.data
        }catch(error){
            throw error.response?.data || new Error(
                "No se pudieron recuperar los turnos del médico"
            )
        }
    },

    proponerCambioFecha: async(
        turnoId,
        usuarioId,
        nuevaFecha
    ) => {
        try{
            const { nuevoTurno, notificacionEnviada } = await api.post(
                `/turnos/${turnoId}/modificacionFecha`,
                {
                    idUsuario: usuarioId,
                    nuevaFecha: nuevaFecha
                }
            )

            return { nuevoTurno, notificacionEnviada }
        }catch(error){
            throw error.response || new Error(
                "No se pudo solicitar la modificación de la fecha del turno"
            )
        }
    },

    cancelar: async (idTurno, idUsuario, motivo) => {
        try {
            const response = await api.post(`/turnos/${idTurno}/cancelar`, {
                idUsuario,
                motivo
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudo cancelar el turno.");
        }
    },

    marcarComoRealizado: async (idTurno, idUsuario) => {
        try {
            const response = await api.patch(`/turnos/${idTurno}/realizado`, {
                idUsuario
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudo marcar el turno como realizado.");
        }
    }
    

};

export const usuariosService = {

    obtenerUsuarioActual: async (token) => {
        const response = await api.get("/usuario/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    }


}
export const notificacionesService = {
    obtenerNoLeidas: async (idUsuario) => {
        try {
            const response = await api.get(`/usuario/${idUsuario}/notificaciones`, {
                params: { leidas: false }
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudieron obtener las notificaciones.");
        }
    },

    obtenerLeidas: async (idUsuario) => {
        try {
            const response = await api.get(`/usuario/${idUsuario}/notificaciones`, {
                params: { leidas: true }
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudieron obtener las notificaciones.");
        }
    },

    marcarComoLeida: async (idUsuario, idNotificacion) => {
        try {
            const response = await api.patch(
                `/usuario/${idUsuario}/notificaciones/${idNotificacion}`
            );

            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudo marcar la notificación como leída.");
        }
    }
};

export const medicoService = {
    obtenerServicios: async (idMedico) => {
        try {
            const response = await api.get(`/medico/${idMedico}/servicios`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudieron obtener los servicios.");
        }
    },
    
    agregarServicio: async (idMedico, tipoServicio, nuevoServicio) => {
        try {
            const response = await api.post(`/medico/${idMedico}/servicios`, {
                tipoServicio: tipoServicio.toLowerCase(),
                nuevoServicioDTO: nuevoServicio 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudo agregar el servicio médico.");
        }
    },

    modificarServicio: async (idMedico, tipo, idServicio, servicioModificado) => {
        try {
            const response = await api.put(
                `/medico/${idMedico}/servicios/${tipo.toLowerCase()}/${idServicio}`,
                { 
                    ...servicioModificado,
                    id: String(servicioModificado.id), // Aseguramos formato string por Zod
                    ...(tipo.toLowerCase() === 'practica' && { codigo: `PRAC-${servicioModificado.id}` })
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudo modificar el servicio médico.");
        }
    },

    eliminarServicio: async (idMedico, tipo, idServicio) => {
        try {
            const response = await api.delete(
                `/medico/${idMedico}/servicios/${tipo.toLowerCase()}/${idServicio}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudo eliminar el servicio médico.");
        }
    },

    consultarDisponibilidades: async ({idMedico, tipoServicio, idServicio}) => {
        try {
            const response = await api.get(
                `/medico/${idMedico}/disponibilidades`,
                {
                    params: {
                        tipoServicio,
                        idServicio
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudieron obtener las disponibilidades.");
        }
    },

    modificarDisponibilidades: async (idMedico, arrayDisponibilidades) => {
        try {
            const bodyFormateado = arrayDisponibilidades.map(disp => {
                // Limpiamos acentos de forma segura por si acaso
                let diaLimpio = disp.diaSemana
                    .toUpperCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remueve tildes
                    .trim();

                return {
                    diaSemana: diaLimpio, 
                    horaDesde: disp.horaDesde.trim(), // ej: "08:00"
                    horaHasta: disp.horaHasta.trim()  // ej: "12:00"
                };
            });

            const response = await api.patch(`/medico/${idMedico}/disponibilidades`, {
                nuevasDisponibilidadesDTO: bodyFormateado
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error("No se pudieron modificar las disponibilidades.");
        }
    }
};

export default api;