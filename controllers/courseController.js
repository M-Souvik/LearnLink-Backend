import express from 'express';
import { Courses } from '../models/courseModel.js';
import { Lecture } from '../models/lectureModel.js';
import userModel from '../models/userModel.js';
import { instance } from '../index.js';
import crypto from 'crypto'
import { Payment } from '../models/paymentModel.js';

export const getAllCourses=async(req,res)=>{
    try {
    const name = req.query.name;
    const category = req.query.category; // Added category filter
    let courses;
    if (name) {
        courses = await Courses.find({ name: new RegExp(name, 'i') }).populate('lectures', 'title _id');
    } else if (category) {
        courses = await Courses.find({ category: new RegExp(category, 'i') }).populate('lectures', 'title _id'); // Filter by category
    } else {
        courses = await Courses.find().populate('lectures', 'title _id');
    }
    res.json({courses});
    } catch (error) {
    res.status(500).json({message: "Something unexpected occurred",error: error.message})
    }
    
}
export const getSpecificCourse=async(req,res)=>{
    try {
    const course=await Courses.findById(req.params.id).populate('lectures', 'name _id');
    res.json({course});
    } catch (error) {
    res.status(500).json({message: "Something unexpected occurred"})
    }
    
}
export const getLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ course: req.params.id });
        const user = await userModel.findById(req.user._id);
        
        if (user.role === "admin") {
            return res.json({ lectures }); // Return after sending response
        }
        
        if (!user.subscription.includes(req.params.id)) {
            return res.status(400).json({ message: "You are not subscribed to this course" });
        }
        
        return res.json({ lectures }); // Return after sending response
    } catch (error) {
        return res.status(500).json({ message: 'Something unexpected occurred' });
    }
}
export const getSpecificLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id); // Changed from find to findById
        const user = await userModel.findById(req.user._id);
        
        if (user.role === "admin") {
            return res.json({ lecture }); // Return after sending response
        }
        
        if (!user.subscription.includes(req.params.id)) {
            return res.status(400).json({ message: "You are not subscribed to this course" });
        }
        
        return res.json({ lecture }); // Return after sending response
    } catch (error) {
        return res.status(500).json({ message: 'Something unexpected occurred' });
    }
}

export const getMyCourse=async(req,res)=>{
    try {
        const myCourse=await Courses.find({_id: req.user.subscription});
        res.json({myCourse})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const Checkout = async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);
      const course = await Courses.findById(req.params.id);
      
      // Check if the user already has the course in their subscription
      if (user.subscription.includes(course._id)) {
        return res.status(400).json({ message: "You already have this course" });
      }
  
      // Options for Razorpay order creation
      const options = {
        amount: Number(course.price * 100), // Amount in subunits (e.g., INR in paise)
        currency: "INR"
      };
  
      // Create an order using Razorpay instance
      const order = await instance.orders.create(options);
  
      // Return the order and course details to the client
      return res.status(201).json({ order, course });
  
    } catch (error) {
      // Handle errors and return an appropriate message
      return res.status(500).json({ message: `Something went wrong: ${error.message}` });
    }
  };
  
//   import crypto from 'crypto'; // Ensure you're importing 'crypto' at the top of your file

  export const paymentVerification = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      // Create a string body to verify the payment
      const body = razorpay_order_id + '|' + razorpay_payment_id;
  
      // Generate the expected signature using the Razorpay secret key
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body)
        .digest("hex");
  
      // Compare the expected signature with the received signature
      const isAuthentic = expectedSignature === razorpay_signature;
  
      if (isAuthentic) {
        // Store the payment details in the database
        await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        });
  
        // Find the user and the course
        const user = await userModel.findById(req.user._id);
        const course = await Courses.findById(req.params.id);
  
        // Add the course to the user's subscription
        user.subscription.push(course._id);
  
        // Save the updated user object
        await user.save(); // Ensure you're calling save as a function
  
        // Respond with a success message
        return res.status(200).json({ message: "Course Added Successfully" });
      } else {
        // If the payment verification fails
        return res.status(400).json({ message: "Payment Failed" });
      }
    } catch (error) {
      // Handle errors and return an appropriate message
      return res.status(500).json({ message: `Something went wrong: ${error.message}` });
    }
  };
  