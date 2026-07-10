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
    Alert
} from '@mui/material'

import { turnosService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

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
        >
            <DialogTitle>
                Paciente: {turno.paciente?.nombre || 'Sin Nombre'}
            </DialogTitle>

            <DialogContent>
                <Stack
                    spacing={2}
                    mt={1}
                >
                    {/* Alerta visible si el backend rechaza la operación */}
                    {errorApi && (
                        <Alert severity="error" onClose={() => setErrorApi(null)}>
                            {errorApi}
                        </Alert>
                    )}

                    <Typography>
                        <strong>Práctica:</strong>{' '}
                        {turno.servicio?.nombre}
                    </Typography>

                    <Typography>
                        <strong>Estado:</strong>{' '}
                        {turno.estado}
                    </Typography>

                    {esReservado && (
                        <>
                            <TextField
                                label="Motivo de cancelación"
                                multiline
                                rows={2}
                                value={motivo}
                                disabled={loading}
                                onChange={(e) => {
                                    setMotivo(e.target.value)
                                    if (errorMotivo) setErrorMotivo(false)
                                }}
                                error={errorMotivo}
                                helperText={errorMotivo ? 'El motivo es obligatorio' : ''}
                                fullWidth
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
                            />
                        </>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cerrar
                </Button>

                {esReservado && (
                    <>
                        <Button
                            onClick={proponerCambio}
                            disabled={loading}
                        >
                            Proponer cambio
                        </Button>

                        <Button
                            color="error"
                            onClick={cancelarTurno}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={marcarRealizado}
                            disabled={loading}
                        >
                            Marcar realizado
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    )
}