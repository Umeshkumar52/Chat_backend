import express from "express";
import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { log } from "node:console";
import dbConnect from "./mongoose.js";
import userRoutes from './routers/userRoutes.js'
import chatsRoutes from './routers/chatsRoutes.js'
import cloudinary from 'cloudinary'
import { type } from "node:os";
import { env } from "node:process";
import axios from 'axios'
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5002;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.json());
cloudinary.config({ 
  cloud_name:"dupnunjun", 
  api_key:"815871334447987", 
  api_secret:"krmLIR1bD3FdGmkM4Oz0o1kTps8",
});
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: false,
  },
});
dbConnect()
io.use((socket, next) => {
  const userName = socket.handshake.auth.userName;
  if (!userName) {
    return next(new Error("Invalid UserName !"));
  }
  socket.userName = userName;
  next();
});

io.on("connection", (socket) => {
  socket.on("rooms", (data) => {
    socket.join(data ? data : socket.id);
  });
  socket.on("disconnect",(data)=>{
    socket.leave(data?data:socket.id)
  })
  socket.on("private_msg", (data) => {
    data.type="incoming"
    socket.to(data.to ? data.to : socket.id).emit("private_msg", {
      data,
      to: data.from? data.from : socket.id,
      from:data.to,
    });
    
  });
  socket.on("uploadFile",(data)=>{
    socket.emit("uploadFileResponse",data)
  })
  socket.on("typingStatus", (data) => {
    socket.to(data.to).emit("typingStatus", data.status);
  });
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userId: id,
      userName: socket.userName,
    });
  }
  socket.broadcast.emit("users", users);
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("group_chat_uotgoing", (data) => {
    socket.to("meeting").emit("group_chat_incoming", { data: data });
  });
  socket.on("send_message", ({ message, time }) => {
    socket.broadcast.emit("recieve_message", { message, time });
  });
});
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use('/api',userRoutes)
app.use('/api/conversation',chatsRoutes)
app.listen(PORT, () => {
  console.log(`App Server is running on port ${PORT}`);
});
server.listen(8000, () => {
  console.log(`Socket Server is running on port 8000`);
});
