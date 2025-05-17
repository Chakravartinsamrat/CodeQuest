const express = require('express')
const app = express();

const dotenv = require('dotenv').config()

const connectDB = require('./config/mongo');
const authMiddleware = require('./config/auth0');

app.use(express.json());

app.use(authMiddleware);
connectDB()

//models
const User = require('./models/User');
const Course = require('./models/Course');
const Challenge = require('./models/Challenge');


//route imports
const getProfileRoute = require('./routes/getProfile');
const createCourse = require('./routes/createCourse')
const getProgrammingChallengesRoute = require('./routes/challenges/programming/programming')




//route use
app.use('/get-profile', getProfileRoute)
app.use('/create-course', createCourse)
app.use('/challenges/programming', getProgrammingChallengesRoute)

app.post('/prompt', (req, res) => {
  const keyword = req.body
  res.send(`Act as a knowledgeable tutor. I am learning about ${keyword}.
  Please give me 5 questions to test my understanding.
  The questions should progress from easy to difficult, with the 5th being the most challenging.
  Do not provide the answers yet. Just list the questions clearly, numbered 1 through 5.`)
})
app.get('/', async (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});




const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Backend server listening on port ', PORT);

})



//128 130 132