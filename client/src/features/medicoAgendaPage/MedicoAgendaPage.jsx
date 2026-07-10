import {
    Paper,
    Typography,
    Button,
    Stack
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import AgendaCalendar from '../../components/medico/AgendaCalendar'

export default function MedicoAgendaPage() {

    const navigate = useNavigate()

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