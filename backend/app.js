const express = require('express')
const app = express();
const cors=require('cors')
const dotenv = require('dotenv').config()

const connectDB = require('./config/mongo');
const authMiddleware = require('./config/auth0');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded())
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


app.get('/', async (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get("/api/user/:email", async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email }); // await added
  if (!user) return res.status(404).json({ message: "User not found" });

  const { _id, ...cleanUser } = user.toObject(); // remove _id if needed
  res.status(200).json(cleanUser);
});




app.post("/api/user", async (req, res) => {
  const { email, xp, level } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    const { _id, ...cleanUser } = existing.toObject();
    return res.status(200).json(cleanUser);
  }

  const newUser = new User({ email, xp, level });
  await newUser.save();

  const { _id, ...cleanNewUser } = newUser.toObject();
  res.status(201).json(cleanNewUser);
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Backend server listening on port ', PORT);

})



//128 130 132