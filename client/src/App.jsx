//import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Layout from './features/layout/Layout.jsx';
import HomePacientePage from './features/homePacientePage/HomePacientePage.jsx';
import HistorialTurnosPage from './features/historialTurnos/HistorialTurnosPage.jsx';
import NotificacionesPage from './features/notificacionesPage/NotificacionesPage.jsx';
import BusquedaDeTurnosPage from './features/busquedaTurnos/BusquedaTurnosPage.jsx';
import { TurnoCartProvider } from './context/carritoTurnosContext.jsx';
import PreseleccionTurnosPage from './features/preseleccionTurnos/PreseleccionTurnosPage.jsx'
import Registrar from './components/registrar/Registrar.jsx';
import MedicoAgendaPage from './features/pages/medico/MedicoAgendaPage.jsx';
import GestionServicios from './components/gestionServicios/GestionServicios.jsx'
import Disponibilidad from './components/disponibilidad/Disponibilidad.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ServiciosPage from './features/serviciosPage/ServiciosPage.jsx';
import MedicosPage from './features/medicosPage/MedicosPage.jsx';
import ComoFuncionaPage from './features/comoFuncionaPage/ComoFuncionaPage.jsx';
import MedicoHomePage from './features/medicoHomePage/medicoHomePage.jsx';
import MedicoDashboard from './features/medicoHomePage/medicoHomePage.jsx';
import ReservaExitosaPage from './features/reservaExitosaPage/ReservaExitosaPage.jsx';
import MisTurnosPage from './features/misTurnosPage/MisTurnosPage.jsx';
function App() {
  return (


    //TODO Pantallas de Disponibilidad de Médicos
    //TODO Pantallas de Gestión de Servicios
    //TODO Terminar pantallas de Búsqueda de Turnos
    //TODO Pantallas de Visualización de Notificaciones
    //TODO Iniciar Sesión Card
    <TurnoCartProvider>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePacientePage />} />
          <Route path="/historialDeTurnos" element={<HistorialTurnosPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/medicos" element={<MedicosPage />} />
          <Route path="/busquedaDeTurnos" element={<BusquedaDeTurnosPage />} />
          <Route path="/turnos/preseleccion" element={<PreseleccionTurnosPage />} />
          <Route path="/reserva-exitosa" element={<ReservaExitosaPage />}/>
          <Route path="/mis-turnos" element={<MisTurnosPage />}/>
          <Route path="/como-funciona" element={<ComoFuncionaPage />} />
          <Route path="/notificaciones" element={<NotificacionesPage/>}/>
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/medico" element={
              <ProtectedRoute
                allowedRoles={['MEDICO']}
              >
                <MedicoDashboard />
              </ProtectedRoute>

            } />
          <Route 
            path="/gs" 
            element={
            <ProtectedRoute
              allowedRoles={['MEDICO']}
            >
              <GestionServicios />
            </ProtectedRoute>} />
          <Route 
            path="/dh" 
            element={
            <ProtectedRoute
              allowedRoles={['MEDICO']}
            >
              <Disponibilidad />
            </ProtectedRoute>} 
          />
        </Route>
      </Routes>

    </TurnoCartProvider>
  );
}

export default App;
