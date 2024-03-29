const {body , validationResult} = require('express-validator');



const validationSchema = () =>{
    return[
        body('title')
        .notEmpty()
        .withMessage("Title is required")
        .isLength({min: 2})
        .withMessage("Title is atleast 2 chars"),
        body('price')
        .notEmpty()
        .withMessage("Price is required")
    ]
};

module.exports = validationSchema;