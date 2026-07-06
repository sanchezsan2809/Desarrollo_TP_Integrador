import mongoose from "mongoose";
import { Paciente } from "../../domain/paciente.js";

const pacienteSchema = new mongoose.Schema({
    usuario: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario",
        required: true
    },
    dni:{
        type:String,
        required:true,
    },
    nombre:{
        type:String,
        required:true
    },
    obraSocial:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Obra_Social",
        required:true
    },
    plan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Plan",
        required:true
    },
    eliminado:{
        type: Boolean,
        default: false
    }
},
{
    collection: "pacientes"
})

pacienteSchema.loadClass(Paciente)

export const PacienteModel = mongoose.model('Paciente',pacienteSchema)