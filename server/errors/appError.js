export class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode,
        this.status = this.statusCode >= 500? "error": "fail",
        this.timestamp = new Date().toISOString()
    }
}
export class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400)
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404)
    }
}

export class TurnoNotFoundError extends AppError{
    constructor(message){super(message, 404)}
}

export class PacienteNotFoundError extends AppError{
    constructor(message){super(message, 404)}
}

export class MedicoNotFoundError extends AppError{
    constructor(message){super(message, 404)}
}

export class ConflictError extends AppError{
    constructor(message){super(message, 409)}
}

export class NotAllowedError extends AppError{
    constructor(message){super(message, 405)}
}

export class UnprocessableEntityError extends AppError{
    constructor(message){super(message, 422)}
}

export class ValidationError extends AppError{
    constructor(message){super(message, 403)}
}

export class UnauthorizedError extends AppError{
    constructor(message){super(message, 401)}
}