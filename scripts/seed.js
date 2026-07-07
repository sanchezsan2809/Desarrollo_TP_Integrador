import mongoose from 'mongoose';
import { UsuarioModel } from "../server/schemas/DBSchemas/usuarioSchema.js";
import { MedicoModel } from "../server/schemas/DBSchemas/medicoSchema.js";
import { PacienteModel } from "../server/schemas/DBSchemas/pacienteSchema.js";
import { SedeModel } from "../server/schemas/DBSchemas/sedeSchema.js";
import { TurnoModel } from "../server/schemas/DBSchemas/turnoSchema.js";
import { PlanModel } from "../server/schemas/DBSchemas/planSchema.js";
import { ObraSocialModel } from "../server/schemas/DBSchemas/obraSocialSchema.js";
import { NotificacionModel } from "../server/schemas/DBSchemas/notificacionSchema.js";
import { SEED_IDS } from './seedIDs.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_NAME || 'GD1C2026';

async function ejecutarSeed() {
    try {
        console.log(`🔄 Conectando a MongoDB en: ${MONGO_URI} (Base de datos: ${DB_NAME})`);
        await mongoose.connect(MONGO_URI, { dbName: DB_NAME });

        console.log('🗑️ Vaciando colecciones...');
        await Promise.all([
            UsuarioModel.deleteMany({}),
            MedicoModel.deleteMany({}),
            PacienteModel.deleteMany({}),
            SedeModel.deleteMany({}),
            TurnoModel.deleteMany({}),
            PlanModel.deleteMany({}),
            ObraSocialModel.deleteMany({}),
            NotificacionModel.deleteMany({})
        ]);

        console.log('🌱 Insertando datos maestros...');

        // USUARIOS
        // USUARIOS
        const usuarioHouse = await UsuarioModel.create({
            keycloakId: SEED_IDS.HOUSE.keycloakId,
            nombreUsuario: SEED_IDS.HOUSE.username,
            nombre: "Gregory",
            apellido: "House",
            email: SEED_IDS.HOUSE.email
        })

        const usuarioMilk = await UsuarioModel.create({
            keycloakId: SEED_IDS.MILK.keycloakId,
            nombreUsuario: SEED_IDS.MILK.username,
            nombre: "Sapo",
            apellido: "Milk",
            email: SEED_IDS.MILK.email
        })

        const usuarioPaciente = await UsuarioModel.create({
            keycloakId: SEED_IDS.PACIENTE.keycloakId,
            nombreUsuario: SEED_IDS.PACIENTE.username,
            nombre: "Juan",
            apellido: "Perez",
            email: SEED_IDS.PACIENTE.email
        })

        
        // SEDES
        const sedeCentral = await SedeModel.create({ nombre: "Sede Central", direccion: "Av Siempre Viva 123" });
        const sedeNorte = await SedeModel.create({ nombre: "Sede Norte", direccion: "Av Cabildo 4500" });

        // MÉDICO 1: Gregory House
        const MEDICO_HOUSE_ID = SEED_IDS.MEDICO_HOUSE
        const medicoHouse = await MedicoModel.create({
            _id: MEDICO_HOUSE_ID,
            usuario: usuarioHouse._id,
            matricula: "MN-45821",
            nombre: "Gregory House",
            especialidades: [
                { id: "1234", nombre: "Clínica Médica", duracionTurnoEnMins: 30, costo: 15000 },
                { id: "1235", nombre: "Diagnóstico", duracionTurnoEnMins: 60, costo: 25000 }
            ],
            practicas: [
                { id: "1236", codigo: "ECG001", nombre: "Electrocardiograma", duracionTurnoEnMins: 20, costo: 12000 },
                { id: "1237", codigo: "LAB101", nombre: "Análisis de Sangre", duracionTurnoEnMins: 15, costo: 8000 }
            ],
            sede: [sedeCentral._id],
            disponibilidades: [{ diaSemana: "LUNES", horaDesde: "08:00", horaHasta: "12:00" }]
        });

        // MÉDICO 2: Sapo Milk
        const MEDICO_MILK_ID = SEED_IDS.MEDICO_MILK
        const medicoMilk = await MedicoModel.create({
            _id: MEDICO_MILK_ID,
            usuario: usuarioMilk._id,
            matricula: "MN-99999",
            nombre: "Sapo Milk",
            especialidades: [
                { id: "2001", nombre: "Pediatría", duracionTurnoEnMins: 20, costo: 18000 }
            ],
            practicas: [
                { id: "2002", codigo: "RX002", nombre: "Radiografía Tórax", duracionTurnoEnMins: 15, costo: 14000 }
            ],
            sede: [sedeNorte._id],
            disponibilidades: [{ diaSemana: "MIERCOLES", horaDesde: "14:00", horaHasta: "18:00" }]
        });

        // PLANES Y COBERTURAS
        const plan = await PlanModel.create({
            nombre: "Plan Premium",
            coberturasEspecialidad: [
                { especialidad: { id: "1234", nombre: "Clínica Médica", duracionTurnoEnMins: 30, costo: 15000 }, nivel: "TOTAL" },
                { especialidad: { id: "1235", nombre: "Diagnóstico", duracionTurnoEnMins: 60, costo: 25000 }, nivel: "PARCIAL" },
                { especialidad: { id: "2001", nombre: "Pediatría", duracionTurnoEnMins: 20, costo: 18000 }, nivel: "TOTAL" }
            ],
            coberturasPractica: [
                { practica: { id: "1236", codigo: "ECG001", nombre: "Electrocardiograma", duracionTurnoEnMins: 20, costo: 12000 }, nivel: "TOTAL" },
                { practica: { id: "1237", codigo: "LAB101", nombre: "Análisis de Sangre", duracionTurnoEnMins: 15, costo: 8000 }, nivel: "PARCIAL" },
                { practica: { id: "2002", codigo: "RX002", nombre: "Radiografía Tórax", duracionTurnoEnMins: 15, costo: 14000 }, nivel: "TOTAL" }
            ]
        });

        const obraSocial = await ObraSocialModel.create({ nombre: "OSDE", planes: [plan._id] });

        const PACIENTE_ID = SEED_IDS.PACIENTE;
        await PacienteModel.create({
            _id: new mongoose.Types.ObjectId(PACIENTE_ID),
            usuario: usuarioPaciente._id,
            dni: "40111222",
            nombre: "Juan Pérez",
            obraSocial: obraSocial._id,
            plan: plan._id
        });

        console.log('📅 Generando grilla mixta de turnos...');

        // TURNO 1: House - Electrocardiograma
        await TurnoModel.create({
            medico: medicoHouse._id,
            fechaHora: new Date("2026-07-15T10:00:00"),
            sede: sedeCentral._id,
            servicio: { tipo: "PRACTICA", practica: { id: "1236", codigo: "ECG001", nombre: "Electrocardiograma", duracionTurnoEnMins: 20, costo: 12000 } },
            estado: "DISPONIBLE", costo: 12000,
            historialEstados: [{ fechaHoraIngreso: new Date(), estado: "DISPONIBLE", usuario: usuarioHouse._id, motivo: "Inicial" }]
        });

        // TURNO 2: House - Clínica Médica
        await TurnoModel.create({
            medico: medicoHouse._id,
            fechaHora: new Date("2026-07-15T11:30:00"),
            sede: sedeCentral._id,
            servicio: { tipo: "ESPECIALIDAD", especialidad: { id: "1234", nombre: "Clínica Médica", duracionTurnoEnMins: 30, costo: 15000 } },
            estado: "DISPONIBLE", costo: 15000,
            historialEstados: [{ fechaHoraIngreso: new Date(), estado: "DISPONIBLE", usuario: usuarioHouse._id, motivo: "Inicial" }]
        });

        // TURNO 3: Milk - Pediatría
        await TurnoModel.create({
            medico: medicoMilk._id,
            fechaHora: new Date("2026-07-17T09:15:00"),
            sede: sedeNorte._id,
            servicio: { tipo: "ESPECIALIDAD", especialidad: { id: "2001", nombre: "Pediatría", duracionTurnoEnMins: 20, costo: 18000 } },
            estado: "DISPONIBLE", costo: 18000,
            historialEstados: [{ fechaHoraIngreso: new Date(), estado: "DISPONIBLE", usuario: usuarioMilk._id, motivo: "Inicial" }]
        });

        // TURNO 4: House - Análisis de Sangre
        await TurnoModel.create({
            medico: medicoHouse._id,
            fechaHora: new Date("2026-07-17T11:00:00"),
            sede: sedeCentral._id,
            servicio: { tipo: "PRACTICA", practica: { id: "1237", codigo: "LAB101", nombre: "Análisis de Sangre", duracionTurnoEnMins: 15, costo: 8000 } },
            estado: "DISPONIBLE", costo: 8000,
            historialEstados: [{ fechaHoraIngreso: new Date(), estado: "DISPONIBLE", usuario: usuarioHouse._id, motivo: "Inicial" }]
        });

        // TURNO 5: Milk - Radiografía
        await TurnoModel.create({
            medico: medicoMilk._id,
            fechaHora: new Date("2026-07-17T12:00:00"),
            sede: sedeNorte._id,
            servicio: { tipo: "PRACTICA", practica: { id: "2002", codigo: "RX002", nombre: "Radiografía Tórax", duracionTurnoEnMins: 15, costo: 14000 } },
            estado: "DISPONIBLE", costo: 14000,
            historialEstados: [{ fechaHoraIngreso: new Date(), estado: "DISPONIBLE", usuario: usuarioMilk._id, motivo: "Inicial" }]
        });

        // TURNO 6: House - Diagnóstico
        await TurnoModel.create({
            medico: medicoHouse._id,
            fechaHora: new Date("2026-07-20T08:30:00"),
            sede: sedeCentral._id,
            servicio: { tipo: "ESPECIALIDAD", especialidad: { id: "1235", nombre: "Diagnóstico", duracionTurnoEnMins: 60, costo: 25000 } },
            estado: "DISPONIBLE", costo: 25000,
            historialEstados: [{ fechaHoraIngreso: new Date(), estado: "DISPONIBLE", usuario: usuarioHouse._id, motivo: "Inicial" }]
        });

        console.log('🔔 Sembrando notificaciones de ejemplo...');
        await NotificacionModel.create([
            {
                destinatario: SEED_IDS.USUARIO_PACIENTE,
                remitente: SEED_IDS.USUARIO_HOUSE,
                mensaje: "Su turno de Electrocardiograma fue confirmado.",
                fechaHoraCreacion: new Date(),
                leida: false
            },
            {
                destinatario: SEED_IDS.USUARIO_PACIENTE,
                remitente: SEED_IDS.USUARIO_HOUSE,
                mensaje: "Se reservó un turno para Clínica Médica.",
                fechaHoraCreacion: new Date(),
                leida: false
            },
            {
                destinatario: SEED_IDS.USUARIO_PACIENTE,
                remitente: SEED_IDS.USUARIO_HOUSE,
                mensaje: "Recordatorio: mañana tiene un turno agendado.",
                fechaHoraCreacion: new Date(),
                leida: true,
                fechaHoraLeida: new Date()
            }
        ]);

        console.log('🚀 Base de datos poblada con éxito con múltiples médicos y servicios.');

    } catch (error) {
        console.error('❌ Error ejecutando el seed:', error);
    } finally {
        await mongoose.disconnect();
    }
}


ejecutarSeed();