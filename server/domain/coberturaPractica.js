import { Practica } from "./practica.js";
import { Turno } from "./turno.js";

export class CoberturaPractica {
    constructor(practica,nivel,porcentaje) {
        this.practica = practica;
        this.nivel = nivel;
        this.porcentaje = Math.max(Math.min(Number(porcentaje ?? 0), 100),0)
    }

}