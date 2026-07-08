import { usuarioMapper } from "../middlewares/mappers/usuarioMapper";

export class UsuarioController {

    constructor(usuarioService){
        this.usuarioService = usuarioService
    }

    me = async (req, res) => {
        const usuario =
            await this.usuarioService.obtenerUsuarioActual(
                req.auth.keycloakId
            );

        

        res.json(usuarioMapper.usuarioToDto(usuario));
    } 
    
    

}