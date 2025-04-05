import express from "express";
import {createUser,userInf,searchUsers,logout,login,updateUser,userWithAllPost,userFollowing,following, unfollowing} from '../controllers/userControllers.js'
import upload from "../midilwares/multer.js";
import checkAuth from "../midilwares/checkAuth.js";
import authentication from "../midilwares/authentication.js";
const router=express.Router()
router
.get('/checkAuth',checkAuth)
.post('/createUser',upload.single('avatar'),createUser)
.post('/login',login)
.get('/userInf',userInf)
.get('/user/:UserName',searchUsers)
.get('/userWithPost/:user_id',authentication,userWithAllPost)
.get('/userWithAllPost/:UserName',authentication,userWithAllPost)
.put('/update',upload.single('file'),authentication,updateUser)
.get('/logout',authentication,logout)
.put('/following/:requester/:reciever',authentication,following)
.get('/following/:user_id',authentication,userFollowing)
.put('/unfollowing/:requester/:reciever',authentication,unfollowing)
export default router;