export default function TurnoDialog({
    open,
    turno,
    onClose,
    onCambioPropuesto
}) {
    const proponerCambio = async () => {

        const fechaInvalida = !nuevaFecha;

        setErrorFecha(fechaInvalida);

        if (fechaInvalida)
            return;

        try {

            const resultado =
                await turnosService.proponerCambioFecha(
                    turno.id,
                    user.id, // o el usuario logueado
                    nuevaFecha
                );

            onCambioPropuesto(resultado);

            onClose();

        } catch (error) {
            console.error(error);
        }
    }

    return (
        < Card sx={{ mt: 2 }}>
            <CardContent>

                <Typography variant="h6">
                    Cambio de fecha propuesto
                </Typography>

                <Typography>
                    Nuevo turno:
                </Typography>

                <Typography>
                    {nuevoTurno.fechaHora}
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    Se envió la siguiente notificación:
                </Typography>

                <Typography color="text.secondary">
                    {notificacionEnviada.mensaje}
                </Typography>

            </CardContent>
        </Card >
    )
}