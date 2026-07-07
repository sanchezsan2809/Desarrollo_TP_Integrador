import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'

//  TODO Comenzar a gestionar contexto a partir del usuario autenticado


const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)

    useEffect(() => {

        const storedUser = localStorage.getItem("user")

        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

    }, [])

    function login({ token, refreshToken, user }) {

        localStorage.setItem("token", token)
        localStorage.setItem("refreshToken", refreshToken)
        localStorage.setItem("user", JSON.stringify(user))

        setUser(user)
    }

    function logout() {

        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        setUser(null)

        window.location.reload()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,

                token: localStorage.getItem("token"),

                isAuthenticated: !!user,

                isMedico:
                    user?.roles?.includes("MEDICO"),

                isPaciente:
                    user?.roles?.includes("PACIENTE")
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}