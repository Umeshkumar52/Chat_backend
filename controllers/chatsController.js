import publicIdHandler from '../midilwares/publicIdHandler.js'
import chatsSchema from '../models/chatsSchema.js'
import conversation from '../models/conversation.js'
import cloudinary from 'cloudinary'
export const SaveTextCom=async(req,res)=>{
    try {            
        const{sender_id,message,msg_type}=req.body
        const {_id}=req.params   
            const chat=await chatsSchema.create({
               reciever_id:_id,
               sender_id:sender_id,
               msg_type,
               isRead:false,
               message
            }) 
        const existChat=await conversation.findOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]}) 
        if(existChat){      
            const response=await conversation.updateOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]},{$push:{chats:chat._id}}) 
             return res.status(200).json({
               success:true,
               message:response
             })
      }else{   
       const response=await conversation.create({
         sender_id:sender_id,
         reciever_id:_id,
              chats:chat._id
            })
      return res.status(200).json({
        success:true,
        message:response
       })
    
      }
      }catch (error) {
       return res.status(512).json({
        success:false,
        message:"Fail send message to user",error
       }) 
   }
}
export const SaveSocialCom=async(req,res)=>{
   try {
      const{_id,sender_id}=req.params     
      let imgResult; 
      let response; 
      if(req.file){  
         if(req.file.mimetype=='video/mp4'){
         imgResult=await cloudinary.v2.uploader.upload(req.file.path,{
             resource_type: "video", 
               public_id:publicIdHandler(req.file,sender_id,'video'),
              })                 
        }else{
          imgResult=await cloudinary.v2.uploader.upload(req.file.path,{
            public_id:publicIdHandler(req.file,sender_id,'img'),
            transformation:{
               width:200,height:240, crop:"scale",
            }
          }) 
        }
        const chat=await chatsSchema.create({
         reciever_id:_id,
         sender_id:sender_id,
         msg_type:"file",
         url_type:imgResult.format,
         isRead:false,
         secure_url:imgResult.secure_url,
         public_id:imgResult.public_id
       }) 
        const existChat=await conversation.findOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]}) 
         if(existChat){                
         response=await conversation.updateOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]},{$push:{chats:chat._id}})       
           }else{   
         response=await conversation.create({
        sender_id:sender_id,
        reciever_id:_id,
        chats:chat._id
       })
      res.status(200).json({
        success:true,
        message:response
       })
      }      
   }
   res.status(200).json({
      success:true,
      message:response
     })
   } catch (error) {
      res.status(512).json({
         success:false,
         message:error
      })
   }
}
export const GetAllMessages=async(req,res)=>{
   // const {sender_id}=req.body
   const {_id,sender_id}=req.params
   try {
      const response=await conversation.find({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]})
      .populate({
         path:"chats"
      })
      res.status(200).json({
         success:true,
         message:response
      })
   } catch (error) {
      return res.status(512).json({
         success:false,
         message:error
      })
   }
}
 export const deleteChats=async(req,res)=>{
   try {
      const{textMsgData,fileMsgData}=req.body;
      const{conversation_id}=req.params;
      console.log(req.body,req.params);
      
       if(textMsgData.length>1){    
        await chatsSchema.deleteMany({_id:{$in:textMsgData}})
         await conversation.updateMany({_id:conversation_id},{$pull:{chats:{$in:textMsgData}}})
       }else if(textMsgData.length==1){       
           await chatsSchema.deleteOne({_id:{$in:textMsgData}})
           await conversation.updateOne({_id:conversation_id},{$pull:{chats:{$in:fileMsgData}}}) 
       }
         if(fileMsgData.length>1){
            await cloudinary.v2.api.delete_resources(fileMsgData.public_id)
            await chatsSchema.deleteMany(fileMsgData.chatIds)
            await conversation.updateMany({_id:conversation_id},{$pull:{chats:{$in:fileMsgData.chat_Ids}}})
         }else if(fileMsgData.length==1){
            await cloudinary.v2.api.delete_resources(fileMsgData.public_id)
           await chatsSchema.deleteOne(fileMsgData.chatIds)
           await conversation.updateMany({_id:conversation_id},{$pull:{chats:{$in:fileMsgData.chat_Ids}}})
         }
       res.status(200).json({
           success:true,
           message:"Deleted Successfully"
       })
   } catch (error) {
       res.status(400).json({
           success:false,
           message:"Unable To delete chats"
       })
   }
}
