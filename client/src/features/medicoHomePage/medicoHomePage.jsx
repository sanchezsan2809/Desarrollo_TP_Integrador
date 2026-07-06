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

export default function MedicoDashboard() {

    const navigate = useNavigate()

    const [turnos, setTurnos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function cargarTurnos(){

            try {

                const respuesta = 
                    await turnosService.ob
            }
        }
    })

    const eventos =
        convertirTurnosAgenda(turnos)

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

                <AgendaCalendar />
            </Paper>
        
    )
}