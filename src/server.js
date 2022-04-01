import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import usersRouter from "./service/users/users.js";
import chatsRouter from "./service/chats/chats.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./service/errors/errorHandlers.js";
import passport from "passport";
import googleStrategy from "./service/auth-middleware/Oauth.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { verifyJWTToken } from "./service/auth-middleware/tools.js";
import UsersModel from "./service/users/users-schema.js";
import ChatsModel from "./service/chats/chat-schema.js";
import { v4 as uuid } from "uuid";
import createHttpError from "http-errors";
const { PORT = 3001 } = process.env;

const server = express();

//----------========= socketio server =========-----------
const httpServer = createServer(server);

const io = new Server(httpServer, { allowEIO3: true });

/********************** Middleware  ************************/
passport.use("google", googleStrategy);

const whiteListOrigins = [
  process.env.PROD_URL,
  process.env.DEV_URL,
  process.env.SWAGGER_URL,
];

server.use(
  cors({
    origin: function (origin, next) {
      console.log(origin);
      if (!origin || whiteListOrigins.indexOf(origin) !== -1) {
        next(null, true);
      } else {
        next(new Error("cors error"));
      }
    },
  })
);

server.use(express.json());
server.use(passport.initialize());

/********************** Routes  ************************/
server.use("/users", usersRouter);
server.use("/chats", chatsRouter);

/**********************  ErrorHandles ************************/
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

/********************** Connections  ************************/
mongoose.connect(process.env.MONGO_CONNECTION);
mongoose.connection.on("connected", () => {
  console.log("successfully connected to  mongo!");
});

//----------========= socketio start =========-----------

// io.on("connection", socket => {
//   console.log("socket.handshake.auth")
// verify this token and decode it to retrieve the ID of the user and save it in a onlineUsers array

//onlineUsers.push({ userId: decodedToken._id, socket: socket })

// const user = onlineUsers.find(user with userId)
// user.socket.join(any necessary room to be joined.........)

// })
let onlineUsers = [];

io.on("connect", async (socket) => {
  // console.log(socket.handshake.auth)
  const token = socket.handshake.auth.token;
  // console.log("token == ", token)
  if (!token) {
    socket.emit("JWT_ERROR");
    throw createHttpError(401, "JWT_ERROR please relogin");
  }

  const { _id, username } = await verifyJWTToken(token);
  // onlinseUsers will need to save the users' sockets
  socket.broadcast.emit("newConnection");

  const onlineUser = {
    userId: _id,
    id: socket.id,
    createdAt: new Date(),
    socket: socket,
  };
  onlineUsers = onlineUsers
    .filter((online) => online.userId !== _id)
    .concat(onlineUser);
  // later in the GET request
  //  const userToChat = onlineUser.find(user => user.userId ===_id)
  //  socket.join(socket.id)
  // console.log("onlineUser", onlineUsers, _id)
  socket.on("outgoing-msg", async ({ chatId, message }) => {
    try {
      console.log("paylaod._id ====", _id);
      const newMsg = {
        sender: message.sender,
        content: { text: message.content },
      };

      const chat = await ChatsModel.findByIdAndUpdate(chatId, {
        $push: { messages: newMsg },
      });
      // console.log(chat)
      chat.members.forEach((member) => {
        // console.log("member", member)
        const recipient = onlineUsers.find(
          (user) => user.userId === member.toString()
        );
        // console.log("ONLINE USERS", onlineUser,"message content", message.content)

        // console.log("ONLINE USERS recipient", onlineUser,"message content recipient", message.content)
        if (recipient) {
          socket.to(recipient.id).emit("incoming-msg", message);
          console.log("I am going to send msg sending to socket :-)");
        } else {
          console.log("I am not going to send msg");
        }
      });
      // go and grab from the onlineUsers all the chat participants except you
      //socket.join(recipient.socket.Id)
      //socket.to(chatId).emit("incoming-msg",message)
    } catch (error) {
      throw createHttpError(401, "Error could not update database");
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected socket with id " + socket.id);

    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);

    socket.broadcast.emit("newConnection");
  });
});
server.use("/online-users", (res, req) => req.send({ onlineUsers }));

//----------========== socketio end ==========-----------

httpServer.listen(PORT, () => {
  console.table(listEndpoints(server));
  console.log("The server is running in port", PORT);
});

server.on("error", (error) => {
  console.log("server has stopped  ", error);
});
