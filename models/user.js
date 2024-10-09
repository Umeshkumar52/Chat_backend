import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
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
},
{timestamps:true}
)
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
              _id:this._id,UserName:this.UserName,Email_Phone:this.Email_Phone,Name:this.Name
        },
        'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNTUwNzQxNywiaWF0IjoxNzI1NTA3NDE3fQ.o2H_GTlxL6qBOAUUP31E9VM6809B7EbIwHqeAKKXHLw',
        {
            algorithm:'HS256',
            expiresIn:'24h'
        }
    )
    }
}
export default mongoose.model("user",user)



