import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Stack,
    TextField,
    Alert,
    IconButton,
    CircularProgress,
    Box
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { turnosService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './TurnoDialog.css';

export default function TurnoDialog({
    open,
    turno,
    onClose,
    onTurnoActualizado
}) {
    const { user } = useAuth() 

    const [motivo, setMotivo] = useState('')
    const [nuevaFecha, setNuevaFecha] = useState('')

    const [errorMotivo, setErrorMotivo] = useState(false)
    const [errorFecha, setErrorFecha] = useState(false)
    
    const [errorApi, setErrorApi] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setMotivo('')
        setNuevaFecha('')
        setErrorMotivo(false)
        setErrorFecha(false)
        setErrorApi(null)
        setLoading(false)
    }, [turno])

    if (!turno) return null

    const esReservado = turno.estado === 'RESERVADO'

    const cancelarTurno = async () => {
        const motivoInvalido = !motivo.trim()
        setErrorMotivo(motivoInvalido)
        if (motivoInvalido) return

        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.cancelar(turno.id, user.id, motivo)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            setErrorApi(error.message || "Error al intentar cancelar el turno.")
        } finally {
            setLoading(false)
        }
    }

    const marcarRealizado = async () => {
        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.marcarComoRealizado(turno.id, user.id)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            setErrorApi(error.message || "No se pudo marcar el turno como realizado.")
        } finally {
            setLoading(false)
        }
    }

    const proponerCambio = async () => {
        const fechaInvalida = !nuevaFecha
        setErrorFecha(fechaInvalida)
        if (fechaInvalida) return

        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.proponerCambioFecha(turno.id, user.id, nuevaFecha)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            setErrorApi(error.response?.data?.message || "No se pudo proponer el cambio de fecha.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            classes={{ paper: 'turno-dialog-paper' }}
        >
            <DialogTitle className="turno-dialog-title">
                Detalles del Turno
                <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={2.5} mt={1}>
                    {errorApi && (
                        <Alert severity="error" onClose={() => setErrorApi(null)} sx={{ borderRadius: '12px' }}>
                            {errorApi}
                        </Alert>
                    )}

                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Paciente
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {turno.paciente?.nombre || 'Sin Nombre'}
                        </Typography>
                    </Box>

                    <Typography>
                        <strong>Práctica:</strong> {turno.servicio?.nombre}
                    </Typography>

                    <Typography>
                        <strong>Estado:</strong> {turno.estado}
                    </Typography>

                    {esReservado && (
                        <Stack spacing={2} className="turno-acciones-box">
                            <Typography variant="subtitle2" sx={{ color: '#2e5a27', fontWeight: 'bold' }}>
                                Acciones Médicas
                            </Typography>
                            <TextField
                                label="Motivo de cancelación (obligatorio si cancela)"
                                multiline
                                rows={2}
                                value={motivo}
                                disabled={loading}
                                onChange={(e) => {
                                    setMotivo(e.target.value)
                                    if (errorMotivo) setErrorMotivo(false)
                                }}
                                error={errorMotivo}
                                helperText={errorMotivo ? 'El motivo es obligatorio para cancelar' : ''}
                                fullWidth
                                className="turno-input-field"
                            />
                            
                            <TextField
                                label="Proponer nueva fecha"
                                type="datetime-local"
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                value={nuevaFecha}
                                onChange={(e) => {
                                    setNuevaFecha(e.target.value)
                                    if (errorFecha) setErrorFecha(false)
                                }}
                                error={errorFecha}
                                helperText={errorFecha ? 'Seleccioná una nueva fecha' : ''}
                                fullWidth
                                className="turno-input-field"
                            />
                        </Stack>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions className="turno-dialog-actions">
                {esReservado && (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Button
                            variant="outlined"
                            startIcon={<DateRangeIcon />}
                            onClick={proponerCambio}
                            disabled={loading}
                            className="turno-btn"
                        >
                            Proponer cambio
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelOutlinedIcon />}
                            onClick={cancelarTurno}
                            disabled={loading}
                            className="turno-btn"
                        >
                            Cancelar Turno
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
                            onClick={marcarRealizado}
                            disabled={loading}
                            className="turno-btn turno-btn-success"
                        >
                            {loading ? 'Procesando...' : 'Marcar Realizado'}
                        </Button>
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    )
}