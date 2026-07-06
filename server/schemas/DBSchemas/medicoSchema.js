import mongoose from "mongoose";
import { Medico } from "../../domain/medico.js"
import { especialidadEmbeddedSchema } from "./especialidadEmbeddedSchema.js";
import { practicaEmbeddedSchema } from "./practicaEmbeddedSchema.js";
import { disponibilidadHorariaEmbeddedSchema } from "./disponibilidadHorariaEmbeddedSchema.js";

const medicoSchema = new mongoose.Schema({
    usuario:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required:true
    },
    matricula:{
        type:String,
        required:true,
        trim:true
    },
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    especialidades:{
        type: [especialidadEmbeddedSchema],
        required:true
    },
    practicas:{
        type: [practicaEmbeddedSchema],
        required:true
    },
    sedes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'Sede',
        required:true
    },
    disponibilidades:{
        type:[disponibilidadHorariaEmbeddedSchema],
        required:true
    },
    eliminado: {
        type: Boolean,
        default: false
    }
},
{
    collection: 'medicos'
})

medicoSchema.loadClass(Medico)
export const MedicoModel = mongoose.model("Medico",medicoSchema)