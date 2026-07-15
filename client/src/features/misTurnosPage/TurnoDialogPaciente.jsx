import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Stack,
    Alert,
    IconButton,
    CircularProgress,
    Box,
    TextField
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { turnosService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './TurnoDialogPaciente.css';

export default function TurnoDialogPaciente({
    open,
    turno,
    onClose,
    onTurnoActualizado
}) {
    const { user } = useAuth() 
    const [errorApi, setErrorApi] = useState(null)
    const [loading, setLoading] = useState(false)
    
    // Estados para Cancelación
    const [mostrandoCancelar, setMostrandoCancelar] = useState(false)
    const [motivoCancelacion, setMotivoCancelacion] = useState('')

    // Estados para Reprogramación
    const [mostrandoReprogramar, setMostrandoReprogramar] = useState(false)
    const [nuevaFechaHora, setNuevaFechaHora] = useState('')

    useEffect(() => {
        setErrorApi(null)
        setLoading(false)
        setMostrandoCancelar(false)
        setMotivoCancelacion('')
        setMostrandoReprogramar(false)
        setNuevaFechaHora('')
    }, [turno])

    if (!turno) return null

    const esReservado = turno.estado === 'RESERVADO'
    const tienePropuestaCambio = !!turno.fechaHoraPropuesta

    // 1. El paciente acepta la propuesta del médico
    const handleAceptarPropuesta = async () => {
        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.confirmarTurno(turno.id, user.id)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            setErrorApi(error.response?.data?.message || "No se pudo confirmar la reprogramación.")
        } finally {
            setLoading(false)
        }
    }

    // 2. El paciente rechaza la propuesta del médico
    const handleRechazarPropuesta = async () => {
        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.rechazarCambioFecha(turno.id, user.id)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            setErrorApi(error.response?.data?.message || "No se pudo rechazar la reprogramación.")
        } finally {
            setLoading(false)
        }
    }

    // 3. Confirmar la cancelación
    const handleConfirmarCancelacion = async () => {
        if (!motivoCancelacion.trim()) {
            setErrorApi("Por favor, ingresá un motivo para cancelar el turno.")
            return
        }
        try {
            setLoading(true)
            setErrorApi(null)
            await turnosService.cancelar(turno.id, user.id, motivoCancelacion)
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            console.error("Error al cancelar el turno:", error)
            setErrorApi(error.message || "No se pudo cancelar el turno.")
        } finally {
            setLoading(false)
        }
    }

    // 4. Confirmar propuesta de cambio de fecha (Paciente -> Médico)
    const handleConfirmarReprogramacion = async () => {
        if (!nuevaFechaHora) {
            setErrorApi("Por favor, seleccioná una fecha y hora válidas.")
            return
        }
        try {
            setLoading(true)
            setErrorApi(null)
            
            // Convertimos el string simple del input local a un ISO String real (ej. '2026-07-15T16:16:00.000Z')
            const fechaISO = new Date(nuevaFechaHora).toISOString();
            
            // Enviamos la fecha formateada correctamente
            await turnosService.proponerCambioFecha(turno.id, user.id, fechaISO)
            
            if (onTurnoActualizado) onTurnoActualizado()
            onClose()
        } catch (error) {
            console.error("Error al proponer cambio de fecha:", error)
            setErrorApi(error.message || "No se pudo registrar la propuesta de reprogramación.")
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
            <DialogTitle className="turno-dialog-title-paciente">
                Detalles de tu Turno
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
                            Médico / Profesional
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {turno.medico?.usuario?.nombre || turno.medico?.nombre || 'Profesional de la Salud'}
                        </Typography>
                    </Box>

                    <Typography>
                        <strong>Especialidad/Práctica:</strong> {turno.servicio?.nombre}
                    </Typography>

                    <Typography>
                        <strong>Fecha Programada:</strong> {fechaOriginalFormateada}
                    </Typography>

                    <Typography>
                        <strong>Estado:</strong> {turno.estado}
                    </Typography>

                    {/* Alerta si el médico propuso un cambio */}
                    {tienePropuestaCambio && (
                        <Box sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '12px' }}>
                            <Typography variant="subtitle2" sx={{ color: '#d35400', fontWeight: 'bold' }}>
                                ⚠️ PROPUESTA DE REPROGRAMACIÓN
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                El profesional médico ha propuesto reprogramar este turno para el: <br />
                                <strong>{fechaPropuestaFormateada}</strong>
                            </Typography>
                        </Box>
                    )}

                    {/* Formulario de Cancelación */}
                    {mostrandoCancelar && (
                        <Box sx={{ p: 2, bgcolor: '#fdf3f2', border: '1px dashed #f5b7b1', borderRadius: '12px', mt: 1 }}>
                            <Typography variant="subtitle2" sx={{ color: '#c0392b', fontWeight: 'bold', mb: 1 }}>
                                Cancelación de Turno
                            </Typography>
                            <TextField
                                fullWidth
                                label="Motivo de la cancelación"
                                variant="outlined"
                                size="small"
                                multiline
                                rows={2}
                                value={motivoCancelacion}
                                onChange={(e) => setMotivoCancelacion(e.target.value)}
                                disabled={loading}
                                placeholder="Escribí acá el motivo..."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'white' } }}
                            />
                        </Box>
                    )}

                    {/* Formulario de Reprogramación */}
                    {mostrandoReprogramar && (
                        <Box sx={{ p: 2, bgcolor: '#ebf5fb', border: '1px dashed #aed6f1', borderRadius: '12px', mt: 1 }}>
                            <Typography variant="subtitle2" sx={{ color: '#2980b9', fontWeight: 'bold', mb: 1.5 }}>
                                Proponer Nueva Fecha y Hora
                            </Typography>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                variant="outlined"
                                size="small"
                                value={nuevaFechaHora}
                                onChange={(e) => setNuevaFechaHora(e.target.value)}
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'white' } }}
                            />
                        </Box>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions className="turno-dialog-actions">
                {tienePropuestaCambio ? (
                    /* CASO A: Hay una propuesta de cambio de fecha activa */
                    turno.ultimoRemitenteId !== user.id ? (
                        <Stack direction="row" spacing={1.5}>
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
                                Aceptar Nueva Fecha
                            </Button>
                        </Stack>
                    ) : (
                        /* Si el paciente fue el que solicitó el cambio, solo ve el botón de cerrar */
                        <Stack direction="row" spacing={1.5} width="100%" justifyContent="flex-end">
                            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mr: 2, italic: true }}>
                                Esperando confirmación del profesional...
                            </Typography>
                            <Button variant="contained" onClick={onClose} className="turno-btn" sx={{ backgroundColor: '#418B18 !important', color: 'white !important', '&:hover': { backgroundColor: '#326d11 !important' } }}>
                                Cerrar
                            </Button>
                        </Stack>
                    )
                ) : (
                    /* CASO B: Turno normal */
                    <Stack direction="row" spacing={1.5} width="100%" justifyContent="flex-end">
                        
                        {/* Estado Normal (Sin formularios abiertos) */}
                        {!mostrandoCancelar && !mostrandoReprogramar && esReservado && (
                            <>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelOutlinedIcon />}
                                    onClick={() => setMostrandoCancelar(true)}
                                    className="turno-btn"
                                >
                                    Cancelar Turno
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<CalendarMonthIcon />}
                                    onClick={() => setMostrandoReprogramar(true)}
                                    className="turno-btn"
                                    sx={{ color: '#2980b9', borderColor: '#2980b9', '&:hover': { borderColor: '#1f618d', backgroundColor: '#ebf5fb' } }}
                                >
                                    Pedir Reprogramación
                                </Button>
                                <Button variant="contained" onClick={onClose} className="turno-btn" sx={{ backgroundColor: '#418B18 !important', color: 'white !important', '&:hover': { backgroundColor: '#326d11 !important' } }}>
                                    Cerrar
                                </Button>
                            </>
                        )}

                        {/* Flujo de Cancelación Abierto */}
                        {mostrandoCancelar && (
                            <>
                                <Button
                                    variant="text"
                                    color="inherit"
                                    onClick={() => {
                                        setMostrandoCancelar(false);
                                        setMotivoCancelacion('');
                                    }}
                                    disabled={loading}
                                    className="turno-btn"
                                >
                                    Volver
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleConfirmarCancelacion}
                                    disabled={loading}
                                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                                    className="turno-btn"
                                >
                                    Confirmar Cancelación
                                </Button>
                            </>
                        )}

                        {/* Flujo de Reprogramación Abierto */}
                        {mostrandoReprogramar && (
                            <>
                                <Button
                                    variant="text"
                                    color="inherit"
                                    onClick={() => {
                                        setMostrandoReprogramar(false);
                                        setNuevaFechaHora('');
                                    }}
                                    disabled={loading}
                                    className="turno-btn"
                                >
                                    Volver
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleConfirmarReprogramacion}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
                                    className="turno-btn"
                                    sx={{ backgroundColor: '#2980b9 !important', color: 'white !important', '&:hover': { backgroundColor: '#1f618d !important' } }}
                                >
                                    Confirmar Propuesta
                                </Button>
                            </>
                        )}

                        {/* Botón de cerrar para turnos que no se pueden modificar (Historial) */}
                        {!esReservado && (
                            <Button variant="contained" onClick={onClose} className="turno-btn" sx={{ backgroundColor: '#418B18 !important', color: 'white !important', '&:hover': { backgroundColor: '#326d11 !important' } }}>
                                Cerrar
                            </Button>
                        )}
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    )
}