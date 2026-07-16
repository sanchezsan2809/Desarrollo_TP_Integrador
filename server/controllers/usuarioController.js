import { usuarioMapper } from "../middlewares/mappers/usuarioMapper.js";

export class UsuarioController {

    constructor(usuarioService){
        this.usuarioService = usuarioService
    }

    me = async (req, res) => {
        const { usuario, rol, perfilId} =
            await this.usuarioService.obtenerUsuarioActual(
                req.auth.keycloakId
            );

        const data = {
            usuario: usuarioMapper.usuarioToDto(usuario),
            rol: rol,
            perfilId: perfilId
        }

        res.status(200).json(data)
    } 
    
    

}