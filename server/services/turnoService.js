import { factoryNotificacion } from "../domain/factoryNotificacion.js";
import { agenda } from "../domain/agenda.js";
import { EstadoTurno } from "../domain/estadoTurno.js";
import { 
    NotAllowedError,  
    ValidationError
} from "../errors/appError.js";
export class TurnoService{
    constructor(
        turnoRepository, 
        pacienteRepository, 
        medicoRepository, 
        notificacionRepository, 
        sedeRepository,
        usuarioRepository){
        this.turnoRepository = turnoRepository
        this.pacienteRepository = pacienteRepository
        this.medicoRepository = medicoRepository
        this.notificacionRepository = notificacionRepository, 
        this.sedeRepository = sedeRepository
        this.usuarioRepository = usuarioRepository 
    }

    async reservar({id, pacienteId}){
        const turnoSinReservar = await this.turnoRepository.findById(id)
        
        const paciente = await this.pacienteRepository.findById(pacienteId)

        turnoSinReservar.asignarPaciente(paciente)

        const notificacionReservado = factoryNotificacion.crearSegunEstadoTurno(turnoSinReservar)

        const [turno, notificacion] = await Promise.all([
                this.turnoRepository.save(turnoSinReservar),
                this.notificacionRepository.save(notificacionReservado)
        ])

        return {turno, notificacion}
        
    }

    async cancelar({id, motivo, idUsuario}){     
        const turno = await this.turnoRepository.findById(id)

        const ahora = new Date()

        const usuario = turno.obtenerUsuario(idUsuario)

        if(!usuario){
            throw new NotAllowedError("El usuario no puede cancelar este turno")
        }
        if(!turno.sePuedeCancelar(ahora)){
            throw new NotAllowedError("No se puede cancelar turnos con menos de 1 hora de anticipacion")
        }

        turno.actualizarEstado(
            EstadoTurno.CANCELADO, 
            usuario, 
            motivo)
        
        const notificacionCancelado = factoryNotificacion.crearSegunEstadoTurno(turno)


        const [turnoCancelado, notificacionGuardada] =
            await Promise.all([
                this.turnoRepository.save(turno),
                this.notificacionRepository.save(notificacionCancelado)
        ])

        return {turnoCancelado, notificacionGuardada}
    }

    async marcarComoConfirmado({ id, idUsuario })
    {
        const turnoSinConfirmar = await this.turnoRepository.findById(id)

        const usuario = turnoSinConfirmar.obtenerUsuario(idUsuario)

        if(!usuario || turnoSinConfirmar.destinatarioUltimoCambioEstado().id !== idUsuario){
            throw new NotAllowedError("El usuario no puede confirmar este turno")
        }

        turnoSinConfirmar.actualizarEstado(
            EstadoTurno.CONFIRMADO,
            usuario,
            "El turno fue confirmado"
        )

        const notificacionConfirmado = factoryNotificacion.crearSegunEstadoTurno(turnoSinConfirmar)

        const [turno, notificacion] =
            await Promise.all([
                this.turnoRepository.save(turnoSinConfirmar),
                this.notificacionRepository.save(notificacionConfirmado)
            ])

        return {turno, notificacion}
    }

    async obtenerHistorial({ filtros, page, limit}){
        
        const { turnos, total, totalPages } = await this.turnoRepository.findAll({
            filtros: filtros, 
            page: page, 
            limit: limit
        })

        return {
            turnos,
            totalPages,
            total
        }

    }

