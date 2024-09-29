import mongoose from "mongoose";
const commentsSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userMediaCollectionSchema"
    },
    commit:String
})
export default mongoose.model("comment",commentsSchema)