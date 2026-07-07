import { describe, expect, test, beforeEach } from "@jest/globals";
import { factoryNotificacion } from "../../server/domain/factoryNotificacion.js";
import { Turno } from "../../server/domain/turno.js";
import { Notificacion } from "../../server/domain/notificacion.js";
import { Medico } from "../../server/domain/medico.js";
import { Paciente } from "../../server/domain/paciente.js";
import { ObraSocial } from "../../server/domain/obraSocial.js";
import { Plan } from "../../server/domain/plan.js";
import { CoberturaPractica } from "../../server/domain/coberturaPractica.js";
import { Usuario } from "../../server/domain/usuario.js";
import { Practica } from "../../server/domain/practica.js";
import { Especialidad } from "../../server/domain/especialidad.js";
import { Sede } from "../../server/domain/sede.js";
import { DisponibilidadHoraria } from "../../server/domain/disponibilidadHoraria.js";
import { EstadoTurno } from "../../server/domain/estadoTurno.js";

describe("factoryNotificacion", () => {
    describe("segunEstadoTurno", () => {
        let medico
        let usuario
        let revision
        let especialidades
        let practicas
        let sedeChacarita
        let sedeItaliano
        let sedes
        let disponibilidades
        let turno
        let usuario2
        let cobertura
        let plan
        let costo
        let obraSocial
        let paciente
        let turno2
        beforeEach(() => {
            usuario = new Usuario(
                22,
                23,
                "will_wiliams",
                "Will",
                "Williams",
                "willWilliams@gmail.com"
            )

            revision = new Practica(
                "4679",
                "456789",
                "Revisión",
                30,
                5000
            )

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

            practicas = [
                revision,
                new Practica(
                    "6598",
                    "456745",
                    "Ecografía",
                    45,
                    10000
                )
            ]

            sedeChacarita = new Sede( "Chacarita jr", "Gutierrez 351")
            sedeItaliano = new Sede( "Hospital Italiano", "Alto Pelado, San Luis")

            sedes = [
                sedeChacarita,
                sedeItaliano
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
            medico = new Medico(
                usuario,
                "1234",
                "Roberto Gimenez",
                especialidades,
                practicas,
                sedes,
                disponibilidades
            )
            
            costo = 5000

            usuario2 = new Usuario(
                "5678",
                "6789",
                "thomas_thompson",
                "Thomas",
                "Thompson",
                "thomasThompson@yahoo.com.ar")
            cobertura = new CoberturaPractica(revision, "TOTAL")
            plan = new Plan( "basico", [], [cobertura])
            obraSocial = new ObraSocial( "Osde", [plan])

            paciente = new Paciente(
                usuario2,
                "458990",
                "Tomas",
                obraSocial,
                plan
            )

            turno = new Turno(medico, new Date(), sedeChacarita, "DISPONIBLE", costo)
          
            turno.asignarPaciente(paciente) //esto pasa a reservado, por eso tuve que crear otro turno en disponible para probar el primer test
            turno.asignarPractica(revision)
            turno2 = new Turno(medico, new Date(), sedeChacarita, "DISPONIBLE", costo)
            
        })


        test("Al estar diponible el estado de turno no debe generar notificacion", () => {
            expect(() => factoryNotificacion.crearSegunEstadoTurno(turno2)).toThrow("No hay cambios en el turno para notificar")
        })

        test("cambiamos a turno reservado y debe dar una notificacion", () => {
            
            //turno.actualizarEstado(EstadoTurno.RESERVADO, medico.usuario, "debe revisarse")

            const notificacionEsperada = new Notificacion(
                turno.id,
                turno.medico.usuario,
                turno.paciente.usuario,
                `Se reservó un turno para ${turno.servicio.nombre}`
            )
            
            let notificacion = factoryNotificacion.crearSegunEstadoTurno(turno) 

            expect(notificacion).toEqual(notificacionEsperada)
        })

        test("cambiamos a turno cancelado por parte del medico y debe dar una notificacion", () => {
            const turno = new Turno(medico, new Date(), sedeChacarita, "CANCELADO", costo) //modificamos manual
            turno.asignarPaciente(paciente)
            turno.asignarPractica(revision)

            turno.actualizarEstado(EstadoTurno.CANCELADO, medico.usuario, "Tenia un compromiso")

            const notificacionEsperada = new Notificacion(
                turno.id,
                turno.destinatarioUltimoCambioEstado(), 
                turno.remitenteUltimoCambioEstado(), 
                "El turno ha sido cancelado por la contraparte."
            )
            
            expect(factoryNotificacion.crearSegunEstadoTurno(turno)).toEqual(notificacionEsperada)
        })

        test("Genera correctamente el recordatorio para paciente y para médico", () => {
            
            const mensajeBase = `Recordatorio: Mañana tiene un turno agendado a las ${turno.fechaHora.toLocaleTimeString()}`;

            const recordatorioEsperado1 = new Notificacion(turno.id, turno.paciente.usuario, turno.paciente.usuario, mensajeBase)
            const recordatorioEsperado2 = new Notificacion(turno.id, turno.medico.usuario, turno.medico.usuario, mensajeBase)

            expect(factoryNotificacion.crearRecordatorio(turno)).toEqual([recordatorioEsperado1,recordatorioEsperado2])
            
        })



    })
})