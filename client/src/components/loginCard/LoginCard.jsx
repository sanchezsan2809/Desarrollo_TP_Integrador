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

import { login } from '../../services/authService'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './LoginCard.css'

const BRAND_GREEN = '#3e8f14'
const BRAND_GREEN_HOVER = '#34780f'
const BRAND_TEXT = '#2c3e50'

const textFieldSx = {
    '& .MuiOutlinedInput-root': {
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

        try{

            const auth = await login(username, password)

            localStorage.setItem('token', auth.access_token)
            localStorage.setItem('refreshToken', auth.refresh_token)

            const decoded = jwtDecode(auth.access_token)

            const roles = decoded.realm_access?.roles || []

        
            
            authLogin({
                username: decoded.preferred_username,
                name: decoded.name,
                email: decoded.email,
                roles
            })
            
            onClose()

            if(roles.includes('MEDICO')){
                navigate('/medico')
            }else if(roles.includes('ADMIN')){
                navigate('/admin')
            }else{
                navigate('/')
            }
            
            

        } catch(err){
            setError('Usuario o contraseña incorrectos')
        }finally{
            setLoading(false)
        }
    }

    return (
        <Card
            className="login-card"
            sx={{
                position: 'absolute',
                top: '60px',
                right: 0,

                width: 340,

                borderRadius: '16px',
                border: '1px solid #e8eef5',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',

                p: 3,
                zIndex: 1000,
                fontFamily: '"Sour Gummy", sans-serif'
            }}
        >
            {}
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
                        borderRadius: '12px'
                    }}
                >
                    {error}
                </Alert>
            )}

            {}
            <Box
                component="form"
                onSubmit={handleSubmit}
                mt={2}
            >
                <Stack spacing={2}>

                    <TextField
                        label="Usuario"
                        type="text"
                        fullWidth
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={textFieldSx}
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
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
                            backgroundColor: BRAND_GREEN,
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: BRAND_GREEN_HOVER,
                                boxShadow: 'none'
                            }
                        }}
                    >
                        {
                            loading
                                ? 'Ingresando...'
                                : 'Iniciar sesión'
                        }
                    </Button>

                </Stack>
            </Box>

            
            <Box
                mt={3}
                display="flex"
                flexDirection="column"
                gap={1}
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