    async buscarTurnosDisponibles({idPaciente, filtros, paginacion}) {
        
        const paciente = await this.pacienteRepository.findById(idPaciente)

        const plan = paciente.plan

        const turnos = await 
            this.turnoRepository
                .buscarTurnosDisponibles(filtros)
        

        const turnosConCobertura = turnos.map( turno => 
            {
                const servicio = turno.servicio
                
                let cobertura = null;


                if (servicio.practica) {
                    cobertura = plan.obtenerCoberturaPractica(servicio.practica);
                } else if (servicio.especialidad) {
                    cobertura = plan.obtenerCoberturaEspecialidad(servicio.especialidad);
                }
                    
                let costoFinal = turno.costo || 0

                if (cobertura?.nivel === "TOTAL") {
                    costoFinal = 0
                } 
                else if (cobertura?.nivel === "PARCIAL") {
                    costoFinal = costoFinal - (costoFinal * (cobertura.porcentaje / 100))
                }

                return {
                    turno: turno,
                    cobertura: cobertura?.nivel || "SIN COBERTURA",
                    costo: costoFinal
                }
            }
        )

        turnosConCobertura.sort((a, b) => {
            if(a.costo !== b.costo){
                return a.costo - b.costo
            }
            
            return new Date(a.turno.fechaHora) - new Date(b.turno.fechaHora)  
        })

        const page = Number(paginacion?.page) || 1
        
        const limit = Number(paginacion?.limit) || 10

        const total = turnosConCobertura.length

        const totalPages = Math.ceil(total / limit)

        const inicio = (page - 1) * limit

        const fin = inicio + limit

        const pagina = turnosConCobertura.slice(
            inicio,
            fin
        )

        return{
            turnosConCobertura: pagina,
            paginacion: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: 
                    page < totalPages,
                hasPrevPage: 
                    page > 1
            }
        }
    }
    

    async marcarComoRealizado({id, idUsuario}) {
        const turno = await this.turnoRepository.findById(id)

        const usuario = turno.obtenerUsuarioMedico()

        if (usuario.id !== idUsuario) {
            throw new NotAllowedError("El usuario no puede marcar como realizado este turno")
        }

        turno.actualizarEstado(
            EstadoTurno.REALIZADO,
            usuario,
            "Turno realizado"
        )

        return this.turnoRepository.save(turno)

    }

    async generarTurnosDisponibles() {

        const medicos = await this.medicoRepository.findAll()

        const todosLosNuevosTurnos = (
        await Promise.all(medicos.map(medico => this.generarTurnosParaMedico(medico)))
        ).flat()

        const turnosGuardados = await this.turnoRepository.saveAll(todosLosNuevosTurnos)

        return turnosGuardados
    }

    async generarTurnosParaMedico(medico) {

        const especialidades = medico.especialidades ?? []
        const practicas = medico.practicas ?? []

        const servicios = [...especialidades, ...practicas]

        let turnosDelMedico = []

        for (const servicio of servicios) {

            if (!servicio) continue

            const nuevosTurnos = agenda.generarTurnosPara(servicio, medico, 1)

            if (!Array.isArray(nuevosTurnos)) {
                throw new Error("agenda.generarTurnosPara debe devolver array")
            }

            turnosDelMedico = turnosDelMedico.concat(nuevosTurnos)
        }

        return turnosDelMedico
    }

    async sincronizarTurnosDisponibles({ medico }){
        const ahora = new Date()

        await this.turnoRepository.eliminarDisponiblesFuturos(medico.id, ahora) 
        
        const nuevosTurnosPosibles = (await this.generarTurnosParaMedico(medico))
            .filter(nuevoTurno => this.validarDisponibilidad(nuevoTurno, nuevoTurno.fechaHora))

        const turnosGuardados = await this.turnoRepository.saveAll(nuevosTurnosPosibles) 

        return turnosGuardados
    }

    async modificarFechaTurno({ id, idUsuario , fecha }){
        const turno = await this.turnoRepository.findById(id)

        if(!turno.puedeModificar(idUsuario)){
            throw new NotAllowedError("El usuario no puede solicitar cambio de fecha de este turno")
        }

        const existeConflicto = await this.validarDisponibilidad(turno, fecha)

        if (existeConflicto) {
            throw new ValidationError("El médico no tiene disponibilidad en este horario")
        }
            
        const usuario = turno.obtenerUsuario(idUsuario)  
        
        turno.solicitarCambioFecha(
            fecha, 
            usuario, 
            "El usuario solicitó el cambio de fecha"
        )

        const notificacion = factoryNotificacion.crearSegunEstadoTurno(turno)

        const [turnoGuardado, notificacionGuardada] =
            await Promise.all([
                this.turnoRepository.save(turno),
                this.notificacionRepository.save(notificacion)
            ])

        return {
            turnoGuardado,
            notificacionGuardada
        }
    }

    async validarDisponibilidad(turno, fecha){
        return await this.turnoRepository.existeTurnoEnFecha({
                idMedico: turno.medico.id,
                fecha,
                excluirTurnoId: turno.id
            })

    }
}