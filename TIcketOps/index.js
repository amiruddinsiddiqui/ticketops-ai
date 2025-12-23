import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import userRoutes from "./routes/user.js"
import ticketRoutes from "./routes/ticket.js"
import {serve} from "inngest/express"
import {inngest} from "./inngest/client.js"
import {onUserSingup} from "./inngest/functions/onSignUp.js"
import {onTicketCreated} from "./inngest/functions/onTIcketCreate.js"

import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/inngest", serve({
    client: inngest,
    functions: [onUserSingup, onTicketCreated]
}));


mongoose.connect(process.env.MONGO_URI).then(
    ()=>{
        console.log("Mongodb connected successfully!!")
        app.listen(PORT, ()=> console.log("Server at http://localhost:3000"))
    }
).catch(
    (error) => console.error("Mongodb error:", error)
)