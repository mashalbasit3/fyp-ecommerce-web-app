import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {transporter} from '../utils/email.js'

//user register
export const registerUser = async(req, res) => {
    try{
        const {email, password, confirmPassword, isAdmin, firstName, lastName} = req.body;

         if (!password || !confirmPassword || !email || !firstName || !lastName){
            return res.status(400).send("Please fill required fields");
         }
      
         const emailExists = await User.findOne({email});
      
         if(emailExists){
            return res.status(409).send({message:"Email is already in use, try another"});
         }
         if(password!==confirmPassword){
            return res.status(409).send({message:"Passwords don't match, try again"});
         } else{
      
            const encryptPassword = await bcrypt.hash(password, 5);
            const newUser = new User({email,password:encryptPassword,
                isAdmin, firstName, lastName});
         
            await newUser.save();
            return res.status(201).send({message: "User created successfully", User:newUser});
         }

    } catch(error){
        res.status(500).send({message: error.message});
    }
};

// user login
export const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).send({message: 'Email, password or both are incorrect'})
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            return res.status(401).send({message: 'Email, password or both are incorrect'});
        }
    
        const token = jwt.sign({userId:user._id, email:user.email}, process.env.SECRET, {expiresIn:"1h"});
        console.log(token)
        res.cookie('jwt', token, { httpOnly: true, });
        res.status(200).send({message: "Login successful", isAdmin: user.isAdmin});
        
        
    } catch (error) {
            res.status(500).send({message: error.message});
        }
}

//user logout
export const logout = async (req,res) => {
    try{
        res.clearCookie('jwt');
        res.status(200).send({message: "Logout successful"});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

//get all record
export const getAllUsers = async(req, res) => {
    try{
        let page = req.query.page;
        let pageLimit = req.query.limit;
   
        const users = await User.find()
        .skip((page-1)*pageLimit)
        .limit(pageLimit);

        if(users){
            res.status(200).send(users);
        }

    } catch (error){
        res.status(500).send({message: error.message});
    }
}

// find single record
export const getSingleUser = async (req, res) => {
    try {
        const {userId} = req.user;
        const user = await User.findById(userId);

        if(user){
            res.status(200).send(user);
        }

    } catch (error){
            res.status(404).send({message: error.message});
    }
}

// find single record for admin
export const getSingleUserAdmin = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);

        if(user){
            res.status(200).send(user);
        }

    } catch (error){
            res.status(404).send({message: error.message});
    }
}

// update single record
export const updateSingleUser = async (req, res) => {
    try {
        const {userId} = req.user;

        const user = await User.findByIdAndUpdate(userId, req.body,{new:true});

        if(user){
            res.status(200).send(user);
        }
    } catch (error) {
        res.status(404).send({message: error.message});
    }
}

//delete single record
export const deleteSingleUser = async(req, res) => {
    try {
        const {userId} = req.user;
        const user = await User.findByIdAndDelete(userId);

        if (user){
            res.status(204).send({message: "Successfully deleted user"});
        }
    } catch (error){
        res.status(404).send({message: error.message});
    }
}

//reset password
export const updatePassword = async(req,res) => {
    try{
        const{currentPassword, newPassword, confirmNewPassword} = req.body;
        const {userId} = req.user;
        const user = await User.findById(userId);

        const passwordValid = await bcrypt.compare(currentPassword, user.password);
        if(!user){
            return res.status(404).send({message: "User doesn't exist"});
        }

        if (!passwordValid){
            return res.status(400).send({message: "Please type correct current password"});     
        }
        
        if(newPassword !== confirmNewPassword){
            return res.status(400).send({message: "Please make sure both new passords and confirmed passwords are same"});
        }

        user.password = await bcrypt.hash(newPassword, 5);
        await user.save();

        res.status(200).send({message: "Password reset successfuly"});

    } catch (error){
        res.status(500).send({message: error.message});
    }
}

//forget password - send OTP
export const forgetPassowrdOTP = async (req,res) => {
    try{
        const {email} = req.body
        const otp = Math.floor(100000 + Math.random()*900000);
     
        const user = await User.findOne({email});
        if(!user){
           return res.status(404).send({error: "User not found"});
        }
     
        user.resetToken = otp.toString();
        user.resetTokenExpiration = new Date(new Date().getTime()+600000);
        await user.save();
     
        const mailOptions = {
           from: process.env.TRANS_EMAIL,
           to: email,
           subject: 'Password Reset OTP',
           text: `Your OTP for password reset is: ${otp}`
        };
     
        transporter.sendMail(mailOptions, (error,info)=>{
           if(error){
              console.log('Error sending email:', error, info);
              return res.status(500).send({error: 'Internal server error'});
           } 
            
           return res.status(200).send({ message: 'OTP sent to email' });
        });
        
    } catch (error){
        res.status(500).send({ message: error.message });
    }
}

//forget password - verify OTP
export const verifyOtp = async (req,res) => {
    try{
        const {email, otp} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (user.resetToken !== otp || new Date() > user.resetTokenExpiration) {
            return res.status(401).send({message: 'Invalid or expired OTP'});
        } else {
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            await user.save();

            return res.status(200).send({message: 'OTP confirmed'});
        }

    } catch (error){
        res.status(500).send({ message: error.message });
    }
}

//Forget Password - Reset Password
export const resetPassword = async (req,res) => {
    try{
        const {email, newPassword, confirmNewPassword} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if(newPassword !==confirmNewPassword){
            return res.status(400).send({message:"Passwords don't match"})
        }
            
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).send({ message: 'Password reset successful, redirecting to login' });

    } catch (error){
        res.status(500).send({ message: error.message });
    }
}