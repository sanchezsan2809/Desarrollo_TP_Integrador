import mongoose from "mongoose";
import { Turno } from "../../domain/turno.js";
import { EstadoTurno } from "../../domain/estadoTurno.js";
import { practicaEmbeddedSchema } from "./practicaEmbeddedSchema.js";
import { especialidadEmbeddedSchema } from "./especialidadEmbeddedSchema.js";
import { cambioEstadoTurnoEmbeddedSchema } from "./cambioEstadoTurnoSchema.js";

const turnoSchema = new mongoose.Schema({
    medico:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Medico', 
        required: true
    },
    paciente:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente', 
        required: false
    }, 
    fechaHora:{
        type: Date,
        required: true
    }, 
    sede:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sede',
        required: true
    },

    servicio: {
        tipo: {
            type: String,
            enum: ["PRACTICA", "ESPECIALIDAD"],
            required: true
        }, 

        practica:{
            type: practicaEmbeddedSchema,
            required: false
        }, 

        especialidad:{
            type: especialidadEmbeddedSchema,
            required: false
        } 

    },
   
    estado:{
        type: String,
        enum: Object.values(EstadoTurno),
        required: true, 
        default: EstadoTurno.DISPONIBLE
    },
    historialEstados:[cambioEstadoTurnoEmbeddedSchema],
    
    costo:{
        type: Number,
        required: true
    },

    fechaHoraPropuesta: {
        type: Date,
        required: false
    }

}, {
    timestamps: true,
    collection: 'turnos'
})  

turnoSchema.loadClass(Turno)

export const TurnoModel = mongoose.model('Turno', turnoSchema)