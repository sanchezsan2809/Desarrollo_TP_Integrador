import mongoose from "mongoose";
import { NivelCobertura } from "../../domain/nivelCobertura.js";
import { CoberturaPractica } from "../../domain/coberturaPractica.js";
import { practicaEmbeddedSchema } from "./practicaEmbeddedSchema.js";

export const coberturaPracticaEmbeddedSchema = new mongoose.Schema({
    practica:{
        type: practicaEmbeddedSchema,
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

