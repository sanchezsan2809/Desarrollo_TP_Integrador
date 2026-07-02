import { z } from "zod";


export const reservarTurnoSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        pacienteId: z.string()
    })
})

export const cancelarTurnoRequestSchema = z.object({
    params: z.object({
        id: z.string()
    }), 
    body: z.object({
        motivo: z.string(),
        idUsuario: z.string()
    })
})

export const obtenerHistorialTurnosSchema = z.object({
    params: z.object({
        pacienteId: z.string()
    }), 
    query: z.object({
        estado: z.enum(["RESERVADO", "CONFIRMADO", "CANCELADO", "REALIZADO"]).optional(),

        fechaDesde: z.string().datetime().optional()
            .transform((val) => val ? new Date(val) : undefined),

        fechaHasta: z.string().datetime().optional()
            .transform((val) => val ? new Date(val) : undefined),

        page: z.coerce.number().int().min(1).default(1),

        limit: z.coerce.number().int().min(1).max(100).default(10)
    })
})

export const modificarEstadoTurnoSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        idUsuario: z.string()
    })
})

export const generarTurnosDisponiblesSchema = z.object({})

export const modificarFechaTurnoSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        idUsuario: z.string(),
        nuevaFecha: z.iso.datetime().optional()
            .transform((val) => val ? new Date(val) : undefined)

    })
})


//TODO Buscar por nombre de médico, especialidad, práctica y sede
export const busquedaDeTurnosDisponiblesSchema = z.object({
    body: z.object({
        idPaciente: z.string(),
        nombreMedico: z.string().optional(),
        nombreEspecialidad: z.string().optional(),
        nombrePractica: z.string().optional(),
        nombreSede: z.string().optional(),
        fechaDesde: z.string().datetime().optional()
            .transform((val) => val ? new Date(val): undefined),
        fechaHasta: z.string().datetime().optional()
            .transform((val) => val ? new Date(val): undefined)
    }),
    query: z.object({
        page: z.coerce.number().optional().default(1),
        limit: z.coerce.number().int().positive().max(100).default(20)
    }).optional()
})