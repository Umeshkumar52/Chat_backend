import mongoose from "mongoose";
const base_url="mongodb://localhost:27017/Chats_Database"
async function dbConnect(){
    await mongoose.connect(base_url)
    console.log("database is connected");
}
export default dbConnect