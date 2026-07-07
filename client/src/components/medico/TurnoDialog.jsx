import { useState, useEffect } from 'react'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Stack,
    TextField
} from '@mui/material'

import { turnosService } from '../../services/api'

import { useAuth } from '../../context/AuthContext'

export default function TurnoDialog({
    open,
    turno,
    onClose
}) {

    const [accionActiva, setAccionActiva] = useState(null)

    const [motivo, setMotivo] =
        useState('')

    const [nuevaFecha, setNuevaFecha] =
        useState('')

    const [errorMotivo,
        setErrorMotivo] =
        useState(false)

    const [errorFecha,
        setErrorFecha] =
        useState(false)

    useEffect(() => {

        setAccionActiva(null)
        setMotivo('')
        setNuevaFecha('')
        setErrorMotivo(false)
        setErrorFecha(false)

    }, [turno])

    if (!turno) return null

    const esReservado =
        turno.estado ===
        'RESERVADO'

    const cancelarTurno = () => {

        const motivoInvalido =
            !motivo.trim()

        setErrorMotivo(
            motivoInvalido
        )

        if (motivoInvalido)
            return

        console.log(
            'Cancelar turno',
            turno.id,
            motivo
        )

        onClose()
    }

    const marcarRealizado =
        () => {

        console.log(
            'Turno realizado',
            turno.id
        )

        onClose()
    }

    const proponerCambio =
        async () => {

        const fechaInvalida =
            !nuevaFecha

        setErrorFecha(
            fechaInvalida
        )

        if (fechaInvalida)
            return

        console.log(
            'Propuesta de cambio',
            turno.id,
            nuevaFecha
        )

        const { turnoModificado, notificacionEnviada} = 
           await turnosService.proponerCambioFecha(turno.id, authConte)



        onClose()
    }

    console.log(turno)

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Paciente: {turno.paciente.nombre}
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    mt={1}
                >

                    <Typography>
                        <strong>
                            Práctica:
                        </strong>{' '}
                        {turno.servicio.nombre}
                    </Typography>

                    <Typography>
                        <strong>
                            Estado:
                        </strong>{' '}
                        {turno.estado}
                    </Typography>

                    {esReservado && (
                        <>
                            <TextField
                                label="Motivo de cancelación"
                                multiline
                                rows={2}
                                value={motivo}
                                onChange={(e) => {

                                    setMotivo(
                                        e.target.value
                                    )

                                    if (
                                        errorMotivo
                                    ) {
                                        setErrorMotivo(
                                            false
                                        )
                                    }
                                }}

                                error={
                                    errorMotivo
                                }

                                helperText={
                                    errorMotivo
                                        ? 'El motivo es obligatorio'
                                        : ''
                                }
                                fullWidth
                            />
                            <TextField
                                label="Proponer nueva fecha"
                                type="datetime-local"

                                InputLabelProps={{
                                    shrink: true
                                }}

                                value={
                                    nuevaFecha
                                }

                                onChange={(e) => {

                                    setNuevaFecha(
                                        e.target.value
                                    )

                                    if (
                                        errorFecha
                                    ) {
                                        setErrorFecha(
                                            false
                                        )
                                    }
                                }}

                                error={
                                    errorFecha
                                }

                                helperText={
                                    errorFecha
                                        ? 'Seleccioná una nueva fecha'
                                        : ''
                                }

                                fullWidth
                            />
                        </>
                    )}

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cerrar
                </Button>

                {esReservado && (
                    <>
                        <Button
                            onClick={
                                proponerCambio
                            }
                        >
                            Proponer cambio
                        </Button>

                        <Button
                            color="error"
                            onClick={
                                cancelarTurno
                            }
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={
                                marcarRealizado
                            }
                        >
                            Marcar realizado
                        </Button>
                    </>
                )}

            </DialogActions>

        </Dialog>
    )
}