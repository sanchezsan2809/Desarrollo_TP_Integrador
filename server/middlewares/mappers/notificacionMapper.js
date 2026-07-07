import { Notificacion } from "../../domain/notificacion.js";
import { usuarioMapper } from "./usuarioMapper.js";
import { MongoUsuarioRepository } from "../../repositories/usuarioRepository.js";

class NotificacionMapper{
    constructor(usuarioRepository,usuarioMapper){
        this.usuarioRepository = usuarioRepository
        this.usuarioMapper = usuarioMapper
    }

   async mongoNotificacionToDomain(data){
    // findById ya devuelve un Usuario de dominio, no hace falta volver a mapear
    const usuarioDestinatario = await this.usuarioRepository.findById(data.destinatario)
    const usuarioRemitente = await this.usuarioRepository.findById(data.remitente)

    const notificacion = new Notificacion(
        data._id.toString(),
        usuarioDestinatario,
        usuarioRemitente,
        data.mensaje
    )
    notificacion.leida = data.leida
    notificacion.fechaHoraCreacion = data.fechaHoraCreacion
    notificacion.fechaHoraLeida = data.fechaHoraLeida


    return notificacion
}

    notificacionToDTO(notificacion){
        return{
            id: notificacion.id,
            destinatario : notificacion.destinatario.nombreUsuario,
            remitente : notificacion.remitente.nombreUsuario,
            mensaje : notificacion.mensaje,
            leida: notificacion.leida,
            fechaHoraCreacion: notificacion.fechaHoraCreacion,
            fechaHoraLeida: notificacion.fechaHoraLeida
        }
    }

    notificacionToMongo(notificacion) {
        return {
            destinatario:
                notificacion.destinatario.id,

            remitente:
                notificacion.remitente.id,

            mensaje:
                notificacion.mensaje,

            fechaHoraCreacion:
                notificacion.fechaHoraCreacion,

            fechaHoraLeida:
                notificacion.fechaHoraLeida,

            leida: notificacion.leida
        }
    }

}
const usuarioRepository = new MongoUsuarioRepository()

export const notificacionMapper= new NotificacionMapper(usuarioRepository,usuarioMapper)