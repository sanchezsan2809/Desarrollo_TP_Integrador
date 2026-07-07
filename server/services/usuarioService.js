export class UsuarioService {
    constructor(usuarioRepository){
        this.usuarioRepository = usuarioRepository
    }

    async obtenerUsuarioActual(keycloakId) {

        return this.usuarioRepository
            .findByKeycloakIdOrThrow(keycloakId);
    }
}

