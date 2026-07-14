import React from 'react';
import { Link } from 'react-router-dom'; 
import { IoCalendarOutline } from 'react-icons/io5'; 
import './CarritoIndicador.css';

import { useTurnoCart } from "../../hooks/useTurnoCart"


const CarritoIndicador = () => {

    const {
        cantidadTurnos,
        turnos
    } = useTurnoCart()

    const costoTotalFinal = 
        turnos.reduce(
            (total, turno) =>
                total + Number(turno.costo || 0),
            0
    )
    

   return (

        <Link
            to={'/turnos/preseleccion'}
            className="carrito-link"
        >

            <div className="carrito-contenedor">

                <div className="icono-wrapper">

                    <IoCalendarOutline
                        className="carrito-icono"
                    />

                    {cantidadTurnos > 0 && (
                        <span
                            className="carrito-badge"
                        >
                            {cantidadTurnos}
                        </span>
                    )}

                </div>

                <div className="carrito-info-texto">

                    <span
                        className="carrito-titulo"
                    >
                        Preselección
                    </span>

                    <span
                        className="carrito-subtitulo"
                    >
                        $
                        {costoTotalFinal
                            .toLocaleString(
                                'es-AR'
                            )}
                    </span>

                </div>

            </div>

        </Link>
    )
};

export default CarritoIndicador;