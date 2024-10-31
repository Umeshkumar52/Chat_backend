import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const base_url="mongodb://localhost:27017/Chats_Database"
const url=process.env.MONGOOSE_URI
async function dbConnect(){
    try {
        await mongoose.connect(url)
        console.log("Database connected");
    } catch (error) {
        return
    }
   
}
export default dbConnect