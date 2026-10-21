const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const passwordCriteriaRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+={}[\]|:;"'<>,.~/`])[A-Za-z\d@$!%*?&#^()_\-+={}[\]|:;"'<>,.~/`]{8,}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    }, 
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String, 
      required: [true,'Password is required'],
      minlength: [8, 'Password must be atleast 8 characters long'],
      validate: {
        validator: function (value) {
          if (!this.isModified('password')) {
            return true;
          }
          return passwordCriteriaRegax.test(value);
        }, 
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
      }
    }, 
    role: {
      type: String, 
      enum : {
        values: ['customer', 'admin', 'support'],
        message: 'Role must be customer, admin, or support'
      }, 
      default: 'customer',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id, role: this.role, email: this.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);