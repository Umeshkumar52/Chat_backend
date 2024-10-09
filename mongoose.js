import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const base_url="mongodb://localhost:27017/Chats_Database"
const url=`mongodb+srv://Eangager:${process.env.MONGOOSE_PASSWORD}@cluster0.jke76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
async function dbConnect(){
    await mongoose.connect(base_url)
    console.log("database is connected");
}
export default dbConnect