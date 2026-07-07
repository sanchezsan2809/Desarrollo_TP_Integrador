import { describe, expect, test, beforeEach } from "@jest/globals";
import { Medico } from "../../server/domain/medico.js";
import { Usuario } from "../../server/domain/usuario.js";
import { Practica } from "../../server/domain/practica.js";
import { Especialidad } from "../../server/domain/especialidad.js";
import { Sede } from "../../server/domain/sede.js";
import { DisponibilidadHoraria } from "../../server/domain/disponibilidadHoraria.js";
import { DiaSemana } from "../../server/domain/diaSemana.js";
describe("Médico", () => {
    let medico
    let usuario
    let especialidades
    let practicas
    let traumatologia
    let oftalmologia
    let revision
    let ecografia
    let sedes
    let disponibilidades
    let disponibilidad1
    let disponibilidad2

    beforeEach(() => {
        usuario = new Usuario(
            "1234",
            "2345", 
            "pizzaBirraYFaso",
            "Gastón",
            "Pietro",
            "gastonPietro@hotmail.com")
        
        revision = new Practica(
            "4679",
            "456789",
            "Revisión",
            30,
            5000
        )

        ecografia = new Practica("4568",
            "134514",
            "Oftalmología",
            45,
            75000
        )

        practicas = [
            revision,
            ecografia
        ]

        traumatologia = new Especialidad(
            "5645",
            "Traumatología",
            60,
            10000
        )

        oftalmologia = new Especialidad(
            "4568",
            "Oftalmología",
            45,
            75000
        )

        especialidades = [
            traumatologia,
            oftalmologia
        ]
        sedes = [
            new Sede("222", "Chacarita jr", "Gutierrez 351"),
            new Sede("555", "Hospital Italiano", "Alto Pelado, San Luis")
        ]
        disponibilidad1 =new DisponibilidadHoraria(DiaSemana.VIERNES,
                "14:30",
                "17:00"
            )
        disponibilidad2 = new DisponibilidadHoraria(DiaSemana.MARTES,
                "12:00",
                "15:00"
            )
        disponibilidades = [disponibilidad1]
        

        medico = new Medico(
            usuario,
            "4659874",
            "Marcelo Diaz",
            especialidades,
            practicas,
            sedes,
            disponibilidades
        )
        
        
    })

    test("Un médico sabe responder qué servicios (especialidades/prácticas) puede hacer", () =>{
       
        expect(medico.puedeHacerServicio(revision.id,"practica")).toBeTruthy()
        expect(medico.puedeHacerServicio(ecografia.id,"practica")).toBeTruthy()
        expect(medico.puedeHacerServicio(traumatologia.id,"especialidad")).toBeTruthy()
        expect(medico.puedeHacerServicio(oftalmologia.id,"especialidad")).toBeTruthy()

    })


    test("Un medico puede agregar una disponibilidad",()=>{
        medico.definirDisponibilidad([disponibilidad1, disponibilidad2])
        expect(medico.disponibilidades).toEqual([disponibilidad1, disponibilidad2])
        //to([disponibilidad1,disponibilidad2])
    })
    test("Un medico puede agregar un servicio",()=>{
        medico.agregarServicio(ecografia,"practica")
        expect(medico.puedeHacerServicio(ecografia.id,"practica")).toBeTruthy()
    })
    test("Un medico puede eliminar un servicio",()=>{
        medico.eliminarServicio("4568","especialidad")
        expect(medico.puedeHacerServicio(oftalmologia,"especialidad")).toBeFalsy()
    })
})