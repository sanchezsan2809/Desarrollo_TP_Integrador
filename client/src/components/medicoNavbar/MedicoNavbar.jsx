import './MedicoNavbar.css'

import { Link } from 'react-router-dom'

import EventNoteIcon from '@mui/icons-material/EventNote'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { MdAccountCircle } from 'react-icons/md'

import logo from '../../assets/osecroacklogo.png'

import { useAuth } from '../../context/AuthContext'

import NotificacionesIndicador from '../header/NotificacionesIndicador'
import UserMenu from '../header/UserMenu.jsx'

import { useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MobileMenu from "../header/MobileMenu.jsx";

export default function MedicoNavbar() {

    const [menuOpen, setMenuOpen] = useState(false)
    const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
    const userContainerRef = useRef(null)
    const { logout } = useAuth()

    const userMenuItems = [
        {
            type: 'button',
            label: 'Cerrar sesión',
            onClick: logout,
            isLogout: true
        }
    ]

    return (
        <>
            <nav className="medico-navbar">

                <div className="medico-navbar-left">

                    <Link to="/medico">
                        <img
                            src={logo}
                            alt="Logo"
                            className="logoHeader"
                        />
                    </Link>

                    <Link
                        to="/medico"
                        className="medico-link"
                    >
                        <EventNoteIcon />
                        Agenda
                    </Link>

                    <Link
                        to="/dh"
                        className="medico-link"
                    >
                        <ScheduleIcon />
                        Disponibilidad
                    </Link>

                    <Link
                        to="/gs"
                        className="medico-link"
                    >
                        <MedicalServicesIcon />
                        Servicios
                    </Link>

                </div>

                <div className="medico-navbar-right">

                    <NotificacionesIndicador />

                     <div className="user-container" ref={userContainerRef}>
                        <button
                            className="user-icon"
                            onClick={() => setMenuUsuarioAbierto((prev) => !prev)}
                            aria-label="Abrir menú de usuario"
                            title="Abrir menú de usuario"
                        >
                            <MdAccountCircle />
                        </button>

                        <UserMenu
                            isOpen={menuUsuarioAbierto}
                            onClose={() => setMenuUsuarioAbierto(false)}
                            items={userMenuItems}
                            containerRef={userContainerRef}
                        />
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
        </>
    )
}