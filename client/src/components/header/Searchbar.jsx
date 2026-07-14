import './Searchbar.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const opciones = [
    {
        titulo: "Servicios",
        url: "/servicios"
    },
    {
        titulo: "Personal medico",
        url: "/medicos"
    },
    {
        titulo: "Notificaciones",
        url: "/notificaciones"
    },
    {
        titulo: "Buscar turnos nuevos",
        url: "/busquedaDeTurnos"
    },
    {
        titulo: "Historial de turnos",
        url: "mis-turnos"
    },
    {
        titulo: "Como sacar turnos",
        url: "/como-funciona"
    }
];

const Searchbar = () =>{

    const [texto, setTexto] = useState("");

    const resultados = opciones.filter(opcion =>
        opcion.titulo.toLowerCase()
            .includes(texto.toLowerCase())
    );

    return(
        <>
        <div className='search-container'>
            <input className='search-input'
            type="text" 
            value={texto}
            placeholder='Buscar servicios disponibles, medicos...' 
            onChange={(e) => setTexto(e.target.value)}
            />

             {texto.length > 0 && (
                <ul className="search-results">

                    {resultados.map(opcion => (
                        <li key={opcion.url}>
                            <Link to={opcion.url}>
                                {opcion.titulo}
                            </Link>
                        </li>
                    ))}

                </ul>
            )}

        </div>
        </>
    );
};

export default Searchbar;