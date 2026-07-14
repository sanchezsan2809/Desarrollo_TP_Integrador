export class Plan {
    id
    nombre
    coberturasEspecialidad
    coberturasPractica
    
    constructor(nombre, coberturasEspecialidad, coberturasPractica){
        this.nombre = nombre;
        this.coberturasEspecialidad = coberturasEspecialidad ?? [];
        this.coberturasPractica = coberturasPractica ?? [];   
    }

    obtenerCoberturaEspecialidad(especialidad){
        if (!especialidad) return null;

        const cobertura = this.coberturasEspecialidad
            .find(c => c?.especialidad?.id === especialidad.id)

        return cobertura ?? null;
    }

    obtenerCoberturaPractica(practica){
        if (!practica) return null;

        const cobertura = this.coberturasPractica
            .find(c => c?.practica?.id === practica.id)

        return cobertura ?? null;
    }
}