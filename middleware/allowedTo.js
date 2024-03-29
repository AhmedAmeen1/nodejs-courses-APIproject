const AppError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
module.exports = (...roles)=>{


    return(req,res,next)=>{
        if(!roles.includes(req.currentUser.role)) {
            const error = AppError.create('You are not allowed to access this route' , 403 , httpStatusText.ERROR);
            next(error);
        }
        next();
}}