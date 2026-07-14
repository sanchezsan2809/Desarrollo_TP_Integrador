import React from 'react';
import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from './features/layout/Layout.jsx';
import HomePacientePage from './features/homePacientePage/HomePacientePage.jsx';
import HistorialTurnosPage from './features/historialTurnos/HistorialTurnosPage.jsx';
import NotificacionesPage from './features/notificacionesPage/NotificacionesPage.jsx';
import BusquedaDeTurnosPage from './features/busquedaTurnos/BusquedaTurnosPage.jsx';
import PreseleccionTurnosPage from './features/preseleccionTurnos/PreseleccionTurnosPage.jsx';
import ServiciosPage from './features/serviciosPage/ServiciosPage.jsx';
import MedicosPage from './features/medicosPage/MedicosPage.jsx';
import ComoFuncionaPage from './features/comoFuncionaPage/ComoFuncionaPage.jsx';
import ReservaExitosaPage from './features/reservaExitosaPage/ReservaExitosaPage.jsx';
import MisTurnosPage from './features/misTurnosPage/MisTurnosPage.jsx';
import MedicoHomePage from './features/medicoHomePage/MedicoHome.jsx';
import MedicoAgendaPage from './features/medicoAgendaPage/MedicoAgendaPage.jsx';

import Registrar from './components/registrar/Registrar.jsx';
import GestionServicios from './components/gestionServicios/GestionServicios.jsx';
import Disponibilidad from './components/disponibilidad/Disponibilidad.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import { TurnoCartProvider } from './context/carritoTurnosContext.jsx';
import { useAuth } from './context/AuthContext.jsx';

function HomePorRol() {
    const {
        isAuthenticated,
        isMedico,
        isPaciente
    } = useAuth();

    if (!isAuthenticated) {
        return <HomePacientePage />;
    }

    if (isMedico) {
        return (
            <Navigate
                to="/medicoHome"
                replace
            />
        );
    }

    if (isPaciente) {
        return <HomePacientePage />;
    }

    return <HomePacientePage />;
}

function App() {
    return (
        <TurnoCartProvider>
            <Routes>
                <Route
                    path="/"
                    element={<Layout />}
                >
                    <Route
                        index
                        element={<HomePorRol />}
                    />

                    <Route
                        path="historialDeTurnos"
                        element={<HistorialTurnosPage />}
                    />

                    <Route
                        path="servicios"
                        element={<ServiciosPage />}
                    />

                    <Route
                        path="medicos"
                        element={<MedicosPage />}
                    />

                    <Route
                        path="reserva-exitosa"
                        element={<ReservaExitosaPage />}
                    />

                    <Route
                        path="mis-turnos"
                        element={<MisTurnosPage />}
                    />

                    <Route
                        path="busquedaDeTurnos"
                        element={
                            <ProtectedRoute
                                allowedRoles={['PACIENTE']}
                            >
                                <BusquedaDeTurnosPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="turnos/preseleccion"
                        element={
                            <ProtectedRoute
                                allowedRoles={['PACIENTE']}
                            >
                                <PreseleccionTurnosPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="como-funciona"
                        element={<ComoFuncionaPage />}
                    />

                    <Route
                        path="notificaciones"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    'MEDICO',
                                    'PACIENTE'
                                ]}
                            >
                                <NotificacionesPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="registrar"
                        element={<Registrar />}
                    />

                    <Route
                        path="agenda"
                        element={
                            <ProtectedRoute
                                allowedRoles={['MEDICO']}
                            >
                                <MedicoAgendaPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="medicoHome"
                        element={
                            <ProtectedRoute
                                allowedRoles={['MEDICO']}
                            >
                                <MedicoHomePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="gestionDeServicios"
                        element={
                            <ProtectedRoute
                                allowedRoles={['MEDICO']}
                            >
                                <GestionServicios />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="disponibilidadHoraria"
                        element={
                            <ProtectedRoute
                                allowedRoles={['MEDICO']}
                            >
                                <Disponibilidad />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </TurnoCartProvider>
    );
}

export default App;