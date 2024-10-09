import express from 'express'
import { allReals, commentToReel, likeToReel, newReel, particularUserReel, reel_Comments } from '../controllers/reelsController.js'
import upload from '../midilwares/multer.js'
const router=express.Router()
router
.post('/newReel/:user_id',upload.single('reel'),newReel)
.get('/',allReals)
.get('/:author',particularUserReel)
.put('/commentToReel/:post_id',commentToReel)
.get('/reelComment/:post_id',reel_Comments)
.put('/likeToReel/:post_id/:author',likeToReel)
.delete('/deleteReel/:post_id/:public_id')
export default router
