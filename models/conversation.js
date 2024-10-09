import mongoose from "mongoose";
const conversation=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        user:"user",
        require:true
    },
    sender_id:{
        type:String,
        require:true
    },
    reciever_id:{
        type:String,
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
},
{timestamps:true}
)
export default mongoose.model("conversation",conversation)