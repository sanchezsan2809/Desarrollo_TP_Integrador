import { Especialidad } from "./especialidad.js";
import { Turno } from "./turno.js";

export class CoberturaEspecialidad {
    constructor(especialidad,nivel, porcentaje) {
        this.especialidad = especialidad;
        this.nivel = nivel;
        this.porcentaje = Math.max(Math.min(Number(porcentaje ?? 0), 100),0)
    }

}