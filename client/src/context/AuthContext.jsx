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

        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
    }

    function logout() {

        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        setUser(null)

       
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
                    user?.rol === "MEDICO",

                isPaciente:
                    user?.rol === "PACIENTE",

                isAdmin:
                    user?.rol === "ADMIN",
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}