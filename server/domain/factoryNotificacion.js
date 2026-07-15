import { Notificacion } from "./notificacion.js";
import { estrategiasNotificacion } from "./estrategiasNotificacion.js";

class FactoryNotificacion {
    
    constructor(){
        this.estrategias = estrategiasNotificacion
    }

    crearSegunEstadoTurno(turno) {   
        // 1. Caso: Hay una propuesta de cambio de fecha activa pendiente de confirmación
        if (turno.fechaHoraPropuesta) {
            const remitente = turno.remitenteUltimoCambioEstado();
            const destinatario = turno.destinatarioUltimoCambioEstado();
            const fechaFormateada = turno.fechaHoraPropuesta.toLocaleString('es-AR', {
                dateStyle: 'short',
                timeStyle: 'short'
            });

            return new Notificacion(
                turno.id,
                destinatario,
                remitente,
                `Se solicitó modificar la fecha del turno para el día ${fechaFormateada} Esperando confirmación.`
            );
        }

        // 2. Caso: Se acaba de rechazar un cambio de fecha (evaluamos el historial de estados)
        const ultimoCambio = turno.historialEstados.at(-1);
        if (ultimoCambio && ultimoCambio.motivo === "Cambio de fecha rechazado") {
            const remitente = ultimoCambio.usuario;
            const destinatario = (turno.paciente.usuario.id === remitente.id) 
                ? turno.medico.usuario 
                : turno.paciente.usuario;

            return new Notificacion(
                turno.id,
                destinatario,
                remitente,
                `La propuesta de modificación de fecha para el turno de ${turno.servicio.nombre} ha sido rechazada.`
            );
        }

        // 3. Flujo normal basado en el estado
        const estrategia = estrategiasNotificacion[turno.estado];
        if(!estrategia){
            throw new Error("No hay cambios en el turno para notificar")
        }

        return estrategia(turno)
    }
    
    crearRecordatorio(turno) {
        const mensajeBase = `Recordatorio: Mañana tiene un turno agendado a las ${turno.fechaHora.toLocaleTimeString()}`;

        return [
            new Notificacion(turno.id, turno.paciente.usuario, turno.paciente.usuario, mensajeBase),
            new Notificacion(turno.id, turno.medico.usuario, turno.medico.usuario, mensajeBase)
        ];
    }
}

export const factoryNotificacion = new FactoryNotificacion()