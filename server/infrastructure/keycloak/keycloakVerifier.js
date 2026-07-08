import { createRemoteJWKSet, jwtVerify } from "jose";

const issuer =
    `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`;


const jwks = createRemoteJWKSet(
    new URL(`${issuer}/protocol/openid-connect/certs`)
);

export async function verifyToken(token) {

    const { payload } = await jwtVerify(
        token,
        jwks,
        {
            issuer
        }
    );

    if(payload.azp !== process.env.KEYCLOAK_CLIENT_ID) {
        throw new Error(
            `Se esperaba azp='${process.env.KEYCLOAK_CLIENT_ID}' pero llegó '${payload.azp}'`
        );
    }

    return {
        keycloakId: payload.sub,
        username: payload.preferred_username,
        email: payload.email,
        roles: payload.realm_access?.roles ?? []
    };
}