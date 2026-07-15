import { Turno } from "../../domain/turno.js"
import { MongoPacienteRepository } from "../../repositories/pacienteRepository.js"
import { MongoSedeRepository } from "../../repositories/sedeRepository.js"
import { MongoMedicoRepository } from "../../repositories/medicoRepository.js"
import { medicoMapper } from "./medicoMapper.js"
import { pacienteMapper } from "./pacienteMapper.js"
import { sedeMapper } from "./sedeMapper.js"
import { cambioEstadoTurnoMapper } from "./cambioEstadoTurnoMapper.js"
import { practicaMapper } from "./practicaMapper.js"
import { especialidadMapper } from "./especialidadMapper.js"
import { Practica } from "../../domain/practica.js"

class TurnoMapper{
    constructor(medicoRepository, medicoMapper, pacienteRepository, pacienteMapper, sedeRepository, sedeMapper, cambioEstadoTurnoMapper, practicaMapper, especialidadMapper){
        this.medicoRepository = medicoRepository
        this.medicoMapper = medicoMapper
        this.pacienteRepository = pacienteRepository
        this.pacienteMapper = pacienteMapper
        this.sedeRepository = sedeRepository
        this.sedeMapper = sedeMapper
        this.cambioEstadoTurnoMapper = cambioEstadoTurnoMapper,
        this.practicaMapper = practicaMapper,
        this.especialidadMapper = especialidadMapper
    }

    async mongoTurnoToDomain(mongoTurno) {

        const data = typeof mongoTurno.toObject === 'function' ? mongoTurno.toObject() : mongoTurno

        const medico = await this.medicoRepository.findById(data.medico)
        
        const paciente = data.paciente ? 
            await this.pacienteRepository.findById(data.paciente)
            : null

        const sede = await this.sedeRepository.findById(data.sede)

        const turno = new Turno(
            medico,
            data.fechaHora,
            sede,
            data.estado,
            data.costo
        )

        turno.id = data._id.toString()

        turno.paciente = paciente
        
        turno.fechaHoraPropuesta = data.fechaHoraPropuesta ? new Date(data.fechaHoraPropuesta) : null

        const historialEstados = data.historialEstados ?
            await Promise.all (data.historialEstados.map(mongoCambioEstadoTurno =>
                this.cambioEstadoTurnoMapper.mongoCambioEstadoTurnoToDomain(mongoCambioEstadoTurno, turno))
            ) 
            : [] 

        turno.historialEstados = historialEstados

        const esPractica = data.servicio?.tipo === "PRACTICA" || !!data.servicio?.practica;

        turno.servicio = esPractica ?
            this.practicaMapper.mongoPracticaToDomain(data.servicio.practica)
            : this.especialidadMapper.mongoEspecialidadToDomain(data.servicio.especialidad)

        return turno
    }

    turnoToDTO(turno) {
        const servicioAsignado = turno.servicio

        return {
            id: turno.id,
            fechaHora: turno.fechaHora,
            fechaHoraPropuesta: turno.fechaHoraPropuesta || null,
            ultimoRemitenteId: turno.fechaHoraPropuesta ? turno.remitenteUltimoCambioEstado().id : null,
            estado: turno.estado,
            costo: turno.costo,
            medico: {
                id: turno.medico.id,
                nombre: turno.medico.nombre
            },
            paciente: turno.paciente
                ? {
                    id: turno.paciente.id,
                    nombre: turno.paciente.nombre
                }
                : null,
            sede: {
                id: turno.sede.id,
                nombre: turno.sede.nombre
            },
            servicio: {
                nombre: servicioAsignado.nombre,
                duracionTurnoEnMins: servicioAsignado.duracionTurnoEnMins
            }
        }
    }

    turnoToMongo(turno) {

        const servicio = turno.servicio

        const esPractica = servicio instanceof Practica

        return {
            medico: turno.medico.id,
            paciente: turno.paciente?.id,
            fechaHora: turno.fechaHora,
            sede: turno.sede.id,
            servicio: esPractica
                ? {
                    tipo: "PRACTICA",
                    practica:
                        this.practicaMapper
                            .practicaToDTO(servicio)
                }
                : {
                    tipo: "ESPECIALIDAD",
                    especialidad:
                        this.especialidadMapper
                            .especialidadToDTO(servicio)
                },
            estado: turno.estado,
            costo: turno.costo,
            historialEstados: turno.historialEstados.map(
                cambioEstadoTurno => this.cambioEstadoTurnoMapper.cambioEstadoTurnoToMongo(cambioEstadoTurno)
            ),
            fechaHoraPropuesta: turno.fechaHoraPropuesta
        }
    }
}

const medicoRepository = new MongoMedicoRepository()
const pacienteRepository = new MongoPacienteRepository()
const sedeRepository = new MongoSedeRepository()

export const turnoMapper = new TurnoMapper(medicoRepository, medicoMapper, pacienteRepository, pacienteMapper, sedeRepository,  sedeMapper, cambioEstadoTurnoMapper, practicaMapper, especialidadMapper)