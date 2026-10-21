const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      maxlength: [100, 'Ticket cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Billing', 'Technical', 'Account', 'Other'],
        message: 'Invalid category selection'
      },
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: 'Low',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    screenshotUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Open', 'In Progress', 'Resolved', 'Closed'],
        message: 'Status must be Open, In Progress, Resolved, or Closed',
      },
      default: 'Open',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    reopenCount: {
      type: Number,
      default: 0,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.pre('save', async function () {
  if (!this.isNew) {
    return;
  }

  const lastTicket = await this.constructor.findOne({ ticketId: { $exists: true } }).sort({ ticketId: -1 });
  if (lastTicket && lastTicket.ticketId) {
    const lastNumber = parseInt(lastTicket.ticketId.split('-')[1]);
    this.ticketId = `TKT-${lastNumber + 1}`;
  } else {
    this.ticketId = 'TKT-1000';
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);