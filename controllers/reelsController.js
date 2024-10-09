import cloudinary from 'cloudinary'
import user from '../models/user.js'
import reelSchema from '../models/reelSchema.js'
import comment from '../models/commentsSchema.js'
import { getIo } from '../midilwares/IoInstance.js'
export const allReals=async(req,res)=>{
    try {
        const reels=await reelSchema.find({})
        .populate({path:'author',select:['_id','UserName','avatar','Followers']})
        return res.status(200).json({
            success:true,
            message:reels
        })
    } catch (error) {
        return res.status(512).json({
            success:false,
            message:error
        })
    }
}
export const newReel=async(req,res)=>{
    try {
        const{user_id}=req.params
        const{tittle}=req.body
        const cloudinary_res=await cloudinary.v2.uploader.upload(req.file.path, 
            { resource_type: "video", 
             public_id:"reel_"+Date.now()
            }
         )
         const response=await reelSchema.create({
            author:user_id,
            secure_url:cloudinary_res.secure_url,
            url:cloudinary_res.url,
            playback_url:cloudinary_res.playback_url,
            duration:cloudinary_res.duration,
            url_type:cloudinary_res.format,
            public_id:cloudinary_res.public_id,
            tiile:tittle
        })
        await user.findByIdAndUpdate(user_id,{$push:{myReels:response._id}})
       return res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
        return res.status(502).json({
            success:false,
            message:"Failed to Upload Reel"
        })
    }
}
export const commentToReel=async(req,res)=>{
    try {
        let io=getIo()
        const{post_id}=req.params
        const{author,commit}=req.body                          
        const response=await comment.create({
            commit,
            author,
            post_id
        })
        io.emit("reelComment",response)        
       const post=await reelSchema.updateOne({_id:post_id},{$push:{Comments:response._id}})
      return res.status(200).json({
        success:true,
        message:response
       })
    } catch (error) {
       return res.status(412).json({
            success:false,
            message:error
           })   
    }
}
export const reel_Comments=async(req,res)=>{
    try {
        const response=await comment.find(req.params)
        .populate({path:"author",select:["_id","Name","UserName","avatar"]})
        return res.status(200).json({
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
export const likeToReel=async(req,res)=>{
    try {
        let io=getIo()
        const {post_id,author}=req.params;        
        // const existLike=await userMediaCollectionSchema.find(post_id,{likes:{$elemMatch:author}})
        // console.log(existLike);
        // if(existLike){
        //    return
        // }
        const post=await reelSchema.findByIdAndUpdate(post_id,{$push:{likes:author}})
        io.emit("reelLike",author)
      res.status(200).json({
     success:true,
     message:"successfull"
    })
    } catch (error) {
        res.status(512).json({
            success:false,
            message:error
        })
    }
}
export const particularUserReel=async(req,res)=>{
    try {
        const{author}=req.params
        const reel=await reelSchema.find({author:author})
        return res.status(200).json({
            success:true,
            message:reel
        })
    } catch (error) {
        return res.status(512).json({
            success:false,
            message:error
        })
    }
}
export const deletReel=async(req,res)=>{
    try {
        const{public_id,post_id}=req.params
        const response=await reelSchema.findByIdAndDelete(post_id)
        await cloudinary.v2.uploader.destroy(public_id,{
            resource_type:"video"
        })
       return res.status(200).json({
            success:true,
            message:"Reel Deleted Successfully"
        })
    } catch (error) {
       return res.status(400).json({
            success:false,
            message:"Unable To Reel Delete"
        })
    }
}