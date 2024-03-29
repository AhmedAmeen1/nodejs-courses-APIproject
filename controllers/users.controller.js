const {body , validationResult} = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');

const getUsers = asyncWrapper(async (req,res) =>{
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({} , {"__v" : false, "password": false}).limit(limit).skip(skip);
    res.json({status : httpStatusText.SUCCESS , data : {users}});
});

const register = asyncWrapper(async(req,res,next) => {
    const {firstname,lastname,email,password,role} = req.body;
    const oldUser = await User.findOne({email: email});
    if (oldUser) {
        const error = AppError.create('User already exists' , 400 , httpStatusText.FAIL);
        return next(error);
    }

   const hashedPassword = await bcrypt.hash(password , 10)

    const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    });
    const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
    newUser.token = token; 
    await newUser.save();

    res.status(201).json({status : httpStatusText.SUCCESS , data : {user : newUser}})
});

const login = asyncWrapper(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        const error = AppError.create('Please provide email and password' , 400 , httpStatusText.FAIL);
        next(error)
    };
    const user = await User.findOne({email: email});
    if(!user){
        const error = AppError.create('User not found' , 404 , httpStatusText.FAIL);
        next(error)
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        const error = AppError.create('Invalid credentials' , 500 , httpStatusText.ERROR);
        next(error)
    }
    const token = await generateJWT({email: user.email, id: user._id, role: user.role});
    res.status(200).json({status: httpStatusText.SUCCESS , data :{token}})
});


module.exports = {
    getUsers,
    register,
    login,
}