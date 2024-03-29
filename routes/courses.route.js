const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courses.controller');
const validationSchema = require('../middleware/validationSchema');
const {body , validationResult} = require('express-validator');
const verifyToken = require('../middleware/verifyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middleware/allowedTo');

router.route('/') 
    .get(courseController.getCourses)
    .post(verifyToken,validationSchema() , courseController.addCourse);

router.route('/:id')
    .get(courseController.getCourse)
    .put(courseController.updateCourse)
    .delete(verifyToken,allowedTo(userRoles.ADMIN , userRoles.MANAGER),courseController.deleteCourse);


module.exports = router;
