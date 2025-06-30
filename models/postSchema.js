import mongoose from "mongoose";
const postSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    description:{
        type:String
    },
    url:String,
    playback_url:String,
    secure_url:String,
    duration:String,
    public_id:String,
    url_type:{
        type:String,
        require:true
    },
    duration:{
        type:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    disLikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    Comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
    views:Number,
},{timestamps:true})
export default mongoose.model("post",postSchema)