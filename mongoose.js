import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const base_url="mongodb://localhost:27017/Chats_Database"
const url=process.env.MONGOOSE_URI
async function dbConnect(){
    await mongoose.connect(url)
    console.log("database is connected");
}
export default dbConnect