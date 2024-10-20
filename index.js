import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './database/db.js';

dotenv.config()

export const instance=new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret
})

const app=express();

app.use(cors({
    origin: 'http://localhost:3000', // Allow the frontend (Next.js) to make requests to the backend
    credentials: true,  // Allow sending cookies in CORS requests
  }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/uploads",express.static("uploads"))
const PORT = process.env.PORT;

//importing routes
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import RazorpayX from 'razorpayx';
import Razorpay from 'razorpay';
//using routes
app.use("/api/user",userRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api",courseRoutes)



app.get('/',(req,res)=>{
    res.json({message: 'Hello from Express'})
})


app.listen(PORT,()=>{
console.log(`Server running at http://localhost:${PORT}`);
connectDB();
})