import express from 'express'
import { allReals, commentToReel, deletReel,disLikeToReel,likeToReel, newReel, particularUserReel, reel, reel_Comments } from '../controllers/reelsController.js'
import upload from '../midilwares/multer.js'
import authentication from '../midilwares/authentication.js'
const router=express.Router()
router
.post('/newReel/:user_id',upload.single('reel'),newReel)
.get('/allReels/:offset/:limit',allReals)
.get('/:_id',reel)
.get('/:author',particularUserReel)
.put('/commentToReel/:post_id',commentToReel)
.get('/reelComment/:post_id',reel_Comments)
.put('/likeToReel/:post_id/:author',likeToReel)
.put('/disLikeToReel/:post_id/:author',disLikeToReel)
.delete('/deleteReel/:reel_id/:public_id',deletReel)
export default router
