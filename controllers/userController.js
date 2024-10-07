import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
// import userModel from '../models/userModel.js'; // Assuming you have a User model
import express from 'express';
// import userModel from '../models/userModel.js';
import Information from '../models/informationModel.js'; // Assuming you have an Information model
import userModel from '../models/userModel.js';

// TOKEN EXPIRY and JWT_SECRET
const TOKEN_EXPIRY = '7d'; // Token expiry time

// Register controller
export const register = async (req, res) => {
  const { username, email, role, password } = req.body;

  try {
    // Check if the user already exists
    let user = await userModel.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new userModel({
      username,
      email,
      role,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, role, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
   if (user.role===role){
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    res.status(200).json({ message: 'Logged in successfully', token: token, user });
   }else{
    
    res.status(404).json({ message: 'Something went wrong' });
   }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const profile=async(req,res)=>{
  try {
    const data= await userModel.findById(req.params.id);  
    console.log(data);
    res.status(200).json({data})
  } catch (error) {
    res.status(500).json({message: 'ERROR FETCHING PROFILE'})
  }
 
}

// Update profile controller
export const updateProfile = async (req, res) => {
  const { username, email, role } = req.body;

  try {
    // Find the user by ID
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Logout controller to clear the cookie
export const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// Controller for posting information data
export const postInformation = async (req, res) => {
  const userId=req.params.id
  const { preferences, dob, studyingIn, phone } = req.body;

  try {
    // Create a new information entry
    const information = new Information({
      userId,
      preferences,
      dob,
      studyingIn,
      phone,
    });

    await information.save();

    res.status(201).json({ message: 'Information posted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
