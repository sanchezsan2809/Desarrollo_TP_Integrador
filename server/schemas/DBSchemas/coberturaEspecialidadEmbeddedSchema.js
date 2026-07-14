import mongoose from "mongoose";
import { NivelCobertura } from "../../domain/nivelCobertura.js";
import { CoberturaEspecialidad } from "../../domain/coberturaEspecialidad.js";
import { especialidadEmbeddedSchema } from "./especialidadEmbeddedSchema.js";

export const coberturaEspecialidadEmbeddedSchema = new mongoose.Schema({
    especialidad:{
        type: especialidadEmbeddedSchema,
        required: true
    },
    nivel:{
        type: String,
        enum: Object.values(NivelCobertura),
        required: true,
        trim: true
    },
    porcentaje: {
                type: Number,
                default: 0
    }
},
{_id: false});
