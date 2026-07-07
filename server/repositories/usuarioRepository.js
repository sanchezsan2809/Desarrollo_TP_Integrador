import { UsuarioModel } from "../schemas/DBSchemas/usuarioSchema.js";
import { usuarioMapper } from "../middlewares/mappers/usuarioMapper.js";
import { NotFoundError } from "../errors/appError.js";

export class MongoUsuarioRepository{

    constructor(){
        this.model = UsuarioModel
    }

    async save(usuario){
        const nuevoUsuario = new this.model(usuario)
        
        const mongoUsuarioGuardado = await nuevoUsuario.save()
        return usuarioMapper.mongoUsuarioToDomain(mongoUsuarioGuardado)
    }

    async findById(id){
        const mongoUsuario = await this.model.findById(id)
        return usuarioMapper.mongoUsuarioToDomain(mongoUsuario)
    }

    async findByKeycloakIdOrThrow(keycloakId) {

        return UsuarioModel
            .findOne({ keycloakId })
            .orFail(() =>
                new NotFoundError(
                    "No se encontró el usuario."
                )
            );
    }

    async findAll(){
        const mongoUsuarios =  await this.model.find()
        return mongoUsuarios.map(mongoUsuario => usuarioMapper.mongoUsuarioToDomain(mongoUsuario))
    }
}