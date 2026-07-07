import { z } from "zod";

export const usuarioMeRequestSchema = z.object({
    headers: z.object({
        authorization: z
            .string()
            .startsWith("Bearer ")
    })
});