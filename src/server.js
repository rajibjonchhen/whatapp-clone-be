import express from "express";
import mongoose  from "mongoose";
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import usersRouter from "./service/users/users.js";
import chatsRouter from "./service/chats/chats.js";
import { badRequestHandler, genericErrorHandler, notFoundHandler, unauthorizedHandler } from "./service/errors/errorHandlers.js";
const {PORT = 3001} = process.env

const server = express()

/********************** Middleware  ************************/
const whiteList = [process.env.PROD_URL,process.env.DEV_URL]

server.use(cors({origin:function(origin, next){
    if(!origin || whiteListOrigins.indexOf(origin)!== -1){
        next(null, true)
    } else{
        next(new Error("cors error"))
    }
}}))

server.use(express.json())


/********************** Routes  ************************/
server.use("/users", usersRouter)
server.use("/chats", chatsRouter)





/**********************  ErrorHandles ************************/
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

/********************** Connections  ************************/
mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected", () => {
    console.log("successfully connected to  mongo!")
})

server.listen(PORT, () => {
    console.table(listEndpoints(server))
    console.log("The server is running in port", PORT)
})

server.on("error", (error) => {
    console.log("server has stopped  ",error)
})