const User = require('../models/User'); // Adjust path as needed

const checkFirstLogin = async (req, res, next) => {
  if (!req.oidc || !req.oidc.isAuthenticated()) {
    return next(); // Skip if user is not logged in
  }

  const { email, name } = req.oidc.user;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // First login: create user with minimal data
      user = new User({
        name: name || '',
        email,
        courses: [],
        level: 1
      });
      await user.save();

      // Redirect to profile completion page
      return res.redirect('/complete-profile');
    }

    // User exists, proceed
    next();
  } catch (err) {
    console.error('First login check failed:', err);
    res.status(500).send('Server error');
  }
};

module.exports = checkFirstLogin;
