import "./TurnoReservadoCard.css"

const TurnoReservadoCard = (({ turno }) => {

    return(

        <article className="turno-reservado-card">
            
            <div>

                <h2>

                    {turno.servicio.nombre}

                </h2>

                <p>

                    <strong>Médico:</strong>{turno.medico.nombre}

                </p>

                <p>

                    <strong>Sede:</strong>{turno.sede.nombre}

                </p>

                <p>

                    <strong>Fecha</strong>{" "}

                    {new Date(
                        turno.fechaHora
                    ).toLocaleString()}

                </p>

            </div>

            <div className="estado">

                    Reservado

            </div>


        </article>
    )

})

export default TurnoReservadoCard