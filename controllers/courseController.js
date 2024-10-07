import express from 'express';
import { Courses } from '../models/courseModel.js';
import { Lecture } from '../models/lectureModel.js';
import userModel from '../models/userModel.js';

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