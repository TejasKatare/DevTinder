const express = require('express');
const { User } = require('../models/user');
const { validateUser } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills";
const validator = require('validator');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    const newUser = new User(req.body);
    try{
        validateUser(newUser);
        await newUser.encryptPassword();
        await newUser.save();
        const token = await jwt.sign({userId: newUser._id }, process.env.JWT_SECRET);
        const safeUserData = {};
        USER_SAFE_DATA.split(" ").forEach((key) => {
            safeUserData[key] = newUser[key];
        });
        console.log(token);
        res.cookie("token", token);
        res.status(201).json(newUser);
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        if (!validator.isEmail(email)) return res.status(404).json({"message": "Email is not valid"});
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({"message": "Email id not found"});
        }
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(401).json({"message": "Invalid password"});
        }
        const token = await jwt.sign({userId: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token);
        const safeUserData = {};
        USER_SAFE_DATA.split(" ").forEach((key) => {
            safeUserData[key] = user[key];
        });
        res.status(201).json(safeUserData);

    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

authRouter.post('/logout', (req, res) => {
    console.log("hit logout");
    res.cookie("token", "", {expiresIn: new Date(Date.now())});
    res.send("Logged Out Successfully");
});

module.exports = {authRouter};