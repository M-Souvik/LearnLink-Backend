import express from 'express';
import { register, login, logout, profile, updateProfile, postInformation } from '../controllers/userController.js';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';


const router = express.Router();
// Routes
router.post('/register', register);
router.get('/:id',profile);
router.put('/edit/:id',isAuth,updateProfile);
router.put('/:id',isAuth,postInformation);
router.post('/login', login);
router.get('/logout', logout);

// Example of a protected route
router.get('/dashboard', isAuth, (req, res) => {
  res.status(200).json({ message: `Welcome user ${req.user}` });
});

export default router;
