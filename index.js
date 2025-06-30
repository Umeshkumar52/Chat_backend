import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { createServer } from "node:http"
import { Server } from "socket.io"
import cors from "cors"
import dotenv from 'dotenv'
import dbConnect from "./mongoose.js"
import userRoutes from './routers/userRoutes.js'
import chatsRoutes from './routers/chatsRoutes.js'
import cloudinary from 'cloudinary'
import postsRoutes from './routers/postsRoutes.js'
import reelsRoutes from './routers/reelsRoutes.js'
import friendReqRoutes from './routers/friendReqRoutes.js'
import { setIo } from "./midilwares/IoInstance.js"
import authentication from "./midilwares/authentication.js"
dotenv.config()
dbConnect()
const app = express();
const server = createServer(app);
const corOptions={
  origin:process.env.CLIENT_URL,
  // methods:['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders:['Content-Type','Authorization'],
  credentials:true
   }
app.use(cors(corOptions))
app.options("*",cors())
app.use(cookieParser())
const PORT = process.env.PORT || 5002
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
cloudinary.config({ 
  cloud_name:process.env.CLOUD_NAME, 
  api_key:process.env.API_KEY, 
  api_secret:process.env.API_SECRET,
  timeout:3600000
});
const io = new Server(server,{
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
    socket.join(data?data:socket.id)      
  });
  socket.on("private_msg", (data) => {
    data.type="incoming"
    socket.to(data.reciever_id ? data.reciever_id : socket.id).emit("private_msg", {
      data,
      reciever_id: data.sender_id? data.sender_id : socket.id,
      sender_id:data.reciever_id,
    });
    
  });
  socket.on("typing", ({to,state}) => {
    socket.to(to).emit("typing",state)
     
  });
  socket.on('following',(data)=>{
    socket.to(data.requester).emit('following',data)
  })
  socket.on('unfollowing',(data)=>{
    socket.to(data.requester).emit('unfollowing',data)
  })
  // calls handle
  socket.on('candidate',({candidate,calleeId})=>{
    socket.to(calleeId).emit('candidate',candidate)
  })
socket.on('offer',async({offer,calleeUser,callerUser,type})=>{
  socket.to(calleeUser?.calleeId).emit('offer',{offer,type,callerUser,calleeUser})
})
socket.on('answer',async({callerId,answer})=>{ 
  socket.to(callerId).emit('answer',answer)
  //  io.emit('answer',answer)
})
socket.on('end-call',({UserName})=>{
socket.to(UserName).emit("end-call")
})
  let onlineUsers = [];
  for (let [id, socket] of io.of("/").sockets) {
    onlineUsers.push({
      userId: id,
      userName: socket.userName,
      online:true
    });
  }  
  socket.emit("online", onlineUsers);
  socket.on("disconnect",(data)=>{
   onlineUsers.push(onlineUsers.filter((user)=>{
    if( user.userId==socket.id){
        onlineUsers.online=false
    }
    socket.emit("online",onlineUsers)
   }))
  })
});
process.on('warning', e => console.warn(e.stack))
app.use('/api/auth',userRoutes)
app.use('/api/auth/post',authentication,postsRoutes)
app.use('/api/conversation',authentication,chatsRoutes)
app.use('/api/auth/reels',authentication,reelsRoutes)
app.use('/api/auth/follow',authentication,friendReqRoutes)
server.listen(PORT, () => {
  console.log(`App Server is running on port ${PORT}`);
})
