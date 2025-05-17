const express=require('express')

const router = express.Router();

// Get user by email
router.get('/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user);
});

// Create or update user
router.post('/', async (req, res) => {
  const { email, name, xp, level, phone } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    // Update
    user.name = name;
    user.xp = xp;
    user.level = level;
    user.phone = phone;
    await user.save();
  } else {
    // Create
    user = await User.create({ email, name, xp, level, phone });
  }

  res.json(user);
});
module.exports=router
