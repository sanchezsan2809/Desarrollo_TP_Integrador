import { EstadoTurno } from "../domain/estadoTurno.js"
import {
    TurnoNotFoundError,
} from "../errors/appError.js"
import { TurnoModel } from "../schemas/DBSchemas/turnoSchema.js";
import { turnoMapper } from "../middlewares/mappers/turnoMapper.js";
import mongoose from "mongoose";

export class MongoTurnoRepository {

    constructor() {
        this.model = TurnoModel 
    }

    async save(turno) {
        let updated

        if (turno.id) {
            updated = await this.model.findOneAndUpdate(
                { _id: turno.id },
                turnoMapper.turnoToMongo(turno),
                { returnDocument: 'after' }
            )
        } else {
            updated = await this.model.create(turno)
        }        

        const mongoTurno = await this.model.findById(updated._id)

        return turnoMapper.mongoTurnoToDomain(mongoTurno)
            
    }


    async saveAll(turnos) {

        if (!Array.isArray(turnos)) {
            throw new Error("saveAll esperaba un array de turnos")
        }

        const limpios = turnos.filter(t => t != null)

        const guardados = await Promise.all(
            limpios.map(turno => this.save(turno))
        )

        return guardados
    }

    async findById(id){
        const mongoTurno = await this.model
            .findById(id)
        
        if(!mongoTurno){
            throw new TurnoNotFoundError(`El turno ${id} no fue encontrado`)
        }

        return turnoMapper.mongoTurnoToDomain(mongoTurno)
    }

    async findAll({ filtros = {}, page, limit } = {}) {

        const query = {}

        if(filtros.medicoId) {
            query.medico = new mongoose.Types.ObjectId(filtros.medicoId)
        }

    

        if (filtros.pacienteId) {
            //query.paciente = filtros.pacienteId
            query.paciente = new mongoose.Types.ObjectId(filtros.pacienteId)
        }

        if (filtros.estado) {
            query.estado = filtros.estado
        }

        if (filtros.fechaDesde || filtros.fechaHasta) {
            query.fechaHora = {}
            if (filtros.fechaDesde) query.fechaHora.$gte = new Date(filtros.fechaDesde)
            if (filtros.fechaHasta) query.fechaHora.$lte = new Date(filtros.fechaHasta)
        }

        const offset = (page - 1) * limit

        let documents = await this.model
            .find(query)
            .skip(offset)
            .limit(limit)
        

        const turnos = await Promise.all(documents.map(mongoTurno => turnoMapper.mongoTurnoToDomain(mongoTurno)))

        const total = await this.model.countDocuments(query)

        const totalPages = Math.ceil(total / limit)
        return {
            turnos,
            total,
            totalPages
        }
    }

    async buscarTurnosDisponibles( filtros = {} ){

        const {
            nombreMedico,
            nombreEspecialidad,
            nombrePractica,
            nombreSede,
            fechaDesde,
            fechaHasta
        } = filtros

        const matchTurno = {
            estado: "DISPONIBLE"
        }

        if(fechaDesde || fechaHasta){
            matchTurno.fechaHora = {}

            if(fechaDesde){
                matchTurno.fechaHora.$gte = new Date(fechaDesde)
            }

            if(fechaHasta){
                matchTurno.fechaHora.$lte = new Date(fechaHasta)
            }
        }

        if (nombreEspecialidad || nombrePractica) {
            matchTurno.$or = [
                { "servicio.especialidad.nombre": { $regex: nombreEspecialidad || nombrePractica, $options: "i" } },
                { "servicio.practica.nombre": { $regex: nombrePractica || nombreEspecialidad, $options: "i" } }
            ];
        }

        const pipeline = [
        { $match: matchTurno },
        
        {
            $lookup: {
                from: "medicos",
                localField: "medico",
                foreignField: "_id",
                as: "medicoResult"
            }
        },
        { $unwind: "$medicoResult" },

        {
            $lookup: {
                from: "sedes",
                localField: "sede",
                foreignField: "_id",
                as: "sedeResult"
            }
        }, 
        { $unwind: "$sedeResult" }
    ]

    if(nombreMedico){
        pipeline.push({ $match: { "medicoResult.nombre": { $regex: nombreMedico, $options: "i" } } })
    }
    if(nombreSede){
        pipeline.push({ $match: { "sedeResult.nombre": { $regex: nombreSede, $options: "i" } } })
    }

    pipeline.push({
        $project: {
            _id: { $toString: "$_id" },
            fechaHora: 1,
            estado: 1,
            costo: 1,
            paciente: 1,
            historialEstados: 1,
            medico: { $toString: "$medicoResult._id" }, 
            sede: { $toString: "$sedeResult._id" },
            servicio: 1 
        }
    });

        const documentosPlanos = await this.model.aggregate(pipeline);

        return await Promise.all(
            documentosPlanos.map(mongoTurno => turnoMapper.mongoTurnoToDomain(mongoTurno))
        );

    }

    async eliminarDisponiblesFuturos(idMedico, fechaHora){
        const query = {
            medico: idMedico,
            estado: EstadoTurno.DISPONIBLE,
            fechaHora:{
                $gte: fechaHora
            }}

       // const borrados = await this.model.deleteMany(query)     
        const borrados = await this.model.find(query)
        await this.model.deleteMany(query)
        return Promise.all(borrados.map(mongoTurno => turnoMapper.mongoTurnoToDomain(mongoTurno)))
    }

    async obtenerTurnosDelDiaSiguiente() {
        const manana = new Date()
        manana.setDate(manana.getDate() + 1)

        const inicio = new Date(manana)
        inicio.setHours(0, 0, 0, 0)

        const fin = new Date(manana)
        fin.setHours(23, 59, 59, 999)

        const documents = await this.model.find({
            estado: { $in: [EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO] },
            fechaHora: { $gte: inicio, $lte: fin }
        })

        return Promise.all(
            documents.map(mongoTurno => turnoMapper.mongoTurnoToDomain(mongoTurno))
        )
    }

    async existeTurnoEnFecha({
        idMedico,
        fecha,
        excluirTurnoId
    }){
        const query = {
            medico: idMedico,
            fechaHora: fecha,
            estado:{
                $in: ["CONFIRMADO", "RESERVADO"]
            }
        }

        if(excluirTurnoId){
            query._id = { $ne: excluirTurnoId}
        }

        const existe = await this.model.exists(query)

        return Boolean(existe)

    }

}

