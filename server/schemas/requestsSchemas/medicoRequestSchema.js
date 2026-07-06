import { z } from "zod";

export const consultarTurnosSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    query: z.object({
        idPaciente: z.string().optional(),
        
        page: z.coerce.number().int().min(1).default(1),

        limit: z.coerce.number().int().min(1).max(100).default(10)
    })
})

export const consultarDisponibilidadSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        tipo: z.enum(["practica", "especialidad"]),
        idServicio: z.string().min(5)
    })
})

export const modificarDisponibilidadSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.array(
        z.object({
            diaSemana: z.string().min(5), // duda, porque es un enum
            horaDesde: z.string().min(4),
            horaHasta: z.string().min(4)
        })
    ).nonempty("La lista no puede estar vacía")
})

export const especialidadSchema = z.object({
    id: z.string(),
    nombre: z.string().min(1),
    duracionTurnoEnMins: z.number().int().positive(),
    costo: z.number().positive()
}).strict()

export const practicaSchema = z.object({
    id: z.string(),
    codigo: z.string().min(1),
    nombre: z.string().min(1),
    duracionTurnoEnMins: z.number().int().positive(),
    costo: z.number().positive()
}).strict()

export const agregarServicioSchema = z.object({
    params: z.object({
        idMedico: z.string()
    }),
    body: z.object({
        tipoServicio: z.enum(["practica", "especialidad"]),
        nuevoServicioDTO: z.union([especialidadSchema, practicaSchema])
    })
})

export const eliminarServicioSchema = z.object({
    params: z.object({
        idMedico: z.string(),
        tipo: z.enum(["practica", "especialidad"]),
        idServicio: z.string()
    })
})

export const modificarServicioSchema = z.object({
    params: z.object({
        idMedico: z.string(),
        tipo: z.enum(["practica", "especialidad"]),
        idServicio: z.string()
    }),
    body: z.union([especialidadSchema, practicaSchema])
})
