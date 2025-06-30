import expres from 'express'
import upload from '../midilwares/multer.js'
import {SaveSocialCom,SaveTextCom,GetAllMessages,deleteChats} from '../controllers/chatsController.js'
import chunkUpload from '../midilwares/chunkUpload.js'
const router=expres.Router()
router
.post('/chat/textCom/:_id',SaveTextCom)
.post('/chat/socialCom/:_id/:sender_id', upload.single("file"),SaveSocialCom)
.get('/chat/:_id/:sender_id',GetAllMessages)
.delete('/chat/delete/:conversation_id',deleteChats)
export default router