import cron from "node-cron";
import { TurnoService } from "../services/turnoService.js";
import { MongoTurnoRepository } from "../repositories/turnoRepository.js";
import { MongoPacienteRepository } from "../repositories/pacienteRepository.js";
import { MongoMedicoRepository } from "../repositories/medicoRepository.js";
import { MongoNotificacionRepository } from "../repositories/notificacionRepository.js";
import { MongoSedeRepository } from "../repositories/sedeRepository.js";
import { MongoUsuarioRepository } from "../repositories/usuarioRepository.js";

export function iniciarGeneradorTurnos() {
    // Todos los días a las 00:05

    const turnoRepository = new MongoTurnoRepository()
    const pacienteRepository = new MongoPacienteRepository()
    const medicoRepository = new MongoMedicoRepository()
    const notificacionRepository = new MongoNotificacionRepository()
    const sedeRepository = new MongoSedeRepository()
    const usuarioRepository = new MongoUsuarioRepository()

    const turnoService = new TurnoService(
        turnoRepository, 
        pacienteRepository, 
        medicoRepository, 
        notificacionRepository, 
        sedeRepository,
        usuarioRepository)

    cron.schedule("5 0 * * *", async () => {
        console.log("[CRON] Generando turnos...");

        try {
            await turnoService.generarTurnosDisponibles();

            console.log("[CRON] Turnos generados correctamente");
        } catch (error) {
            console.error("[CRON] Error generando turnos:", error);
        }
    });
}