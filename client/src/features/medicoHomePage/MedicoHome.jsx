import './MedicoHomePage.css'
import GifSapo from "../../components/gifSapo/GifSapo.jsx"
import GifMosuclos from '../../components/gifMosculos/GifMosculos.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const MedicoHomePage = () => {
    const { user } = useAuth()

    const nombreCompleto = [
        user?.nombre,
        user?.apellido
    ]
        .filter(Boolean)
        .join(' ')
    return (

        <main className="medico-home">
            <div className="medico-home__decoracion medico-home__decoracion--izquierda">
                <GifSapo />
            </div>

            <section className="medico-home__card">
               

                <h1>
                    Bienvenido, Doctor/a{' '}
                    {nombreCompleto || user?.usuario.nombre || ' '}
                </h1>

                <p>
                    Desde la barra de navegación podés consultar tu agenda,
                    gestionar tus servicios y modificar tu disponibilidad.
                </p>

                <div className="medico-home__separador" />

                <p className="medico-home__mensaje">
                    Revisá tus próximos turnos y mantené actualizada tu agenda.
                </p>
            </section>

            <div className="medico-home__decoracion medico-home__decoracion--derecha">
                <GifMosuclos />
            </div>
        </main>
    )
}

export default MedicoHomePage