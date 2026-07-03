import "./MisTurnosTabs.css"

const MisTurnosTabs = ({ estadoSeleccionado, onSeleccionar}) => {

    return(

        <div className="mis-turnos-tabs">

            <button
                className={
                    estadoSeleccionado === "RESERVADO"
                    ? "tab active"
                    : "tab"
                }
                onClick={() => onSeleccionar("RESERVADO")}
            >
                Próximos
            </button>

            <button
                className={
                    estadoSeleccionado === "REALIZADO"
                    ? "tab active"
                    : "tab"
                }
                onClick={() => onSeleccionar("REALIZADO")}
            >
                Historial
            </button>

        </div>
    )

}

export default MisTurnosTabs