import expres from 'express'
import upload from '../midilwares/multer.js'
import {SaveSocialCom,SaveTextCom,GetAllMessages} from '../controllers/chatsController.js'
const router=expres.Router()
router
.post('/chat/textCom/:_id',SaveTextCom)
.post('/chat/socialCom/:_id/:sender_id',upload.single("file"),SaveSocialCom)
.get('/chat/:_id/:sender_id',GetAllMessages)
export default router