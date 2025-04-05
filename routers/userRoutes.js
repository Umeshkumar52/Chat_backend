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
.get('/userWithPost/:user_id',userWithAllPost)
.get('/userWithAllPost/:UserName',userWithAllPost)
.put('/update',upload.single('file'),updateUser)
.get('/logout',logout)
.put('/following/:requester/:reciever',following)
.get('/following/:user_id',userFollowing)
.put('/unfollowing/:requester/:reciever',unfollowing)
export default router;