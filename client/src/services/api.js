import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const turnosService = {
    buscarDisponibles: async (filtrosFormulario, pagina = 1, limite = 10) => {
        try {
            const body = {
                idPaciente: "654321abcdef1234567890ab",
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

    obtenerTurnosMedico: async(
        
    )

};

export default api;