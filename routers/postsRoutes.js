import express from 'express'
import upload from '../midilwares/multer.js'
import {allStories, deletePost, deleteStory, getPosts, likeAPost, newPost, newStory, post_Comments, updateToPost } from '../controllers/userMediaCollectionController.js'
import authentication from '../midilwares/authentication.js'
const router=express.Router()
router
.get('/AllPost',getPosts)
.get('/postComments/:post_id',post_Comments)
.post('/newPost/:user_id',upload.single("file"),newPost)
.put('/updateToPost/:post_id',updateToPost)
.put('/likePost/:post_id/:author',likeAPost)
.delete('/deletePost/:_id',deletePost)
.post('/story',upload.single("story"),newStory)
.get('/stories',allStories)
.delete('/deletePost/:post_id/:public_id',deletePost)
.delete('/deleteStory/:post_id/:public_id',deleteStory)

export default router