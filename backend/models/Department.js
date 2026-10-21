const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema (
  {
    name : {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Department name cannot exceed 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Department description is required'],
      trim: true,
      maxlength: [200, 'Description cannit exceed 200 characters']
    }, 
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', departmentSchema);