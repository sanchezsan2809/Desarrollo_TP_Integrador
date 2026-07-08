import cron from "node-cron"
import { factoryNotificacion } from "../domain/factoryNotificacion.js"
import { MongoTurnoRepository } from "../repositories/turnoRepository.js"
import { MongoNotificacionRepository } from "../repositories/notificacionRepository.js"

const turnoRepository = new MongoTurnoRepository()
const notificacionRepository = new MongoNotificacionRepository()

export async function ejecutarRecordatorioJob() {
    const turnos = await turnoRepository.obtenerTurnosDelDiaSiguiente()

    for (const turno of turnos) {
        const notificaciones = factoryNotificacion.crearRecordatorio(turno)

        await Promise.all(
            notificaciones.map(notificacion =>
                notificacionRepository.save(notificacion)
            )
        )
    }

    console.log(`🔔 Recordatorios enviados para ${turnos.length} turno(s)`)
}

export function iniciarRecordatorioJob() {
    cron.schedule("0 8 * * *", () => {
        ejecutarRecordatorioJob().catch(error => {
            console.error("Error en job de recordatorios:", error)
        })
    })
}
