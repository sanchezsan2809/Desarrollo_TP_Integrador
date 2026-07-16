import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'

import {
    Card,
    Box,
    Typography,
    IconButton,
    Stack,
    TextField,
    Button,
    Alert
} from '@mui/material'

import { login, decodeJwt } from '../../services/authService'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usuariosService } from '../../services/api'
import './LoginCard.css'

const BRAND_GREEN = '#3e8f14'
const BRAND_GREEN_HOVER = '#34780f'
const BRAND_TEXT = '#2c3e50'

const textFieldSx = {
    // Forzamos a que el TextField mantenga siempre una altura mínima saludable
    minHeight: '56px', 
    '& .MuiOutlinedInput-root': {
        height: '56px', // Asegura que la caja del input no se reduzca a 0px
        borderRadius: '12px',
        fontFamily: '"Sour Gummy", sans-serif',
        '& fieldset': {
            borderColor: '#dde4ec'
        },
        '&:hover fieldset': {
            borderColor: BRAND_GREEN
        },
        '&.Mui-focused fieldset': {
            borderColor: BRAND_GREEN
        }
    },
    '& .MuiInputLabel-root': {
        fontFamily: '"Sour Gummy", sans-serif',
        // Aseguramos que la etiqueta se posicione correctamente al transformarse
        transform: 'translate(14px, 16px) scale(1)', 
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)', // Esto evita que colisione al irse arriba
        },
        '&.Mui-focused': {
            color: BRAND_GREEN
        }
    }
}

const LoginCard = ({ onClose }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const { login: authLogin } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const tokens = await login(username, password);
            const me = await usuariosService.obtenerUsuarioActual(tokens.access_token);

            authLogin({
                token: tokens.access_token,
                refreshToken: tokens.refresh_token,
                user: me
            });

            onClose();

            switch (me.rol) {
                case "MEDICO":
                    navigate("/medico");
                    break;
                case "ADMIN":
                    navigate("/admin");
                    break;
                default:
                    navigate("/");
                    break;
            }
        } catch(err) {
            setError('Usuario o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card
            className="login-card"
            sx={{
                position: { xs: 'fixed', sm: 'absolute' },
                // En móviles lo despegamos un poco más del header de emergencias
                top: { xs: '85px', sm: '60px' }, 
                right: { xs: '50%', sm: 0 },
                transform: { xs: 'translateX(50%)', sm: 'none' }, 
                
                width: { xs: '90%', sm: 340 },
                maxWidth: '340px',
                minWidth: '280px',

                borderRadius: '16px',
                border: '1px solid #e8eef5',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',

                p: { xs: 2.5, sm: 3 }, 
                zIndex: 1000,
                fontFamily: '"Sour Gummy", sans-serif',
                boxSizing: 'border-box'
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: '"Sour Gummy", sans-serif',
                        fontWeight: 600,
                        color: BRAND_TEXT
                    }}
                >
                    Iniciar sesión
                </Typography>

                <IconButton
                    size="small"
                    onClick={onClose}
                    aria-label="Cerrar"
                    sx={{
                        color: '#8a95a3',
                        '&:hover': {
                            color: BRAND_GREEN,
                            backgroundColor: '#f4f8f1'
                        }
                    }}
                >
                    ✕
                </IconButton>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        fontFamily: '"Sour Gummy", sans-serif',
                        borderRadius: '12px',
                        mb: 1.5
                    }}
                >
                    {error}
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                mt={1}
            >
                {/* Usamos flexGrow: 0 y prevenimos que Stack encoja sus elementos hijos
                */}
                <Stack spacing={2.5} sx={{ '& > *': { flexShrink: 0 } }}>
                    <TextField
                        label="Usuario"
                        type="text"
                        name="username"
                        fullWidth
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={textFieldSx}
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        name="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={textFieldSx}
                    />

                    <Button
                        className="boton-iniciar-sesion"
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontFamily: '"Sour Gummy", sans-serif',
                            fontWeight: 600,
                            fontSize: '1rem',
                            height: '48px', // Altura fija garantizada para el botón
                            backgroundColor: BRAND_GREEN,
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: BRAND_GREEN_HOVER,
                                boxShadow: 'none'
                            }
                        }}
                    >
                        {loading ? 'Ingresando...' : 'Iniciar sesión'}
                    </Button>
                </Stack>
            </Box>

            <Box
                mt={2.5}
                display="flex"
                flexDirection="column"
                gap={1.5}
            >
                <Link to="/recuperar-password" className="login-card-link">
                    ¿Olvidaste tu contraseña?
                </Link>

                <Typography variant="body2" className="login-card-footer-text">
                    ¿No tenés cuenta?{' '}
                    <Link
                        to="/registrar"
                        className="login-card-link"
                        onClick={onClose}
                    >
                        Registrarse
                    </Link>
                </Typography>
            </Box>
        </Card>
    )
}

export default LoginCard