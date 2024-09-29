import mongoose from "mongoose";
const reelSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    url:String,
    secure_url:{
        type:String,
        require:true
    },
    playback_url:{
        type:String,
        require:true
    },
    url_type:{
        type:String,
        require:true
    },
    duration:String,
    tittle:String,
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
export default mongoose.model("reelSchema",reelSchema)