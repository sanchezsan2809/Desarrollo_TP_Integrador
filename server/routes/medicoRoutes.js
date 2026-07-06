import { Router } from 'express'
import { MedicoController } from '../controllers/medicoController.js'
import { MedicoService } from "../services/medicoService.js"
import { MongoMedicoRepository } from '../repositories/medicoRepository.js'
import { MongoTurnoRepository } from '../repositories/turnoRepository.js'
import { validate} from '../middlewares/validate.js'
import { consultarDisponibilidadSchema, 
        modificarDisponibilidadSchema,
        agregarServicioSchema,
        eliminarServicioSchema,
        modificarServicioSchema,
        consultarTurnosSchema
} from '../schemas/requestsSchemas/medicoRequestSchema.js'
import { TurnoService } from '../services/turnoService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const router = Router()

const medicoRepository = new MongoMedicoRepository()
const turnoRepository = new MongoTurnoRepository()

const turnoService = new TurnoService(turnoRepository)

const service = new MedicoService(medicoRepository, turnoRepository, turnoService)
const controller = new MedicoController(service)


router.get(
    "/:id/turnos",
    validate(consultarTurnosSchema),
    asyncHandler()
)

router.get(
    "/:id/disponibilidades",
    validate(consultarDisponibilidadSchema),
    asyncHandler(controller.consultarDisponibilidades)
)


router.patch(
    "/:id/disponibilidades",
    validate(modificarDisponibilidadSchema),
    asyncHandler(controller.modificarDisponibilidades)
)

router.post(
    "/:idMedico/servicios",
    validate(agregarServicioSchema),
    asyncHandler(controller.agregarServicio)
)

router.delete(
    "/:idMedico/servicios/:tipo/:idServicio",
    validate(eliminarServicioSchema),
    asyncHandler(controller.eliminarServicio)
)

router.put(
    "/:idMedico/servicios/:tipo/:idServicio",
    validate(modificarServicioSchema),
    asyncHandler(controller.modificarServicio)
)

//TODO Implementar búsqueda de turnos reservados del médico

export default router
