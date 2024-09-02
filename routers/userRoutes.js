import express from "express";
import {createUser,userInf} from '../controllers/userControllers.js'
const router=express.Router()
router.
post('/createUser',createUser)
.get('/userInf',userInf)
export default router