import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from 'dotenv'
import dbConnect from "./mongoose.js";
import userRoutes from './routers/userRoutes.js'
import chatsRoutes from './routers/chatsRoutes.js'
import cloudinary from 'cloudinary'
import postsRoutes from './routers/postsRoutes.js'
import reelsRoutes from './routers/reelsRoutes.js'
import friendReqRoutes from './routers/friendReqRoutes.js'
import { setIo } from "./midilwares/IoInstance.js";

dbConnect()
const app = express();
app.use(cookieParser());
dotenv.config()
const server = createServer(app);
const PORT = process.env.PORT || 5002;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corOptions={
  // origin:"http://localhost:3000",
  origin:"https://chat-client-cgiv.onrender.com",
   }
app.use(cors(corOptions))
cloudinary.config({ 
  cloud_name:process.env.CLOUD_NAME, 
  api_key:process.env.API_KEY, 
  api_secret:process.env.API_SECRET,
});
const io = new Server(server, {
  cors:corOptions
})
setIo(io)
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
    socket.join(data.UserName?data.UserName:data);        
  });
  socket.on("private_msg", (data) => {
    data.type="incoming"
    socket.to(data.reciever_id ? data.reciever_id : socket.id).emit("private_msg", {
      data,
      reciever_id: data.sender_id? data.sender_id : socket.id,
      sender_id:data.reciever_id,
    });
    
  });
  socket.on("typingStatus", (data) => {
    setTimeout(()=>{
      socket.to(data.to).emit("typingStatus", data.status);
    },1000)
  });
  // socket.on("online",(data)=>{
  //   console.log(data);
  //   socket.broadcast.emit("online",data)
  // })
  let onlineUsers = [];
  for (let [id, socket] of io.of("/").sockets) {
    onlineUsers.push({
      userId: id,
      userName: socket.userName,
      online:true
    });
  }  
  socket.emit("online", onlineUsers);
  socket.on("offline",(data)=>{
   onlineUsers.push(onlineUsers.filter((user)=>{
    if( user.userId==socket.id){
        onlineUsers.online=false
    }
    socket.emit("offline",onlineUsers)
   }))
  })
});
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
process.on('warning', e => console.warn(e.stack));
app.use('/api/auth',userRoutes)
app.use('/api/auth/post',postsRoutes)
app.use('/api/conversation',chatsRoutes)
app.use('/api/auth/reels',reelsRoutes)
app.use('/api/auth/follow',friendReqRoutes)
app.listen(PORT, () => {
  console.log(`App Server is running on port ${PORT}`);
});
server.listen(8000, () => {
  console.log(`Socket Server is running on port 8000`);
});
