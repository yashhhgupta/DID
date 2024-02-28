const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const HttpError = require('./models/http-error');
require("dotenv").config();


const userRoutes = require('./routes/user-routes')
const adminRoutes = require('./routes/admin-routes')
const departmentRoutes = require('./routes/department-routes')
const app = express();

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/department', departmentRoutes);



// app.use((req,res,next)=>{
//     const error=new HttpError("Couldn't find this route",404);
//     throw error;
// })

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
