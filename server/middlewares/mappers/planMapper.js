import { Plan } from "../../domain/plan.js"
import { CoberturaEspecialidad } from "../../domain/coberturaEspecialidad.js"
import { CoberturaPractica } from "../../domain/coberturaPractica.js"
import { especialidadMapper } from "./especialidadMapper.js"
import { practicaMapper } from "./practicaMapper.js"

class PlanMapper {
    constructor(especialidadMapper, practicaMapper) {
        this.especialidadMapper = especialidadMapper
        this.practicaMapper = practicaMapper
    }

    mongoPlanToDomain(data) {
        const coberturaEspecialidad =
            data.coberturasEspecialidad
                ? data.coberturasEspecialidad.map(
                    coberturaMongo => {
                        return new CoberturaEspecialidad(
                            this.especialidadMapper
                                .mongoEspecialidadToDomain(
                                    coberturaMongo.especialidad
                                ),
                            coberturaMongo.nivel,
                            coberturaMongo.porcentaje
                        )
                    }
                )
                : []

        const coberturaPractica =
            data.coberturasPractica
                ? data.coberturasPractica.map(
                    coberturaMongo => {
                        return new CoberturaPractica(
                            this.practicaMapper
                                .mongoPracticaToDomain(
                                    coberturaMongo.practica
                                ),
                            coberturaMongo.nivel,
                            coberturaMongo.porcentaje
                        )
                    }
                )
                : []

        const plan = new Plan(
            data.nombre,
            coberturaEspecialidad,
            coberturaPractica
        )

        plan.id = data._id

        return plan
    }

    planToDTO(plan) {
        return {
            id: plan.id,
            nombre: plan.nombre,
            coberturaEspecialidad:
                plan.coberturaEspecialidad,
            coberturaPractica:
                plan.coberturaPractica
        }
    }
}

export const planMapper =
    new PlanMapper(
        especialidadMapper,
        practicaMapper
    )