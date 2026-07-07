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
import { UsuarioController } from "../controllers/usuarioController.js";
import { UsuarioService } from "../services/usuarioService.js";
import { MongoUsuarioRepository } from "../repositories/usuarioRepository.js";

const router=Router()

const notificacionRepository = new MongoNotificacionRepository()
const notificacionService = new NotificacionService(notificacionRepository)
const notificacionController = new NotificacionController(notificacionService)

const usuarioRepository = new MongoUsuarioRepository()
const usuarioService = new UsuarioService(usuarioRepository)
const usuarioController = new UsuarioController(usuarioService)

router.get(
    "/:idUsuario/notificaciones",
    validate(mostrarNotificacionesSchema),
    asyncHandler(notificacionController.mostrarNotificaciones)
)

router.patch(
    "/:idUsuario/notificaciones/:idNotificacion",
    validate(marcarComoLeidaSchema),
    asyncHandler(notificacionController.marcarComoLeida)
)

router.get(
    "/me",
    validate(usuarioMeRequestSchema),
    asyncHandler(usuarioController.me)
)

export default router