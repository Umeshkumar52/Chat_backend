import mongoose from "mongoose";
const friendReqSchema=new mongoose.Schema({
   requester:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
   },
   reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
   },
   accept:{
      type:Boolean,
      default:false
   },
   reject:{
      type:Boolean,
      default:false
   }
},{timestamps:true})
 export default new mongoose.model('friendReqSchema',friendReqSchema)