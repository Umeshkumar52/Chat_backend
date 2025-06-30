import express from "express";
import {createUser,userInf,searchUsers,logout,login,updateUser,userFollowing,following, unfollowing,userAvailability, forgetPassword, resetPassword, googleAuthSignIn, profile} from '../controllers/userControllers.js'
import upload from "../midilwares/multer.js";
import checkAuth from "../midilwares/checkAuth.js";
import authentication from "../midilwares/authentication.js";
const router=express.Router()
router
.get('/checkAuth',checkAuth)
.post('/createUser',upload.single('avatar'),authentication,createUser)
.post('/forget-password',forgetPassword)
.post('/reset-password',resetPassword)
.post('/login',login)
.post('/google-auth',googleAuthSignIn)
.get('/userInf',authentication,userInf)
.get('/:UserName',userAvailability)
.get('/UserName/:searchTerm',authentication,searchUsers)
.get('/profile/:UserName',authentication,profile)
.put('/update',upload.single('file'),authentication,updateUser)
.get('/logout',authentication,logout)
.put('/following/:requester/:reciever',authentication,following)
.get('/following/:user_id',authentication,userFollowing)
.put('/unfollowing/:requester/:reciever',authentication,unfollowing)
export default router;