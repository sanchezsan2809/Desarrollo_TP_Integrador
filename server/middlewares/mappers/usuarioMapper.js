import { Usuario } from "../../domain/usuario.js"
class UsuarioMapper{
    mongoUsuarioToDomain(data){
        
        
        const usuario= new Usuario(
            data.id,
            data.keycloakId,
            data.nombreUsuario,
            data.nombre,
            data.apellido,
            data.email
        )
        usuario.id = data._id.toString()
        return usuario
    }

    usuarioToDto(usuario){
        return{
            keycloakId: usuario.keycloakId,
            nombreUsuario : usuario.nombreUsuario,
            nombre : `${usuario.nombre} ${usuario.apellido}`,
            email: usuario.email
        }
    }
}

export const usuarioMapper = new UsuarioMapper()