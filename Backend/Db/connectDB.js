import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongoose is connected");
    } catch (error) {
        console.log("mongoDB connection error :"+ error);
    }
}

export default connectDB;
