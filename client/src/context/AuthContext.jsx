import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'

const AuthContext = createContext()

//  TODO Comenzar a gestionar contexto a partir del usuario autenticado

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)

    useEffect(() => {

        const storedUser = localStorage.getItem('user')

        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

    }, [])

    function login(userData) {

        localStorage.setItem(
            'user',
            JSON.stringify(userData)
        )

        setUser(userData)
    }

    function logout() {

        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        setUser(null)

        window.location.reload()
    }

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isMedico: user?.roles?.includes('MEDICO'),
        isPaciente: user?.roles?.includes('PACIENTE')
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}