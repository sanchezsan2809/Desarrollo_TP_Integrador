import dotenv from "dotenv"
dotenv.config()

import app from "./app.js"
import { MongoDBClient } from "./config/database.js"
import { iniciarRecordatorioJob } from "./jobs/recordatorioJob.js"

const port = process.env.PORT || 5000
const host = '0.0.0.0'

const start = async() =>{
    
    try {
        await MongoDBClient.connect()

        iniciarRecordatorioJob()

        app.listen(port, host, () => {
            console.log(`👨🏻‍⚕️ Servidor corriendo en http://${host}:${port}`)
        })
    } catch (error) {
        console.error(error)

    }
}

start()



