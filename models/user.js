import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const user=new mongoose.Schema({
    Name:{
        type:String,
        require:true
    },
    UserName:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Phone:{
        type:Number
    },
    Password:{
        type:String,
        require:true,
    },
    avatar:{
        type:String
    },
    avatar_public_id:String,
    profileBanner:{
       type:String
    },
    profileBanner_public_id:String,
    token:{
        type:String,
    },
    Chat:{
        type:Schema.Types.ObjectId,
        ref:"conversation"
    },
    myPosts:[{
        type:Schema.Types.ObjectId,
        ref:"userMediaCollectionSchema"
    }],
    myReels:[{
         type:Schema.Types.ObjectId,
        ref:"reelSchema"
    }],
    myStory:[{
        type:Schema.Types.ObjectId,
        ref:"storySchema"
    }],
    Contact:[{
        UserName:String
    }],
    Following:[{
         type:Schema.Types.ObjectId,
        ref:"user"
    }],
    Followers:[{
        type:Schema.Types.ObjectId,
       ref:"user"
   }],
   unReadNotification:{
    type:Number,
    default:0
   }
},
{timestamps:true})
user.pre('save',async function(next){
    if(!this.isModified('Password')){
        return next()
    }
    this.Password=await bcrypt.hash(this.Password,10)
    return next()
})
user.methods={
    validator: async function(Password,hashPassword){
        return await bcrypt.compare(Password,hashPassword)
      },
    genJwtToken:function(){
        return jwt.sign(
            {
              _id:this._id,UserName:this.UserName,Email_Phone:this.Email_Phone,Name:this.Name,avatar:this.avatar
          },
        process.env.JWT_SECRET_KEY,
        {
            algorithm:'HS256',
            expiresIn:'7d'
        }
    )
    }
}
export default mongoose.model("user",user)



