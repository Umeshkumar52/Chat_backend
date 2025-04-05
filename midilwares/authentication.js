import jwt from 'jsonwebtoken'
async function authentication(req,res,next) {  
    const {authToken}=req.cookies
    if(!authToken){
        return res.status(401).json({
           success:false,
           message:"Please Login,you are not Authenticate"
       })
     }
     const ExistUser=await jwt.decode(authToken,process.env.JWT_SECRET_KEY)
    if(!ExistUser){
           return res.status(401).json({
           success:false,
           message:"Please Login,you are not Authenticate"
       })
     }
     req.user=ExistUser
     next()
}
export default authentication;