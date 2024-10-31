import mongoose from "mongoose";
const conversation=new mongoose.Schema({
    sender_id:{
        type:String,
        require:true
    },
    reciever_id:{
        type:String,
        require:true
    },
    chats:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chatsSchema'
    }],
},{timestamps:true})
export default mongoose.model("conversation",conversation)