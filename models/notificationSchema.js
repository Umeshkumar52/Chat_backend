import mongoose from 'mongoose'
const notification=mongoose.Schema({
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    notice:String,
    read:{
        type:Boolean,
        default:false
    }
},{timestamp:true})
export default mongoose.model("notification",notification)