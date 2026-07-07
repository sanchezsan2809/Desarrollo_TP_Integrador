import { Router } from "express";
import { NotificacionService } from "../services/notificacionService.js";
import { NotificacionController } from "../controllers/notificacionController.js";
import { validate } from "../middlewares/validate.js"
import {
    marcarComoLeidaSchema,
    mostrarNotificacionesSchema
} from "../schemas/requestsSchemas/notificacionRequestSchema.js"
import { MongoNotificacionRepository } from '../repositories/notificacionRepository.js'
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { usuarioMeRequestSchema } from "../schemas/requestsSchemas/usuarioRequestSchema.js";

const router=Router()

const notificacionRepository = new MongoNotificacionRepository()

const notificacionService = new NotificacionService(notificacionRepository)
const controller = new NotificacionController(notificacionService)

router.get(
    "/:idUsuario/notificaciones",
    validate(mostrarNotificacionesSchema),
    asyncHandler(controller.mostrarNotificaciones)
)

router.patch(
    "/:idUsuario/notificaciones/:idNotificacion",
    validate(marcarComoLeidaSchema),
    asyncHandler(controller.marcarComoLeida)
)

router.get(
    "/me",
    validate(usuarioMeRequestSchema),
    asyncHandler
)

export default router