import { Courses } from "../models/courseModel.js";
import { Lecture } from "../models/lectureModel.js";
import {rm} from 'fs'
import { promisify } from "util";
import fs from 'fs'
import userModel from "../models/userModel.js";
export const createCourse=async(req,res)=>{
    try {
        const {name, description, category, createdBy, duration, price}=req.body;
        const image = req.file;
        const createdCourse=await Courses.create({
            name,
            description,
            category,
            createdBy,
            image: image?.path,
            duration,
            price,
        })
        res.status(201).json({message: "Course created successfully", createdCourse})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}

const unlinkAsync=promisify(fs.unlink);
export const deleteCourse=async(req,res)=>{
    try {
        const course=await Courses.findById(req.params.id);
        const lectures=await Lecture.find({course: course._id});
        await Promise.all(
            lectures.map(async(lecture)=>{
                await unlinkAsync(lecture.video);
                console.log("video deleted")
        })
        )

        rm(course.image,()=>{
            console.log("Image deleted")
        })

        await Lecture.find({course: req.params.id}).deleteMany();

        await course.deleteOne()

        await userModel.updateMany({},{$pull:{subscription: req.params.id}})

        res.status(201).json({message: "Course deleted successfully"})
        
    } catch (error) {
        res.status(500).json({message: "Something Unexpected Happened"})
    }

}
export const addLectures=async(req,res)=>{
    try {
       const course=await Courses.findById(req.params.id)

       if(!course) return res.status(404).json({message:"No course with this id"})
        const {title, description, duration}=req.body;
        const file=req.file;
        const lecture=await Lecture.create({
            title,
            description,
            duration,
            video: file?.path,
            course: course._id
        })

        course.lectures.push(lecture._id); // Save the lecture in the course
        await course.save(); // Save the course

        res.status(201).json({message: "Lecture added successfully", lecture})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}
export const DeleteLecture=async(req,res)=>{
    try {
       const lecture=await Lecture.findByIdAndDelete(req.params.id)

       rm(lecture.video,()=>{
        console.log("Video Deleted")
       })

        if(!lecture) return res.status(404).json({message: "No lecture with this id"})
        res.status(200).json({message: "Lecture deleted successfully"})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}
export const UpdateLecture=async(req,res)=>{
    try {
       const lecture=await Lecture.findByIdAndUpdate(req.params.id, {
           title: req.body.title,
           description: req.body.description,
           duration: req.body.duration,
           video: req.file?.path,
       }, { new: true });

       if(!lecture) return res.status(404).json({message: "No lecture with this id"})
        res.status(200).json({message: "Lecture Updated successfully", lecture})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}
export const getAllStats=async(req,res)=>{
    try {
        const totalUsers=(await userModel.find()).length;
        const totalLectures=(await Lecture.find()).length;
        const totalCourses=(await Courses.find()).length;
        const stats={
            totalUsers,
            totalLectures,
            totalCourses
        }
        res.json({stats})
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}