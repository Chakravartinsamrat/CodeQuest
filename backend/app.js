const express=require('express')
const app=express();

const dotenv=require('dotenv').config()

const connectDB = require('./config/mongo');
const authMiddleware = require('./config/auth0');

app.use(authMiddleware);
connectDB()

//route imports
const getProfileRoute=require('./routes/getProfile');
const User = require('./models/User');
const Course = require('./models/Course');

//route use
app.use('/get-profile',getProfileRoute)


app.get('/', async(req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });




const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log('Backend server listening on port ',PORT);
    
})