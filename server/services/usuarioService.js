export class UsuarioService {
    constructor(usuarioRepository, medicoRepository, pacienteRepository){
        this.usuarioRepository = usuarioRepository
        this.medicoRepository = medicoRepository
        this.pacienteRepository = pacienteRepository
    }

    async obtenerUsuarioActual(keycloakId) {

        const usuario = await this.usuarioRepository.findByKeycloakIdOrThrow(keycloakId); 

        const medico = await this.medicoRepository.findByUser(usuario.id)

        if(medico){
            return {
                usuario,
                rol: "MEDICO",
                perfilId: medico.id
            }
        }

        const paciente = await this.pacienteRepository.findByUser(usuario.id)

        if(paciente){
            return {
                usuario, 
                rol: "PACIENTE",
                perfilId: paciente.id
            }
        }

        return this.usuarioRepository
            .findByKeycloakIdOrThrow(keycloakId);
    }
}

