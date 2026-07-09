import './Navbar.css'
import { Link } from 'react-router-dom';
import CarritoIndicador from './CarritoIndicador.jsx';
import NotificacionesIndicador from './NotificacionesIndicador';
import { MdAccountCircle } from "react-icons/md";
import logo from '../../assets/osecroacklogo.png'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx';
import LoginCard from '../loginCard/LoginCard.jsx'
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import Searchbar from './Searchbar.jsx'
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MobileMenu from "./MobileMenu";



const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [mostrarLogin, setMostrarLogin] = useState(false)

    const {
        user,
        isAuthenticated,
        logout
    } = useAuth()
 
    
    return (
        <header className="navbar-bg">
            <nav className="navbar">

                 

                <div className="navbar-seccion left">

                    <div className="logo">
                        <Link to={'/'}
                        aria-label="Inicio"
                        title="Inicio"
                        > <img src={logo} className="logoHeader" alt="Logo OSECROACK"></img> </Link>
                    </div>

                    <Link to="/servicios" className='nav-link'>
                        Servicios
                    </Link>

                    <Link to="/medicos" className='nav-link'>
                        Medicos
                    </Link>

                    <Link to='/como-funciona' className='nav-link optional-link'>
                        Cómo funciona
                    </Link>


                </div>

                <div className='navbar-seccion centro'>
                    <div className="quick-actions">

                        <Link
                            to="/busquedaDeTurnos"
                            className="action-button"
                        >

                            <SearchIcon className="action-icon" />

                            <span className="action-text">
                                Reservar Turnos
                            </span>

                        </Link>

                        <Link
                            to="/historialDeTurnos"
                            className="action-button secondary"
                        >

                            <HistoryIcon className="action-icon" />

                            <span className="action-text">
                                Historial
                            </span>

                        </Link>

                    </div>

                </div>
                
                <div className="navbar-seccion right">

                    
                    <CarritoIndicador />
                    
                    <Searchbar />
                    <div class="notificaciones-container">
                        <NotificacionesIndicador />
                    </div>
                    <div className="user-container">
                        {
                            isAuthenticated
                            ?(
                                <>
                                    <button
                                        onClick={logout}
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            )
                            :(
                                <button
                                    className='user-icon'
                                    onClick={() =>
                                        setMostrarLogin(prev => !prev)
                                    }
                                        aria-label="Abrir menú de usuario"
                                        title="Abrir menú de usuario"
                                    >
                                        
                                        <MdAccountCircle />
                                </button>
                            )
                            
                        }
                        
                        {mostrarLogin && (
                            <LoginCard
                                onClose={() => setMostrarLogin(false)}
                            />
                        )}

                    </div>           
                </div>
                <button
                    className="hamburger-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {
                        menuOpen
                            ? <CloseIcon />
                            : <MenuIcon />
                    }
                </button>
            </nav>
            {
                menuOpen && (
                    <MobileMenu
                        onClose={() => setMenuOpen(false)}
                    />
                )
            }
        </header>
    );
};

export default Navbar;
