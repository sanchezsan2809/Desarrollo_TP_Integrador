import {
    BadRequestError
} from "../errors/appError.js";

//TODO Implementar EntityFinder para centralizar búsquedas en repositorios

export class MedicoService {
    constructor(medicoRepository, turnoRepository, turnoService) {
        this.medicoRepository = medicoRepository
        this.turnoRepository = turnoRepository
        this.turnoService = turnoService 
    }

    async obtenerTurnosReservados({ idMedico, idPaciente, page, limit}) {
        const { turnos, total, totalPages } = await this.turnoRepository.findAll({
            filtros: { 
                medicoId: idMedico, 
                pacienteId: idPaciente,
                estado: "RESERVADO" 
            },
            page, 
            limit
        })

        return {
            turnos,
            totalPages,
            total
        }

    }

    async consultarDisponibilidades({ idMedico, tipoServicio, idServicio }) {
        const medico = await this.medicoRepository.findById(idMedico);

        if (tipoServicio && idServicio) {
            if (!medico.puedeHacerServicio(idServicio, tipoServicio)) {
                throw new BadRequestError(
                    "El médico no realiza esta práctica o especialidad"
                );
            }

            const servicio = medico.buscarServicio(idServicio, tipoServicio);

            return medico.disponibilidades.filter(disponibilidad =>
                disponibilidad.validarSesion(servicio)
            );
        }

        return medico.disponibilidades;
    }


    async modificarDisponibilidades({ idMedico, nuevasDisponibilidades }) {
        
        const medico = await this.medicoRepository.findById(idMedico)

        medico.definirDisponibilidad(nuevasDisponibilidades)
        await this.turnoService.sincronizarTurnosDisponibles({ medico })

        const medicoGuardado = await this.medicoRepository.save(medico)
        
        return medicoGuardado
    }

    async agregarServicio({idMedico, tipoServicio, nuevoServicio}){
        const medico = await this.medicoRepository.findById(idMedico)

        medico.agregarServicio(nuevoServicio, tipoServicio)
        const medicoGuardado = await this.medicoRepository.save(medico)

        return medicoGuardado
    }

    async eliminarServicio({idMedico, tipoServicio,idServicio}){
        const medico = await this.medicoRepository.findById(idMedico)

        medico.eliminarServicio(idServicio, tipoServicio)

        const medicoGuardado = await this.medicoRepository.save(medico)
        return medicoGuardado
    }

    async modificarServicio({idMedico, tipoServicio, servicioModificado}){
        const medico = await this.medicoRepository.findById(idMedico)

        medico.modificarServicio(servicioModificado, tipoServicio)

        const medicoGuardado = await this.medicoRepository.save(medico)
        return medicoGuardado
    }

    async obtenerServicios({ idMedico }) {
        const medico = await this.medicoRepository.findById(idMedico);

        return {
            especialidad: medico.especialidades || [],
            practica: medico.practicas || []
        };
    }
}