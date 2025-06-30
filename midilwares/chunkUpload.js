import path from "path";
import multer from "multer";
 const storage= multer.diskStorage({
    destination:(_req,file, cb) =>cb(null,'uploads/'),
       filename:(req,file,cb)=>{
       
         const{fileName,chunkIndex}=req.body
         cb(null,`${fileName}-chunk-${chunkIndex}`)
       }
  })
export default multer({storage});