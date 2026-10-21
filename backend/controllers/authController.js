const User = require('../models/User');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const cleanEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      res.status(409);
      throw new Error('User already exists with this email');
    }
    
    let userRole = 'customer';
    if (role && (role.toLowerCase() === 'admin' || role.toLowerCase() === 'support' || role.toLowerCase() === 'customer')) {
      userRole = role.toLowerCase();
    }

    const user = await User.create({ 
      name: name.trim(), 
      email: cleanEmail, 
      password, 
      role: userRole 
    });

    res.status(201).json({
      token: user.generateToken(),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email and password');
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: user.generateToken(),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };