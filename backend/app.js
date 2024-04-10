const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const HttpError = require('./utils/http-error');
require("dotenv").config();


const userRoutes = require('./routes/user-routes')
const adminRoutes = require('./routes/admin-routes')
const departmentRoutes = require('./routes/department-routes')
const surveyRoutes = require('./routes/survey-routes')
const diversityRoutes = require('./routes/diversity-routes')
const teamRoutes = require('./routes/team-routes')
const serviceRoutes = require('./routes/service-routes')

const app = express();
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json({ limit: "35mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
}); //cors error

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/department', departmentRoutes);
app.use('/survey', surveyRoutes);
app.use('/diversity', diversityRoutes);
app.use('/team', teamRoutes);
app.use("/service", serviceRoutes);



// app.use((req,res,next)=>{
//     const error=new HttpError("Couldn't find this route",404);
//     throw error;
// })

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {});


module.exports = app;
