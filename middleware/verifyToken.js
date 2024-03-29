const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');



const verifyToken =(req,res,next) => {
    const authHeader =  req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        const error = AppError.create('Token not provided' , 401 , httpStatusText.ERROR);
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET);
        req.currentUser = currentUser;
        next();
    } catch (err) {
        const error = AppError.create('Invalid token' , 401 , httpStatusText.ERROR);
        return next(error);
    }
};

module.exports = verifyToken;