require('dotenv').config();
const express = require('express');
const app = express();
const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
const httpStatusText = require('./utils/httpStatusText');
const cors = require('cors');
const path = require('path')


app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const mongoose = require('mongoose');

const url = process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log('Error connecting to database');
    console.log(err);
});

app.use(cors());

app.use('/api/courses' , coursesRouter);
app.use('/api/users' , usersRouter);
app.all('*' , (req, res)=>{
    return res.status(404).json({status: httpStatusText.ERROR , message: 'This resource does not exist'})
})
app.use((error, req, res, next)=>{
    // console.log(error);
    return res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR , message: error.message, code: error.statusCode || 500 , data: null})
});



app.listen(process.env.PORT || 3000 , ()=>{
    console.log('Server is running on port 3000');
})