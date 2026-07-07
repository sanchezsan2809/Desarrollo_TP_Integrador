import mongoose from "mongoose";
import { Usuario } from "../../domain/usuario.js";

const usuarioSchema = new mongoose.Schema({

    keycloakId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    nombreUsuario: {
        type: String,
        required: true,
        unique: true
    },

    nombre: String,

    apellido: String,

    email: String,

    roles: [{
        type: String,
        enum: ['PACIENTE', 'MEDICO', 'ADMIN']
    }]
})

usuarioSchema.loadClass(Usuario);
export const UsuarioModel = mongoose.model("Usuario", usuarioSchema);
