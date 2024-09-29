import express from 'express'
import { friendReqResponse, friendRequest, friendsAllRequest } from '../controllers/freindReqController.js'
const router=express.Router()
router
.post('/friendReq/:requester/:reciever',friendRequest)
.post('/friendRes/:requester/:reciever/:resp',friendReqResponse)
.get('/allfriendReq/:reciever',friendsAllRequest)
export default router