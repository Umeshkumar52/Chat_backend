import mongoose from 'mongoose'
const chatsSchema=new mongoose.Schema({
    sender_id:{
        type:String,
        require:true
    },
    reciever_id:{
        type:String,
        require:true
    },
    msg_type:String,
    url_type:String,
    message:String,
    isRead:{
        type:Boolean,
        default:false
    },
    secure_url:String,
    public_id:String,

},{timestamps:true})
export default mongoose.model("chatsSchema",chatsSchema)