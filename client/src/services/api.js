import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
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
    }
};

export default api;