import { Usuario } from "../../domain/usuario.js"
class UsuarioMapper{
    mongoUsuarioToDomain(data){
        return new Usuario({
            id: data._id?.toString() ?? data.id,
            keycloakId: data.keycloakId,
            nombreUsuario: data.nombreUsuario,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email
        })
    }

    usuarioToDto(usuario){
        return{
            id: usuario.id ?? usuario._id?.toString(),
            keycloakId: usuario.keycloakId,
            nombreUsuario : usuario.nombreUsuario,
            nombre : `${usuario.nombre} ${usuario.apellido}`,
            email: usuario.email
        }
    }
}

export const usuarioMapper = new UsuarioMapper()