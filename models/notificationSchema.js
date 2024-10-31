import mongoose, { Schema } from 'mongoose'
const notification=new mongoose.Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    reciever:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    type:{
        type:String,
        enum:['following','postReact','reelReact','alert','message']
    },
    isRead:{
        type:Boolean,
        default:false
    },
    message:{
        type:String,
        required:true
    },
    post_id:{
        type:Schema.Types.ObjectId,
        ref:"userMediaCollectionSchema",
    },
    reel_id:{
        type:Schema.Types.ObjectId,
        ref:"reelSchema",
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})
export default mongoose.model('notification',notification)