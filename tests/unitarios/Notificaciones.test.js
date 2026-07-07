import { describe, expect, test, beforeEach } from "@jest/globals";
import { Notificacion } from "../../server/domain/notificacion.js";
import { Usuario } from "../../server/domain/usuario.js";

//TODO Continuar corrigiendo tests unitarios para trabajar con nuevo Usuario

describe("Notificacion",()=>{
    let usuario1
    let usuario2
    beforeEach(()=>{
        usuario1 = new Usuario(
            "1234",
            "2345",
            "pizzaBirraYFaso",
            "Gastón",
            "Pietro",
            "gastonPietro@hotmail.com")
        usuario2 = new Usuario( 
            "JEJESALU3", 
            "abc123")
    })
    
    describe("constructor",()=>{
        test("debe crear una Notificacion correctamente con datos validos",()=>{
            notificacion=new Notificacion("123",usuario1,usuario2,"ESTO ES UNA NOTIFICACION")
            expect(notificacion.id).toBe("123")
            expect(notificacion.destinatario).toBe(usuario1)
            expect(notificacion.remitente).toBe(usuario2)
            expect(notificacion.mensaje).toBe("ESTO ES UNA NOTIFICACION")
        })
    })
    test("Se deberia poder marcar como leida una notificacion",()=>{
        let notificacion = new Notificacion(123,usuario1,usuario2,"TEST")
        notificacion.marcarComoLeida()

        expect(notificacion.leida).toBeTruthy()
    })
})