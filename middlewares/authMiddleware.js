import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes
export const isAuth = async(req, res, next) => {
  const token = req.headers.token;

  // Check if the token exists
  if (!token) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Directly use decoded._id to find the user without storing it in req.user
    const user = await userModel.findById(decoded._id);
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'User not found', user: req.user });
    }
    // Store the user in req.user
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
//Middleware to check admin
export const isAdmin=async(req,res,next)=>{
  try {
    // Check if req.user is set and has the role "admin"
    if(!req.user || req.user.role !== "admin"){
      return res.status(401).json({ message: 'Invalid Admin Credentials' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
