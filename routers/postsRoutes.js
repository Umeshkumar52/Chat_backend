import express from 'express'
import upload from '../midilwares/multer.js'
import {allStories, deletePost, deleteStory,dish_likeAPost,getPosts, likeAPost, newPost, newStory, Post, post_Comments, updateToPost } from '../controllers/userMediaCollectionController.js'
import authentication from '../midilwares/authentication.js'
const router=express.Router()
router
.get('/AllPost/:offset/:limit',authentication,getPosts)
.get('/specPost/:_id',Post)
.get('/postComments/:post_id',authentication,post_Comments)
.post('/newPost/:user_id',authentication,upload.single("file"),newPost)
.put('/updateToPost/:post_id',authentication,updateToPost)
.put('/likePost/:post_id/:author',authentication,likeAPost)
.put('/dis_like/:post_id/:author',authentication,dish_likeAPost)
.delete('/deletePost/:_id',authentication,deletePost)
.post('/story',authentication,upload.single("story"),newStory)
.get('/stories',allStories)
.delete('/deletePost/:post_id/:public_id',authentication,deletePost)
.delete('/deleteStory/:post_id/:public_id',authentication,deleteStory)

export default router