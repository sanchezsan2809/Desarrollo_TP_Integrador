import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificacionesProvider } from './context/NotificacionesContext';

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <NotificacionesProvider>
                    <App />
                </NotificacionesProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();