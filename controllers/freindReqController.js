import friendReqSchema from '../models/friendReqSchema.js'
import user from '../models/user.js'
export const friendRequest=async(req,res)=>{
    try {
        console.log(req.params);
        
        const{requester,reciever}=req.params
        const response=await friendReqSchema.create(req.params)
        await user.findByIdAndUpdate(requester,{$push:{"Friends":reciever}})
      return res.status(200).json({
        success:true,
        message:response
       })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error
           })
    }
}
export const friendReqResponse=async(req,res)=>{
    try {
        const{requester,reciever,resp}=req.params
        let response;
        if(resp=="accept"){
       response= await user.findByIdAndUpdate(reciever,{$push:{'Friends':requester}})
        }else{
        await user.bulkWrite(requester,{$pull:{"Friends":reciever}})
        response=await friendReqSchema.findOneAndDelete({requester:requester,reciever:reciever})
        }
      return res.status(200).json({
        success:true,
        message:response
       })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error
           })
    }
}
export const friendsAllRequest=async(req,res)=>{
    try {
        const{reciever}=req.params
        const response=await friendReqSchema.find({reciever:reciever})
        .populate({path:'requester',select:['_id','UserName','avatar']})
        return res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error
        })
    }
}