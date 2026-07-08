import {
    PacienteNotFoundError
} from "../errors/appError.js"
import { PacienteModel } from "../schemas/DBSchemas/pacienteSchema.js";
import { pacienteMapper } from "../middlewares/mappers/pacienteMapper.js";


export class MongoPacienteRepository{

    constructor(){
        this.model= PacienteModel
    }

    async save(paciente){
        const nuevoPaciente= new this.model(paciente)
        const pacienteGuardado = await nuevoPaciente.save()
        return pacienteMapper.mongoPacienteToDomain(pacienteGuardado)
    }

    async findById(id){
        const mongoPaciente = await this.model
            .findById(id)
                
        if (!mongoPaciente) {
            throw new PacienteNotFoundError(`El paciente ${id} no fue encontrado`)
        }

        return pacienteMapper.mongoPacienteToDomain(mongoPaciente)
    }

    async findByUser(userId) {
        const pacienteDB = await this.model.findOne({
            usuario: userId
        });

        if (!pacienteDB) {
            throw new PacienteNotFoundError(`No se encontró un paciente con id de usuario ${userId}`)
        }

        return pacienteMapper.mongoPacienteToDomain(pacienteDB)
    }
}
