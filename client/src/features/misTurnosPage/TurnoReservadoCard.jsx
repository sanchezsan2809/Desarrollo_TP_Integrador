import "./TurnoReservadoCard.css"

import "./TurnoReservadoCard.css";

import {
    FaUserDoctor,
    FaLocationDot,
    FaClock
} from "react-icons/fa6";

const TurnoReservadoCard = ({ turno }) => {

    const fecha = new Date(turno.fechaHora);

    const meses = [
        "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
        "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
    ];

    const dias = [
        "Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"
    ];

    return (

        <article className="turno-reservado-card">

            <div className="fecha-card">

                <div className="mes">
                    {meses[fecha.getMonth()]}
                </div>

                <div className="dia">
                    {fecha.getDate()}
                </div>

                <div className="dia-semana">
                    {dias[fecha.getDay()]}
                </div>

                <div className="hora">
                    <FaClock />
                    {fecha.toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </div>

            </div>

            <div className="turno-info">

                <div className="card-header">

                    <h2>{turno.servicio.nombre}</h2>

                    <span className="estado">
                        {turno.estado}
                    </span>

                </div>

                <div className="detalle">

                    <FaUserDoctor className="icono" />

                    <p>

                        <strong>Médico:</strong>{" "}

                        {turno.medico.nombre}

                    </p>

                </div>

                <div className="detalle">

                    <FaLocationDot className="icono" />

                    <p>

                        <strong>Sede:</strong>{" "}

                        {turno.sede.nombre}

                    </p>

                </div>

                <div className="detalle">

                    <FaClock className="icono" />

                    <p>

                        <strong>Fecha:</strong>{" "}

                        {fecha.toLocaleDateString("es-AR")}{" "}
                        {fecha.toLocaleTimeString("es-AR", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}

                    </p>

                </div>

            </div>

        </article>

    );

};

export default TurnoReservadoCard;