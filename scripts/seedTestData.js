// scripts/seedTestData.js

import { UsuarioModel } from "../server/schemas/DBSchemas/usuarioSchema.js"
import { MedicoModel } from "../server/schemas/DBSchemas/medicoSchema.js"
import { PacienteModel } from "../server/schemas/DBSchemas/pacienteSchema.js"
import { SedeModel } from "../server/schemas/DBSchemas/sedeSchema.js"
import { TurnoModel } from "../server/schemas/DBSchemas/turnoSchema.js"
import { PlanModel } from "../server/schemas/DBSchemas/planSchema.js"
import { ObraSocialModel } from "../server/schemas/DBSchemas/obraSocialSchema.js"
import { NotificacionModel } from "../server/schemas/DBSchemas/notificacionSchema.js"
import { SEED_IDS } from "./seedIDs.js"

export async function seedTestData() {
    

    // usuarios
    const usuarioMedico = await UsuarioModel.create({
        keycloakId: SEED_IDS.HOUSE.keycloakId,
        nombreUsuario: SEED_IDS.HOUSE.username,
        nombre: "Gregory",
        apellido: "House",
        email: SEED_IDS.HOUSE.email
    })

    const usuarioPaciente = await UsuarioModel.create({
        keycloakId: SEED_IDS.PACIENTE.keycloakId,
        nombreUsuario: SEED_IDS.PACIENTE.username,
        nombre: "Juan",
        apellido: "Perez",
        email: SEED_IDS.PACIENTE.email
    })
    // sede
    const sede = await SedeModel.create({
        nombre: "Sede Central",
        direccion: "Av Siempre Viva 123"
    })

    // medico

const medico = await MedicoModel.create({

    usuario: usuarioMedico._id,

    matricula: "MN-45821",

    nombre: "Gregory House",

    especialidades: [
        {
            id: "1234",
            nombre: "Clínica Médica",
            duracionTurnoEnMins: 30,
            costo: 15000
        },
        {
            id: "1235",
            nombre: "Diagnóstico",
            duracionTurnoEnMins: 60,
            costo: 25000
        }
    ],

    practicas: [
        {
            id: "1236",
            codigo: "ECG001",
            nombre: "Electrocardiograma",
            duracionTurnoEnMins: 20,
            costo: 12000
        },
        {
            id: "1237",
            codigo: "LAB101",
            nombre: "Análisis de Sangre",
            duracionTurnoEnMins: 15,
            costo: 8000
        }
    ],

    sede: [sede._id],

    disponibilidades: [
        {
            diaSemana: "LUNES",
            horaDesde: "08:00",
            horaHasta: "12:00"
        },
        {
            diaSemana: "MIERCOLES",
            horaDesde: "14:00",
            horaHasta: "18:00"
        },
        {
            diaSemana: "VIERNES",
            horaDesde: "09:00",
            horaHasta: "13:00"
        }
    ]
})


    // PLAN

    const plan = await PlanModel.create({
        nombre: "Plan Premium",

        coberturasEspecialidad: [
            {
                especialidad: {
                    id : "1234",
                    nombre: "Clínica Médica",
                    duracionTurnoEnMins: 30,
                    costo: 15000
                },
                nivel: "TOTAL"
            },
            {
                especialidad: {
                    id : "1235",
                    nombre: "Diagnóstico",
                    duracionTurnoEnMins: 60,
                    costo: 25000
                },
                nivel: "PARCIAL"
            }
        ],

        coberturasPractica: [
            {
                practica: {
                    id : "1236",
                    codigo: "ECG001",
                    nombre: "Electrocardiograma",
                    duracionTurnoEnMins: 20,
                    costo: 12000
                },
                nivel: "TOTAL"
            },
            {
                practica: {
                    id : "1237",
                    codigo: "LAB101",
                    nombre: "Análisis de Sangre",
                    duracionTurnoEnMins: 15,
                    costo: 8000
                },
                nivel: "PARCIAL"
            }
        ]
    })


    // OBRA SOCIAL

    const obraSocial = await ObraSocialModel.create({
        nombre: "OSDE",
        planes: [plan._id]
    })


    // PACIENTE

    const paciente = await PacienteModel.create({
        
        usuario: usuarioPaciente._id,

        dni: "40111222",

        nombre: "Juan Pérez",

        obraSocial: obraSocial._id,

        plan: plan._id
    })

    // turnos
   
    const turno = await TurnoModel.create({

        medico: medico._id,

        paciente: paciente._id,

        fechaHora: new Date("2026-06-14T10:00:00"),

        sede: sede._id,

        servicio: {
            tipo: "PRACTICA",
            practica:{
                id: "1236",
                codigo: "ECG001",
                nombre: "Electrocardiograma",
                duracionTurnoEnMins: 20,
                costo: 12000
            }
        },

        estado: "RESERVADO",

        historialEstados: [
            {
                fechaHoraIngreso: new Date("2026-05-20T09:00:00"),
                estado: "DISPONIBLE",
                usuario: usuarioMedico._id,
                motivo: "Creación del turno disponible"
            },
            {
                fechaHoraIngreso: new Date("2026-06-10T14:30:00"),
                estado: "RESERVADO",
                usuario: usuarioPaciente._id,
                motivo: "Reserva realizada por el paciente"
            }
        ],

        costo: 12000
    })
    
   
    const turnoSinReservar = await TurnoModel.create({
   
        medico: medico._id,

        fechaHora: new Date("2026-06-10T10:00:00"),

        sede: sede._id,

        servicio:{
            tipo: "PRACTICA",
            practica: {
                id: "1236",
                codigo: "ECG001",
                nombre: "Electrocardiograma",
                duracionTurnoEnMins: 20,
                costo: 12000
            },   
        },

        estado: "DISPONIBLE",

        historialEstados: [
            {
                fechaHoraIngreso: new Date("2026-05-20T09:00:00"),
                estado: "DISPONIBLE",
                usuario: usuarioMedico._id,
                motivo: "Creación del turno disponible"
            }
        ],

        costo: 12000
    })

    //Notificacion
 
    const notificacion = await NotificacionModel.create({
        
        destinatario: usuarioPaciente._id,

        remitente: usuarioPaciente._id,

        mensaje: "HOLA",

        fechaHoraCreacion: new Date(),

        fechaHoraLeida: new Date(),

    })

    return {
        usuarioMedico,
        usuarioPaciente,
        medico,
        paciente,
        sede,
        plan,
        obraSocial,
        turno,
        turnoSinReservar,
        notificacion
    }
    
}
