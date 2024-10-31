import express from 'express'
import { userNotification, notificationSave, unReadNotification, updateUnReadNotification, specificNotifUpdate } from '../controllers/notificationController.js'
const router=express.Router()
router
.get('/:reciever_id',userNotification)
.post('/create/:reciever_id/:sender_id',notificationSave)
.put('/update/:reciever_id',updateUnReadNotification)
.get('/unReadNotification/:reciever_id',unReadNotification)
.put('/specificNotifUpdate/:user_id/:_id',specificNotifUpdate)
export default router