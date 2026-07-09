import { MedicoNotFoundError, PacienteNotFoundError } from "../errors/appError.js";

export class UsuarioService {
    constructor(usuarioRepository, medicoRepository, pacienteRepository){
        this.usuarioRepository = usuarioRepository
        this.medicoRepository = medicoRepository
        this.pacienteRepository = pacienteRepository
    }

    async obtenerUsuarioActual(keycloakId) {

        const usuario = await this.usuarioRepository.findByKeycloakIdOrThrow(keycloakId); 

        let medico = null
        try {
            medico = await this.medicoRepository.findByUser(usuario.id)
        } catch (error) {
            if (!(error instanceof MedicoNotFoundError)) {
                throw error
            }
        }

        if(medico){
            return {
                usuario,
                rol: "MEDICO",
                perfilId: medico.id
            }
        }

        let paciente = null
        try {
            paciente = await this.pacienteRepository.findByUser(usuario.id)
        } catch (error) {
            if (!(error instanceof PacienteNotFoundError)) {
                throw error
            }
        }

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

