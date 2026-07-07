import { describe, expect, test, beforeEach } from "@jest/globals";
import { Turno } from "../../server/domain/turno.js";
import { Medico } from "../../server/domain/medico.js";
import { Paciente } from "../../server/domain/paciente.js";
import { ObraSocial } from "../../server/domain/obraSocial.js";
import { Plan } from "../../server/domain/plan.js";
import { CoberturaPractica } from "../../server/domain/coberturaPractica.js";
import { CambioEstadoTurno } from "../../server/domain/cambioEstadoTurno.js";
import { Usuario } from "../../server/domain/usuario.js";
import { Practica } from "../../server/domain/practica.js";
import { Sede } from "../../server/domain/sede.js";
import { DisponibilidadHoraria } from "../../server/domain/disponibilidadHoraria.js";
import { Especialidad } from "../../server/domain/especialidad.js";
import { EstadoTurno } from "../../server/domain/estadoTurno.js";



describe("CambioEstadoTurno", () => {

    describe("Constructor", () =>{
        let sedeChacarita
        let sedeItaliano
        let sedes
        let revision
        let practicas
        let especialidades
        let disponibilidades
        let usuario
        let medico
        let fechaHora
        let usuario2
        let cobertura
        let plan
        let obraSocial
        let paciente
        let turno
        let fechaDeHoy
        let motivo
        let cambioEstadoTurno

        beforeEach(() => {
            
            sedeChacarita = new Sede("222", "Chacarita jr", "Gutierrez 351")
            sedeItaliano = new Sede("555", "Hospital Italiano", "Alto Pelado, San Luis")

            sedes = [
                sedeChacarita,
                sedeItaliano
            ]

            revision = new Practica(
                "4679",
                "456789",
                "Revisión",
                30,
                5000
            )

            practicas = [
                revision
            ]

            especialidades = [
                new Especialidad("5645",
                    "Traumatología",
                    60,
                    10000
                ),
                new Especialidad("4568",
                    "Oftalmología",
                    45,
                    75000
                )
            ]

            disponibilidades = [
                new DisponibilidadHoraria("VIERNES",
                    "14:30",
                    "17:00"
                ),
                new DisponibilidadHoraria("MARTES",
                    "12:00",
                    "15:00"
                )
            ]

            usuario = new Usuario(
                22, 
                23,
                "will_wiliams", 
                "Will",
                "Williams",
                "willWilliams@gmail.com"
            )

            medico = new Medico(
                "1234",
                usuario,
                "1234",
                "William",
                especialidades,
                practicas,
                sedes,
                disponibilidades
            )

            fechaHora = new Date('2026-05-05T14:00:00')

            usuario2 = new Usuario(
                "5678",
                "6789",
                "thomas_thompson",
                "Thomas",
                "Thompson", 
                "thomasThompson@yahoo.com.ar")
                
            cobertura = new CoberturaPractica(revision, "TOTAL")
            plan = new Plan("123", "basico", [], [cobertura])
            obraSocial = new ObraSocial("123", "Osde", [plan])

            paciente = new Paciente(
                "5678",
                usuario2,
                "458990",
                "George",
                obraSocial,
                plan
            )

            turno= new Turno(
                medico,
                fechaHora,
                sedeChacarita,
                EstadoTurno.DISPONIBLE,
                5000
            )

            turno.asignarPaciente(paciente)
            turno.asignarPractica(revision)

            fechaDeHoy = new Date()
            motivo = "yipitiyep"

            cambioEstadoTurno = new CambioEstadoTurno(
                fechaDeHoy, 
                EstadoTurno.RESERVADO,
                turno.id,
                usuario2,
                motivo

            )
        })

        test ("Debe generar un cambioEstadoTurno exitosamente", () =>{

            expect(cambioEstadoTurno.fechaHoraIngreso).toBe(fechaDeHoy)
            expect(cambioEstadoTurno.estado).toBe(EstadoTurno.RESERVADO)
            expect(cambioEstadoTurno.turnoId).toBe(turno.id)
            expect(cambioEstadoTurno.usuario).toBe(usuario2)
            expect(cambioEstadoTurno.motivo).toBe(motivo)
            

            expect(cambioEstadoTurno).toMatchObject({
                fechaHoraIngreso: fechaDeHoy, 
                estado: EstadoTurno.RESERVADO,
                turno: turno.id,
                usuario: usuario2,
                motivo: motivo
                
            })

        })

    })

})