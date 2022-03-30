import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import usersRouter from "./service/users/users.js"
import chatsRouter from "./service/chats/chats.js"
import { badRequestHandler, genericErrorHandler, notFoundHandler, unauthorizedHandler } from "./service/errors/errorHandlers.js"
import passport from "passport"
import googleStrategy from "./service/auth-middleware/Oauth.js"
import { createServer} from "http"
import {Server}  from "socket.io"

interface IOnlineUser {
  username:string,
  id: string,
  sendAt : Date,
  room?: string
}

const { PORT = 3001 } = process.env

const server = express()

/********************** Middleware  ************************/
passport.use("google", googleStrategy)

const whiteListOrigins = [process.env.PROD_URL, process.env.DEV_URL, process.env.SWAGGER_URL]

server.use(
  cors({
    origin: function (origin, next) {
      console.log(origin)
      if (!origin || whiteListOrigins.indexOf(origin) !== -1) {
        next(null, true)
      } else {
        next(new Error("cors error"))
      }
    },
  })
)

server.use(express.json())
server.use(passport.initialize())

/********************** Routes  ************************/
server.use("/users", usersRouter)
server.use("/chats", chatsRouter)

/**********************  ErrorHandles ************************/
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

/********************** Connections  ************************/
mongoose.connect(process.env.MONGO_CONNECTION!)
mongoose.connection.on("connected", () => {
  console.log("successfully connected to  mongo!")
})

const httpServer = createServer(server)

const io = new Server(httpServer)

io.on("connection", socket => {
  console.log(socket.handshake.auth) // verify this token and decode it to retrieve the ID of the user and save it in a onlineUsers array

  //onlineUsers.push({ userId: decodedToken._id, socket: socket })

  // const user = onlineUsers.find(user with userId)
  // user.socket.join(any necessary room to be joined.........)


})

//------========= socket io ========-----------------
let onlineUsers : IOnlineUser[] = []

io.on("connect", socket => {
    console.log(socket.id)

    socket.on("setUsername", ({username, room}) => {
        console.log("username -" + username)
        // user = {...user, id: uuid(), createdAt: new Date()}
        console.log(room)
        let user:IOnlineUser ={
          username,
          id: socket.id,
          sendAt : new Date(),
          room
      }
        onlineUsers = onlineUsers.filter(user => user.username !== username).concat(user)

        console.log("socket.id", socket.id , "room", room)
        socket.join(room)

        socket.emit("loggedin")
    
        socket.broadcast.emit("newConnection")
    })


    
    
    socket.on("sendmessage", ({message, room}) => {
        console.log("message - " + message)
       socket.to(room).emit("message",message)
        // socket.broadcast.emit("message",message)
    })
    
    socket.on("openChatWith", ({ recipientId, sender }) => {
        console.log("here")
        socket.join(recipientId)
        socket.to(recipientId).emit("message", { sender, text: "Hello, I'd like to chat with you" })
    })
    
    socket.on("disconnect", () => {
        console.log("Disconnected socket with id " + socket.id)
    
        onlineUsers = onlineUsers.filter(user => user.id !== socket.id)
    
        socket.broadcast.emit("newConnection")
    })
})

//------========= socket io ========-----------------


httpServer.listen(PORT, () => {
  console.table(listEndpoints(server))
  console.log("The server is running in port", PORT)
})

httpServer.on("error", (error) => {
  console.log("server has stopped  ", error)
})
