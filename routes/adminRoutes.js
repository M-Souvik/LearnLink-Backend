import  express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { uploadFiles } from '../middlewares/multer.js';
import { addLectures, createCourse, deleteCourse, DeleteLecture, getAllStats, UpdateLecture } from '../controllers/adminController.js';
const router=express.Router();


router.post("/course/create",isAuth, uploadFiles, createCourse);
router.delete("/course/:id",isAuth, isAdmin, deleteCourse);
router.post("/course/:id",isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/lecture/:id",isAuth, isAdmin, DeleteLecture);
router.put("/lecture/edit/:id",isAuth, isAdmin, uploadFiles, UpdateLecture);
router.get('/stats',isAuth,isAdmin,getAllStats)


export default router

