import { notificacionMapper } from "../middlewares/mappers/notificacionMapper.js"

export class NotificacionController{
    
    constructor(notificacionService) {
        this.notificacionService = notificacionService
    }

    mostrarNotificaciones = async (req, res) => {
        const { idUsuario } = req.params
        const { leidas } = req.query

        const notificaciones = await this.notificacionService.mostrarNotificaciones({ idUsuario, leidas })
        res.status(200).json(notificaciones.map(n => notificacionMapper.notificacionToDTO(n)))
    }


    marcarComoLeida = async (req, res) => {

        const { idUsuario, idNotificacion } = req.params

        const notificacion = await this.notificacionService.marcarComoLeida({ idUsuario, idNotificacion })
        res.status(200).json(notificacionMapper.notificacionToDTO(notificacion))

    }
}
