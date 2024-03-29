const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const verifyToken = require('../middleware/verifyToken');
const AppError = require('../utils/appError');
const multer  = require('multer');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if(imageType === 'image'){
        return cb(null,true)
    } else {
        return cb(AppError.create('File must be an image', 400))
    }
};
const upload = multer({ storage: diskStorage, fileFilter: fileFilter})


router.route('/') 
    .get(verifyToken,userController.getUsers);


router.route('/register') 
    .post(upload.single('avatar'),userController.register);


router.route('/login') 
    .post(userController.login);



module.exports = router;
