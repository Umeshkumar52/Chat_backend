import mongoose from "mongoose";
const storySchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
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
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    Comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
    views:Number,
},{timestamps:true})
export default mongoose.model("storySchema",storySchema)