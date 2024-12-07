import  userMediaCollectionSchema from '../models/userMediaCollectionSchema.js'
import cloudinary from 'cloudinary'
import user from '../models/user.js'
import comment from '../models/commentsSchema.js'
import storySchema from '../models/storySchema.js'
import { getIo } from '../midilwares/IoInstance.js'
import notificationHandler from '../midilwares/notificationHandler.js'
import publicIdHandler from '../midilwares/publicIdHandler.js'
export const newPost=async(req,res)=>{
try {
    const io=getIo()
    const {user_id}=req.params
    const{description,}=req.body
    let response;
    if(req.file.mimetype=='video/mp4'){
       const cloudinary_res=await cloudinary.v2.uploader.upload(req.file.path, 
           { resource_type: "video", 
            public_id:publicIdHandler(req.file,user_id,'video')
           }
        )
        response=await userMediaCollectionSchema.create({
            author:user_id,
            description,
            secure_url:cloudinary_res.secure_url,
            url:cloudinary_res.url,
            playback_url:cloudinary_res.playback_url,
            duration:cloudinary_res.duration,
            public_id:cloudinary_res.public_id,
            url_type:cloudinary_res.format
        })
    }else{
        const cloudinary_res=await cloudinary.v2.uploader.upload(req.file.path,{
            resource_type:'image',
            unique_filename:false,
            overwrite:true,
            public_id:publicIdHandler(req.file,user_id,'image')
        })
        response=await userMediaCollectionSchema.create({
            author:user_id,
            description,
            secure_url:cloudinary_res.secure_url,
            url:cloudinary_res.url,
            public_id:cloudinary_res.public_id,
            url_type:cloudinary_res.format
        })
        }  
        const User=await user.findById(user_id)
        User.myPosts.push(response._id)
        User.save()  
        io.to(User.UserName).emit("post","Posted")
        notificationHandler(User,response)
    res.status(200).json({
        success:true,
        message:response
    })
} catch (error) {
   return res.status(512).json({
        success:false,
        message:"Failed to upload"
    })
}
}
export const newStory=async(req,res)=>{
    try {
        const io=getIo()
        const{_id}=req.body
       const cloudinary_res=await cloudinary.v2.uploader.upload(req.file.path, 
            { resource_type: "video", 
             public_id:publicIdHandler(req.file,_id)
            })
         const story=await storySchema.create({
           author:_id,
           secure_url:cloudinary_res.secure_url,
           url:cloudinary_res.url,
           playback_url:cloudinary_res.playback_url,
           duration:cloudinary_res.duration,
           public_id:cloudinary_res.public_id,
           url_type:cloudinary_res.format
         })
        const response=await user.findByIdAndUpdate(_id,{$push:{myStory:story._id}})
        io.to(response.UserName).emit("post","Posted")
        res.status(200).json({
             success:true,
             message:response
         })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed to Upload Story"
        })
    }
}
export const allStories=async(req,res)=>{
    try {
        const stories=await storySchema.find({})
        .populate({path:"author",select:['_id','UserName',"avatar"]})
        return res.status(200).json({
            success:true,
            message:stories
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error
        })
    }
}
export const getPosts=async(req,res)=>{
    try {
        const{limit,offset}=req.params
        const response=await userMediaCollectionSchema.find({}).skip(offset).limit(limit)
        .populate({path:"author",select:["_id","Name","UserName","avatar","Followers"]})
        res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
        res.status(412).json({
            success:false,
            message:error
        })
    }
}
export const Post=async(req,res)=>{
    try {
        const{_id}=req.params
        const response=await userMediaCollectionSchema.findById(_id)
        .populate({path:"author",select:["_id","Name","UserName","avatar","Followers"]})
        res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
        res.status(412).json({
            success:false,
            message:error
        })
    }
}
export const updateToPost=async(req,res)=>{
    try {
        let io=getIo()
        const{post_id}=req.params
        const{author,commit}=req.body                  
        const response=await comment.create({
            commit,
            author,
            post_id
        })
        io.emit("comment",response)
       const post=await userMediaCollectionSchema.updateOne({_id:post_id},{$push:{Comments:response._id}})       
       res.status(200).json({
        success:true,
        message:response
       })
    } catch (error) {
        res.status(412).json({
            success:false,
            message:error
           })   
    }
}
export const post_Comments=async(req,res)=>{
    try {
        const response=await comment.find(req.params)
        .populate({path:"author",select:["_id","Name","UserName","avatar"]})
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
export const likeAPost=async(req,res)=>{
    try {
        let io=getIo()
        const {post_id,author}=req.params;
        const post=await userMediaCollectionSchema.findByIdAndUpdate(post_id,{$push:{likes:author}})
        // io.emit("comment",post)
      res.status(200).json({
     success:true,
     message:post
    })
    } catch (error) {
        res.status(512).json({
            success:false,
            message:error
        })
    }
}
export const dish_likeAPost=async(req,res)=>{
    try {
        let io=getIo()
        const {post_id,author}=req.params;
        const post=await userMediaCollectionSchema.findByIdAndUpdate(post_id,{$pull:{likes:author}})
        io.emit("comment",post)
      res.status(200).json({
     success:true,
     message:post
    })
    } catch (error) {
        res.status(512).json({
            success:false,
            message:error
        })
    }
}
export const disLikeAPost=async(req,res)=>{
    try {
        const {post_id,author}=req.params
        const response=await userMediaCollectionSchema.findByIdAndUpdate(post_id,{$set:{$push:{disLikes:author}}})
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
export const deletePost=async(req,res)=>{
    try {
        const{public_id,post_id}=req.params
        await cloudinary.v2.uploader.destroy(public_id)
        const response=await userMediaCollectionSchema.findByIdAndDelete(post_id)
       res.status(200).json({
            success:true,
            message:"Post Delete Successfully"
        })
    } catch (error) {
         res.status(512).json({
            success:false,
            message:error
        })
    }
}
export const deleteStory=async(req,res)=>{
    try {
        const{public_id,post_id}=req.params
        await cloudinary.v2.uploader.destroy(public_id,{
            resource_type:"video"
        })
        const response=await storySchema.findByIdAndDelete(post_id)
       res.status(200).json({
            success:true,
            message:"Post Delete Successfully"
        })
    } catch (error) {
         res.status(512).json({
            success:false,
            message:error
        })
    }
}