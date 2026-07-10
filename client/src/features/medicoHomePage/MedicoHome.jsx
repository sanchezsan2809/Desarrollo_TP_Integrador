import './MedicoHomePage.css'
import GifSapo from "../../components/gifSapo/GifSapo.jsx";
import BotonesHome from "../../components/botonesHome/BotonesHome.jsx";
import GifMosuclos from '../../components/gifMosculos/GifMosculos.jsx';
import HeroCarousel from '../../components/heroCarousel/HeroCarousel.jsx';

const MedicoHomePage = () => {
    return (
        <div className="home-body">
            <div className="contenedor-gif sapo">
                <GifSapo />
            </div>
            
            <div className="contenedor-bienvenida">

                Bienvenido, Doctor/a 

            </div>

            
            <div className="contenedor-gif bicho">
                <GifMosuclos />
            </div>
        </div>
    );
};

export default MedicoHomePage;