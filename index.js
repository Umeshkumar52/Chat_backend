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
import notificationRoutes from './routers/notificationRoutes.js'
import { setIo } from "./midilwares/IoInstance.js"
dbConnect()
const app = express();
app.use(cookieParser())
dotenv.config()
const server = createServer(app);
const PORT = process.env.PORT || 5002
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const corOptions={
  // origin:"http://localhost:3000",
  origin:process.env.CLIENT_URL,
  credentials:true
   }

app.options('*', cors(corOptions));
app.use(cors(corOptions))
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
  socket.on("typingStatus", (data) => {
    setTimeout(()=>{
      socket.to(data.to).emit("typingStatus", data.status);
    },1000)
  });
// calls listening
socket.on('offer',async(data)=>{
  socket.to(data.target).emit('offer',{
    'offer':data.offer,
    sender:data.sender
  })
})
socket.on('answer',async(data)=>{
  socket.to(data.target).emit('answer',{
    'answer':data.answer,
    sender:data.sender
  })
})
socket.on('candidate',(data)=>{
  io.to(data.target).emit('candidate',{
    'candidate':data.candidate,
    sender:data.sender
  })
})
// call to user
socket.on('callUser',({to,signalData,callerId})=>{
  console.log(to,signalData,callerId);
    io.to(to).emit("incomingCall",{signalData,callerId})
})
socket.on('acceptCall',({to,signalData})=>{
  io.to(to).emit('callAccepted',signalData)
})
socket.on('rejectCall',({to})=>{
  io.to(to).emit('callRejected')
})
socket.on('endCall',async(target)=>{
  io.to(target).emit("endCall")
})
socket.on('disconnect',()=>{
  console.log(socket.id);
  
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
  socket.on("offline",(data)=>{
   onlineUsers.push(onlineUsers.filter((user)=>{
    if( user.userId==socket.id){
        onlineUsers.online=false
    }
    socket.emit("offline",onlineUsers)
   }))
  })
});
process.on('warning', e => console.warn(e.stack))
app.use('/api/auth',userRoutes)
app.use('/api/auth/post',postsRoutes)
app.use('/api/conversation',chatsRoutes)
app.use('/api/auth/reels',reelsRoutes)
app.use('/api/auth/follow',friendReqRoutes)
app.use('/api/notification',notificationRoutes)
server.listen(PORT, () => {
  console.log(`App Server is running on port ${PORT}`);
})
