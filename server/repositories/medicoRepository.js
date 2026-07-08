import { MedicoNotFoundError } from "../errors/appError.js";
import { MedicoModel } from "../schemas/DBSchemas/medicoSchema.js";
import { medicoMapper } from "../middlewares/mappers/medicoMapper.js";

export class MongoMedicoRepository {
  constructor() {
    this.model = MedicoModel;
  }

  async save(medico) {
    const medicoPlano = medicoMapper.medicoToMongo(medico);

    const medicoGuardado = await this.model.findByIdAndUpdate(
      medicoPlano._id,
      medicoPlano,
      { new: true, upsert: true }, // "new" devuelve el doc actualizado, "upsert" lo crea si no existe
    );

    return medicoMapper.mongoMedicoToDomain(medicoGuardado);
  }

  async findById(id) {
    const mongoMedico = await this.model.findById(id);

    if (!mongoMedico) {
      throw new MedicoNotFoundError(`El médico ${id} no fue encontrado`);
    }

    return medicoMapper.mongoMedicoToDomain(mongoMedico);
  }

  async findAll() {
    const medicosMongo = await this.model.find();

    return Promise.all(
      medicosMongo.map((m) => medicoMapper.mongoMedicoToDomain(m)),
    );

  }

  async findByUser(userId) {
    const medicoDB = await this.model.findOne({
      usuario: userId
    });

    if (!medicoDB) {
      throw new MedicoNotFoundError(`No se encontró un medico con id de usuario ${userId}`);
    }

    return medicoMapper.mongoMedicoToDomain(medicoDB)
  }
}
