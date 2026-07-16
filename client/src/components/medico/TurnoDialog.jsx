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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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
    console.log("Usuario del AuthContext:", user)
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
    const tienePropuestaCambio = !!turno.fechaHoraPropuesta

    // --- ACCIONES DE PROPUESTAS ---
    const handleAceptarPropuesta = async () => {
        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.confirmarTurno(turno.id || turno._id, user.usuario.id)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            setErrorApi(error.response?.data?.message || "No se pudo aceptar la reprogramación.")
        } finally {
            setLoading(false)
        }
    }

    const handleRechazarPropuesta = async () => {
        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.rechazarCambioFecha(turno.id || turno._id, user.usuario.id)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            setErrorApi(error.response?.data?.message || "No se pudo rechazar la reprogramación.")
        } finally {
            setLoading(false)
        }
    }

    // --- ACCIONES MÉDICAS STANDARD ---
    const cancelarTurno = async () => {
        const motivoInvalido = !motivo.trim()
        setErrorMotivo(motivoInvalido)
        if (motivoInvalido) return

        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.cancelar(turno.id || turno._id, user.usuario.id, motivo)
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
            await turnosService.marcarComoRealizado(turno.id || turno._id, user.usuario.id)
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
            const fechaISO = new Date(nuevaFecha).toISOString();
            await turnosService.proponerCambioFecha(turno.id || turno._id, user.usuario.id, fechaISO)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            setErrorApi(error.response?.data?.message || "No se pudo proponer el cambio de fecha.")
        } finally {
            setLoading(false)
        }
    }

    // Formatear fechas legibles
    const fechaOriginalFormateada = new Date(turno.fechaHora).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
    const fechaPropuestaFormateada = tienePropuestaCambio 
        ? new Date(turno.fechaHoraPropuesta).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) 
        : null

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
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}>
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
                        <strong>Fecha Original:</strong> {fechaOriginalFormateada}
                    </Typography>

                    <Typography>
                        <strong>Estado:</strong> {turno.estado}
                    </Typography>

                    {/* SECCIÓN VISUAL DE PROPUESTA PENDIENTE */}
                    {tienePropuestaCambio && (
                        <Box sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '12px' }}>
                            <Typography variant="subtitle2" sx={{ color: '#d35400', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                ⚠️ PROPUESTA DE CAMBIO PENDIENTE
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {turno.ultimoRemitenteId === user.usuario.id ? (
                                    <>Propusiste mover el turno al: <strong>{fechaPropuestaFormateada}</strong></>
                                ) : (
                                    <>El paciente solicitó mover el turno al: <strong>{fechaPropuestaFormateada}</strong></>
                                )}
                            </Typography>
                        </Box>
                    )}

                    {/* Solo mostramos los inputs tradicionales si NO hay una propuesta esperando */}
                    {esReservado && !tienePropuestaCambio && (
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
                {tienePropuestaCambio ? (
                    /* CASO A: Hay una propuesta de cambio activa */
                    turno.ultimoRemitenteId !== user.usuario.id ? (
                        // El cambio lo inició el paciente -> El médico lo puede responder
                        <Stack direction="row" spacing={1.5} width="100%" justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<HighlightOffIcon />}
                                onClick={handleRechazarPropuesta}
                                disabled={loading}
                                className="turno-btn"
                            >
                                Rechazar Cambio
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
                                onClick={handleAceptarPropuesta}
                                disabled={loading}
                                className="turno-btn"
                                sx={{ backgroundColor: '#e67e22 !important', '&:hover': { backgroundColor: '#d35400 !important' } }}
                            >
                                Aceptar Cambio
                            </Button>
                        </Stack>
                    ) : (
                        // El cambio lo inició el médico -> Solo ve botón para cerrar
                        <Stack direction="row" spacing={1.5} width="100%" justifyContent="flex-end">
                            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mr: 2, fontStyle: 'italic' }}>
                                Esperando confirmación del paciente...
                            </Typography>
                            <Button variant="contained" onClick={onClose} className="turno-btn" sx={{ backgroundColor: '#418B18 !important', color: 'white !important', '&:hover': { backgroundColor: '#326d11 !important' } }}>
                                Cerrar
                            </Button>
                        </Stack>
                    )
                ) : (
                    /* CASO B: Turno normal (Acciones estándar) */
                    esReservado && (
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
                                sx={{ backgroundColor: '#418B18 !important', '&:hover': { backgroundColor: '#326d11 !important' } }}
                            >
                                Marcar Realizado
                            </Button>
                        </Stack>
                    )
                )}
            </DialogActions>
        </Dialog>
    )
}