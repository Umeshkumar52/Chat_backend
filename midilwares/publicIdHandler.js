import fs from 'fs'
import crypto from 'crypto'
export default function publicIdHandler(file,user_id,type){
  const fileContent=fs.readFileSync(file.path)
  const hash=crypto.createHash('md5').update(fileContent+Date.now()).digest('hex')
  return `${type}_${user_id}_${hash}`
}

