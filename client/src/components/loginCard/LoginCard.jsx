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
import { usuariosService } from '../../services/api'


//TODO Al cerrar sesión se debería retornar a Home

const LoginCard = ({ onClose }) => {

    const [username, setUsername] = useState('')
    
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')

    const navigate = useNavigate()

    const { login: authLogin } = useAuth()

    const handleSubmit = async(e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try{

            const auth = await login(username, password)

            const usuario = await usuariosService.obtenerUsuarioActual()

            authLogin({
                token: auth.access_token,
                refreshToken: auth.refresh_token,
                user: usuario
            })

            onClose()

            if (usuario.roles.includes("MEDICO")) {
                navigate("/medico")
            } else if (usuario.roles.includes("ADMIN")) {
                navigate("/admin")
            } else {
                navigate("/")
            }
            
            

        } catch(err){
            setError(
                'Usuario o contraseña incorrectos'
            )
            
        }finally{

            setLoading(false)
        }
    }

    return (
        <Card
            sx={{
                position: 'absolute',
                top: '60px',
                right: 0,

                width: 340,

                borderRadius: 4,
                boxShadow: 8,

                p: 3,
                zIndex: 1000
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
                    fontWeight="bold"
                >
                    Iniciar sesión
                </Typography>

                <IconButton
                    size="small"
                    onClick={onClose}
                >
                    ✕
                </IconButton>
            </Box>

            {
                error &&
                <Alert severity="error">
                    {error}
                </Alert>
            }

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
                        onChange={(e) => {
                            setUsername(
                                e.target.value
                            )
                        }}
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none'
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

            {}
            <Box
                mt={3}
                display="flex"
                flexDirection="column"
                gap={1}
            >
                <Link to="/recuperar-password">
                    ¿Olvidaste tu contraseña?
                </Link>

                <Typography variant="body2">
                    ¿No tenés cuenta?{' '}
                    <Link
                        to="/registrar"
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