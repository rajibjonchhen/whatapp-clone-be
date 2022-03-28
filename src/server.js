import express from "express";
import mongoose  from "mongoose";
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
// import { badRequestHandler, genericErrorHandler, notFoundHandler, unauthorizedHandler } from "./service/handlers/errorHandler.js";
import usersRouter from "./service/users/users.js";
import chatsRouter from "./service/chats/chats.js";
const {PORT = 3001} = process.env

const server = express()

server.use(cors())
server.use(express.json())


server.use("/users", usersRouter)
server.use("/chats", chatsRouter)


mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected", () => {
    console.log("successfully connected to  mongo!")
})



// server.use(badRequestHandler)
// server.use(unauthorizedHandler)
// server.use(notFoundHandler)
// server.use(genericErrorHandler)

server.listen(PORT, () => {
    console.table(listEndpoints(server))
    console.log("The server is running in port", PORT)
})

server.on("error", (error) => {
    console.log("server has stopped  ",error)
})