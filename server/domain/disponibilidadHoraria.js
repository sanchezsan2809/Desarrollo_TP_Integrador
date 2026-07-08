import { horaAMinutos } from "./fecha.js";

export class DisponibilidadHoraria {
    constructor(diaSemana, horaDesde, horaHasta) {
        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde;
        this.horaHasta = horaHasta;
    }

    validarSesion(servicio) {
        const minutosDesde = horaAMinutos(this.horaDesde);
        const minutosHasta = horaAMinutos(this.horaHasta);

        const duracionDisponibilidad = minutosHasta - minutosDesde;
        
        const duracionServicio = servicio.duracionTurnoEnMins;

        return duracionDisponibilidad >= duracionServicio;
    }
    
}
