import mongoose from "mongoose";
const user=new mongoose.Schema({
    Name:{
        type:String
    },
    UserName:{
        type:String,
        require:true
    },
    Email_Phone:{
        type:String
    },
    Chat:{
        type:Array,
        ref:"conversation"
    }
})
export default mongoose.model("user",user)