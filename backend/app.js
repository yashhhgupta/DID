const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const HttpError = require('./models/http-error');

const userRoutes = require('./routes/user-routes')

const app = express();

app.use(bodyParser.json());

app.use('/users',userRoutes);

// app.use((req,res,next)=>{
//     const error=new HttpError("Couldn't find this route",404);
//     throw error;
// })

mongoose.connect('mongodb+srv://yash:1WXTqVU7fJX6DYwy@cluster0.93frgpp.mongodb.net/DID?retryWrites=true&w=majority').then(()=>{
    console.log("MongoDB Connected")
    app.listen(5000);
}).catch(
    (err)=> console.log(err)
);
