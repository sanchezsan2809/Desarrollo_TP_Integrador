import { TurnoService } from "../services/turnoService.js"
import { BadRequestError } from "../errors/appError.js"
import { turnoMapper } from "../middlewares/mappers/turnoMapper.js"
import { notificacionMapper} from "../middlewares/mappers/notificacionMapper.js"

export class TurnoController {
    constructor(turnoService  =  new TurnoService()){
        this.turnoService = turnoService
    }

    //  Paciente
    reservar = async(req, res) =>{

        const { id } = req.params
        const { pacienteId } = req.body

        const { turno, notificacion } = await this.turnoService.reservar({ id, pacienteId })

        const data = {
            turno: turnoMapper.turnoToDTO(turno),
            notificacion: notificacionMapper.notificacionToDTO(notificacion)
        }

        res.status(200).json(data)

    }

    cancelarTurno = async(req, res) =>{
        const { id } = req.params
        const { motivo, idUsuario } = req.body


        const { turnoCancelado, notificacionGuardada } = await this.turnoService.cancelar({
            id,
            motivo,
            idUsuario
        })


        const data = {
            turno: turnoMapper.turnoToDTO(turnoCancelado),
            notificacion: notificacionMapper.notificacionToDTO(notificacionGuardada)
        }


        res.status(200).json(data)
    }

    obtenerHistorialTurnos = async (req, res) => {
        const { pacienteId,
            estado,
            fechaDesde,
            fechaHasta,
            page,
            limit } = req.query

        const { turnos, totalPages, total } = await this.turnoService.obtenerHistorial({
            filtros: {
                pacienteId,
                estado,
                fechaDesde,
                fechaHasta
            },
            page,
            limit
        })

        res.status(200).json({
            data: turnos.map(turno => turnoMapper.turnoToDTO(turno)),
            paginacion: {
                page,
                limit,
                total: total,
                totalPages: totalPages,

            }
        })

    }

    buscarTurnosDisponibles = async (req, res) => {

        const { idPaciente } = req.body

        const { page, limit } = req.query;

        const {
            nombreMedico,
            nombreEspecialidad,
            nombrePractica,
            nombreSede,
            fechaDesde,
            fechaHasta } = req.body

        const { turnosConCobertura, paginacion } = await this.turnoService.buscarTurnosDisponibles({
            idPaciente: idPaciente,
            filtros: {
                nombreMedico,
                nombreEspecialidad,
                nombrePractica,
                nombreSede,
                fechaDesde,
                fechaHasta
            },
            paginacion: {
                page,
                limit
            }
        })

        const data = {
            turnosConCobertura: turnosConCobertura.map(item => ({

                turno: 
                    turnoMapper.turnoToDTO(item.turno),
                    cobertura: item.cobertura,
                    costo: item.costo
            }
        )),
            paginacion: paginacion
        }



        res.status(200).json(data)
    }

    marcarComoRealizado = async (req, res) => {
        const { id } = req.params
        const { idUsuario } = req.body

        const turno = await this.turnoService.marcarComoRealizado({ id, idUsuario })

        const data = turnoMapper.turnoToDTO(turno)

        res.status(200).json(data)
    }

    marcarComoConfirmado = async (req, res) => {
        const { id } = req.params
        const { idUsuario } = req.body

        const { turno, notificacion } = await this.turnoService.marcarComoConfirmado({ id, idUsuario })

        const data = {
            turno: turnoMapper.turnoToDTO(turno),
            notificacion: notificacionMapper.notificacionToDTO(notificacion)
        }

        res.status(200).json(data)
    }

    rechazarCambioFecha = async (req, res) => {
        const { id } = req.params
        const { idUsuario } = req.body

        const { turno, notificacion } = await this.turnoService.rechazarCambioFecha({ id, idUsuario })

        const data = {
            turno: turnoMapper.turnoToDTO(turno),
            notificacion: notificacionMapper.notificacionToDTO(notificacion)
        }

        res.status(200).json(data)
    }

    generarTurnosDisponibles = async (req, res) => {
        const turnosGuardados = await this.turnoService.generarTurnosDisponibles()

        const data = turnosGuardados.map(turno => turnoMapper.turnoToDTO(turno))

        res.status(200).json(data)

    }

    modificarFechaTurno = async (req, res) => {
        const { id } = req.params
        const { idUsuario, nuevaFecha } = req.body

        const { turnoGuardado, notificacionGuardada } = await this.turnoService.modificarFechaTurno({
            id,
            idUsuario,
            fecha: nuevaFecha
        })

        const data = {
            turno: turnoMapper.turnoToDTO(turnoGuardado),
            notificacion: notificacionMapper.notificacionToDTO(notificacionGuardada)
        }

        res.status(200).json(data)
    }

    extraerPaginacion(query) {
        const numPag = query?.page === undefined ? 1 : Number(query.page)
        const limPag = query?.limit === undefined ? 10 : Number(query.limit)

        this.validarEnteroPositivo(numPag, "page")
        this.validarEnteroPositivo(limPag, "limit")

        return { numPag, limPag }
    }

    validarEnteroPositivo(numero, parametro) {
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new BadRequestError(`El parámetro ${parametro} debe ser un entero positivo`)
        }
    }


}