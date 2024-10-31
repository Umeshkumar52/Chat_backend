import notification from "../models/notificationSchema.js"
import user from "../models/user.js"
export default async function notificationHandler(User,response){
    // const User=await user.findById(_id).populate("Followers")
    const notifications= User.Followers.map((Element)=>({
        sender:User._id,
        reciever:Element._id,
        message:`uploaded a new post !`,
        post_id:response._id,
        type:"postReact"
    }))   
    await notification.insertMany(notifications)
    await user.updateMany({_id:{$in:User.Followers}}
        ,{$inc:{unReadNotification:1}}
    )
}