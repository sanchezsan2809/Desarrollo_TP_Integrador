import {
    Paper,
    Typography,
    Button,
    Stack
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import AgendaCalendar from '../../components/calendar/AgendaCalendar'
import { useEffect } from 'react'
import { turnosService } from '../../services/api'
import { useState } from 'react'
import { SEED_IDS } from '../../mockdata/seedIDs'
import {
    CircularProgress,
    Box
} from "@mui/material";
import { useAuth } from '../../context/AuthContext'
import TurnoDialog from '../../components/medico/TurnoDialog'

export default function MedicoDashboard() {

    const navigate = useNavigate()

    const [turnos, setTurnos] = useState([])
    const [estado, setEstado] = useState("RESERVADO")
    const [loading, setLoading] = useState(true)
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)

    const { user } = useAuth();

    useEffect(() => {
            async function cargarTurnos(){
    
                try {
    
                    

                    const respuesta =
                        await turnosService.obtenerTurnosReservadosMedico(
                            user.perfilId
                        );
    
                    console.log("Respuesta:", respuesta);
                    console.log("¿Es array?", Array.isArray(respuesta));
                    console.log("respuesta.data:", respuesta.data);
                    console.log("¿data es array?", Array.isArray(respuesta.data));
    
                        setTurnos(respuesta.data)
    
                }catch(e){
                    console.error(e)
                }finally{
                    
                    setLoading(false)
                }
            }
            cargarTurnos()
        }
    , [estado])

    const eventosCalendario = turnos.map(turno => {

        const inicio = new Date(turno.fechaHora);

        const fin = new Date(
            inicio.getTime() +
            turno.servicio.duracionTurnoEnMins * 60000
        );

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
        
            <Paper
                sx={{
                    p: 4,
                    borderRadius: '24px',
                    backgroundColor: '#dfead9'
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ 
                        fontFamily: '"Sour Gummy", sans-serif',
                        borderRadius: '18px',
                        textTransform: 'none',
                        mb: 2
                    }}
                >
                    Agenda
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    ...
                </Stack>

                    

                <AgendaCalendar
                    turnos={eventosCalendario}

                    onSelectTurno={setTurnoSeleccionado}    
                />

            <TurnoDialog
                open={Boolean(turnoSeleccionado)}
                turno={turnoSeleccionado}
                onClose={() => setTurnoSeleccionado(null)}
            />

            Con eso:
            </Paper>
        
    )
}