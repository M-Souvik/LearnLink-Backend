import express from 'express';
import { Checkout, getAllCourses, getLectures, getMyCourse, getSpecificCourse, getSpecificLecture, paymentVerification } from '../controllers/courseController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router= express.Router();

router.get("/course/",getAllCourses);
router.get("/course/:id",getSpecificCourse);
router.get("/lectures/:id",isAuth,getLectures);
router.get("/lecture/:id",isAuth,getSpecificLecture);
router.get("/mycourse",isAuth,getMyCourse);
router.post('/course/checkout/:id', isAuth, Checkout);
router.post('/verfication/:id',isAuth, paymentVerification);

export default router