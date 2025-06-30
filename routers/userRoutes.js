import express from "express";
import {createUser,userInf,searchUsers,logout,login,updateUser,userFollowing,following, unfollowing,userAvailability, forgetPassword, resetPassword, googleAuthSignIn, profile} from '../controllers/userControllers.js'
import upload from "../midilwares/multer.js";
import checkAuth from "../midilwares/checkAuth.js";
import authentication from "../midilwares/authentication.js";
const router=express.Router()
router
.get('/checkAuth',checkAuth)
.post('/createUser',upload.single('avatar'),createUser)
.post('/forget-password',forgetPassword)
.post('/reset-password',resetPassword)
.post('/login',login)
.post('/google-auth',googleAuthSignIn)
.get('/userInf',userInf)
.get('/:UserName',userAvailability)
.get('/UserName/:searchTerm',searchUsers)
.get('/profile/:UserName',profile)
.put('/update',upload.single('file'),updateUser)
.get('/logout',logout)
.put('/following/:requester/:reciever',following)
.get('/following/:user_id',userFollowing)
.put('/unfollowing/:requester/:reciever',unfollowing)
export default router;
