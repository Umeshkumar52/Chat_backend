import expres from 'express'
import upload from '../midilwares/multer.js'
import {GetAllMessages, SaveMessage } from '../controllers/chatsController.js'
const router=expres.Router()
router
.post('/chat/:_id',upload.single("file"),SaveMessage)
.get('/chat/:_id/:sender_id',GetAllMessages)
export default router