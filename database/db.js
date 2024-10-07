import mongoose from 'mongoose';

export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.DATABASE);
        console.log("Database connected")
    }catch(err){
        console.log(err)
    }
}