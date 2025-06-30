import Conversation from "../models/Conversation";
import cloudinary from 'cloudinary'
async function mediaHandler(file,sender_id,_id) {
    if(file){
        const options={
          overwrite:true
        }
        const result=await cloudinary.v2.uploader.upload(file.path)
        const response=await Conversation.updateOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]},{$push:{chats:{
           _id,
           secure_url:result.secure_url,
           msg
        }}})
    }
}
export default mediaHandler