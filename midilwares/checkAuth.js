import jwt from 'jsonwebtoken'
export default async function checkAuth(req,res){
try {
    const {authToken}=req.cookies
     if(!authToken){
        return res.status(401).json({
            success:false,
            message:null
        })
     }
    const ExistUser=await jwt.decode(authToken,process.env.JWT_SECRET_KEY)
         res.status(200).json({
            success:true,
            message:ExistUser
        })
} catch (error) {
    return res.status(401).json({
        success:false,
        message:null
    })
}
}