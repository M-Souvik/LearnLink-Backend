import express from 'express';
import { getAllCourses, getLectures, getSpecificCourse, getSpecificLecture } from '../controllers/courseController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router= express.Router();

router.get("/course/",getAllCourses);
router.get("/course/:id",getSpecificCourse);
router.get("/lectures/:id",isAuth,getLectures);
router.get("/lecture/:id",isAuth,getSpecificLecture);

export default router