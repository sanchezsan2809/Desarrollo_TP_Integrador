export class Usuario {
    id
    keycloakId
    nombreUsuario
    nombre
    apellido
    email

    constructor({
        id,
        keycloakId,
        nombreUsuario,
        nombre,
        apellido,
        email
    }) {
        this.id = id
        this.keycloakId = keycloakId
        this.nombreUsuario = nombreUsuario
        this.nombre = nombre
        this.apellido = apellido
        this.email = email
    }
}