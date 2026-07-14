import { EstadoTurno } from "./estadoTurno.js"
import { CambioEstadoTurno } from "./cambioEstadoTurno.js";

export class Turno {
    id
    medico
    paciente
    fechaHora
    sede
    servicio
    estado
    historialEstados
    costo
    
    constructor(medico, fechaHora, sede, estado, costo) {
        
        this.medico = medico, 
        this.fechaHora = fechaHora,
        this.sede = sede, 
        this.estado = estado,
        this.historialEstados = [],
        this.costo = costo
    }

    actualizarEstado(nuevoEstado, usuario, motivo){
        this.estado = nuevoEstado 
        
        const cambioEstado = new CambioEstadoTurno(new Date()
        , nuevoEstado
        , this.id
        , usuario
        , motivo) 

        this.historialEstados.push(cambioEstado) 
    }

    asignarPaciente(paciente){
        this.paciente = paciente
        this.actualizarEstado(
            EstadoTurno.RESERVADO,
            paciente.usuario,
            `El paciente ${paciente.id} reservó el turno`
        )
        
    }

    asignarPractica(practica){
        this.servicio = practica
    }

    asignarEspecialidad(especialidad){
        this.servicio = especialidad
    }

    asignarServicio(servicio){
        this.servicio = servicio
    }
    

    puedeModificar(usuarioId){
        return this.esPaciente(usuarioId) ||
            this.esMedico(usuarioId)
    }

    esPaciente(usuarioId){
        return this.paciente.usuario.id === usuarioId
    }

    esMedico(usuarioId){
        return this.medico.usuario.id === usuarioId
    }

    
    remitenteUltimoCambioEstado(){
        const historial = this.historialEstados || []
        const ultimo = historial.at(-1)

        if(!ultimo){
            return this.medico.usuario
        }

        return ultimo.usuario
    }
    

    destinatarioUltimoCambioEstado(){
        const id = this.remitenteUltimoCambioEstado().id

        if(this.esPaciente(id)) return this.medico.usuario
        if(this.esMedico(id)) return this.paciente.usuario

        
        throw new Error("Usuario inválido para este turno")
    }

    puedeCancelarse(){
        if(
            this.estado === EstadoTurno.CANCELADO ||
            this.estado === EstadoTurno.REALIZADO
        ){
            return false
        }

        const ahora = new Date()
        const fechaTurno = this.fechaHora

        const diferenciaMs = fechaTurno - ahora
        const unaHoraMs = 60 * 60 * 1000

        return diferenciaMs >= unaHoraMs
    }

    obtenerUsuario(idUsuario){
        let usuario = null
        if(this.paciente && this.paciente.usuario.id === idUsuario){
            usuario = this.paciente.usuario
        } else if(this.medico && this.medico.usuario.id === idUsuario){
            usuario = this.medico.usuario
        }

        return usuario
    }

    obtenerUsuarioMedico(){
        return this.medico.usuario
    }

    solicitarCambioFecha(fecha, usuario, motivo){
        this.fechaHora = fecha
        this.actualizarEstado(
            EstadoTurno.RESERVADO,
            usuario, 
            motivo
        )
    }

    confirmarCambioFecha(usuario){
        this.fechaHora = this.fechaHoraPropuesta
        this.fechaHoraPropuesta = null

        this.actualizarEstado(
            EstadoTurno.CONFIRMADO, 
            usuario,
            "Cambio de fecha confirmado"
        )
    }

    rechazarCambioFecha(usuario){
        this.fechaHoraPropuesta = null

        this.actualizarEstado(
            EstadoTurno.CONFIRMADO,
            usuario,
            "Cambio de fecha rechazado"
        )
    }

    sePuedeCancelar(fecha){
        return (this.fechaHora - fecha) >= 3600000 //una hora en milisegundos
    }
    getServicio(){
        return this.servicio
    }
}
