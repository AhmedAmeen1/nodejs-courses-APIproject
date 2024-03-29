const {body , validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Course = require('../models/course.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const AppError = require('../utils/appError');


const getCourses = asyncWrapper(async (req,res) =>{
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Course.find({} , {"__v" : false}).limit(limit).skip(skip);
    res.json({status : httpStatusText.SUCCESS , data : {courses}});
});

const getCourse = asyncWrapper( async (req,res, next) =>{
    const courseId = req.params.id
    const course = await Course.findById(courseId);
    if(!course){
        // const error = new Error();
        // error.message = 'Not found course';
        // error.statusCode = 404;
        const error = AppError.create('Not found course' , 404 , httpStatusText.FAIL)
        return next(error);
    }
        return res.json({status : httpStatusText.SUCCESS, data : {course}});
});



const addCourse = asyncWrapper(async (req,res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = AppError.create(errors.array() , 400 ,httpStatusText.FAIL )
        // return res.status(400).json({status : httpStatusText.FAIL, data : {errors : errors.array()}})
        return next(error);
    }
    const newCourse = new Course(req.body);
     await  newCourse.save()
    res.status(201).json({status : httpStatusText.SUCCESS, data : {course : newCourse}});
})

const updateCourse = asyncWrapper(async (req,res,next) =>{

    const courseId = req.params.id;

    const course = await Course.findByIdAndUpdate(courseId, req.body)
    if (!course) {
        return res.status(404).send('The course with the given ID was not found');
    }
    res.json({status : httpStatusText.SUCCESS, data : {course}});
})

const deleteCourse = asyncWrapper(async (req,res,next) =>{
    const courseId = req.params.id;
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
        return res.status(404).send({status : httpStatusText.FAIL, course : "Course not found"});
    };
    res.json({status : httpStatusText.SUCCESS, data : null});
});

module.exports = {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
}