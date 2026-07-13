import {
    Paper,
    CircularProgress,
    Box,
    Container
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import AgendaCalendar from '../../components/calendar/AgendaCalendar'
import { useEffect, useState } from 'react'
import { turnosService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import TurnoDialog from '../../components/medico/TurnoDialog'

export default function MedicoAgendaPage() {
    const navigate = useNavigate()
    const [turnos, setTurnos] = useState([])
    const [estado, setEstado] = useState("RESERVADO")
    const [loading, setLoading] = useState(true)
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)

    const { user } = useAuth();

    useEffect(() => {
        async function cargarTurnos(){
            try {
                const respuesta = await turnosService.obtenerTurnosReservadosMedico(
                    user?.id || user?.perfilId 
                );
                setTurnos(respuesta.data || [])
            } catch(e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        cargarTurnos()
    }, [estado])

    const eventosCalendario = turnos.map(turno => {
        const inicio = new Date(turno.fechaHora);
        const fin = new Date(inicio.getTime() + turno.servicio.duracionTurnoEnMins * 60000);
        return {
            ...turno,
            title: turno.servicio.nombre,
            start: inicio,
            end: fin
        };
    });

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: '24px',
                    backgroundColor: '#dfead9',
                }}
            >
                <Box 
                    sx={{ 
                        backgroundColor: '#ffffff', 
                        p: 3, 
                        borderRadius: '16px',
                        boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)',
                        overflow: 'hidden'
                    }}
                >
                    <AgendaCalendar
                        turnos={eventosCalendario}
                        onSelectTurno={setTurnoSeleccionado}    
                    />
                </Box>

            </Paper>

            <TurnoDialog
                open={Boolean(turnoSeleccionado)}
                turno={turnoSeleccionado}
                onClose={() => setTurnoSeleccionado(null)}
            />
        </Container>
    )
}