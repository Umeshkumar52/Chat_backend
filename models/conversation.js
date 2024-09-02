import mongoose, { mongo, Schema } from "mongoose";
const conversation=new mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    reciever_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    chats:{
        type:Array,
        require:true
    },
    type:{
        type:String,
        require:true
    }


})
export default mongoose.model("conversation",conversation)