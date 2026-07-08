import { UnauthorizedError } from "../errors/appError";
import { verifyToken } from "../infrastructure/keycloak/keycloakVerifier";

export const authenticate = 
    async(req, res, next) => {

        try {

            const authorization = req.headers.authorization

            if(!authorization?.startsWith("Bearer ")){
                throw new UnauthorizedError("Token no enviado");
            }

            const token = authorization.substring(7)

            req.auth = await verifyToken(token)

            next()
        } catch(error){
            console.error(error.name);
            console.error(error.message);
            next(new UnauthorizedError("Token inválido."));
        }
    }