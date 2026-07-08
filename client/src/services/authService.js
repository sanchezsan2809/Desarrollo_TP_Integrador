const KEYCLOAK_URL =
    process.env
        .REACT_APP_KEYCLOAK_URL

const REALM =
    process.env
        .REACT_APP_KEYCLOAK_REALM

const CLIENT_ID =
    process.env
        .REACT_APP_KEYCLOAK_CLIENT_ID


export async function login(
    username,
    password
){

    const response = 
        await fetch(
            `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 
                        'application/x-www-form-urlencoded'
                }, 

                body: 
                    new URLSearchParams({
                        client_id: 
                            CLIENT_ID,

                        username,
                        password, 

                        grant_type: 
                            'password'
                    })
            }
        )

    const data = await response.json()

    if(!response.ok){
        console.log(data)

        throw new Error(
            data.error_description
        )
    }

    return data
}

export async function obtenerUsuarioActual(token) {

    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/usuarios/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("No se pudo obtener el usuario.");
    }

    return response.json();
}