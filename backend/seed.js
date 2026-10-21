require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Ticket = require('./models/Ticket');
const Comment = require('./models/Comment');

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');
    await Ticket.deleteMany();
    await Department.deleteMany();
    await Comment.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing database records.');
    const users = await User.create([
      {
        name: 'Sara R. (Support)',
        email: 'admin@example.com',
        password: 'Password@123',
        role: 'admin',
      },
      {
        name: 'Aarav K.',
        email: 'aarav@example.com',
        password: 'Password@123',
        role: 'customer',
      },
      {
        name: 'Priya M.',
        email: 'priya@example.com',
        password: 'Password@123',
        role: 'customer',
      },
    ]);

    const admin = users[0];
    const customer1 = users[1];
    const customer2 = users[2];

    const departments = await Department.create([
      { name: 'Billing Team', description: 'Payments, invoices and refunds' },
      { name: 'Support Desk', description: 'Accounts and general help' },
      { name: 'Engineering', description: 'Bugs and technical faults' },
    ]);

    const billing = departments[0];
    const support = departments[1];
    const engineering = departments[2];

    const tickets = await Ticket.create([
      {
        title: 'Payment failed at checkout',
        category: 'Billing',
        priority: 'High',
        description: 'My card is charged but the order shows as unpaid. I have attached a screenshot of the error.',
        status: 'In Progress',
        customer: customer1._id,
        assignedDepartment: billing._id,
      },
      {
        title: 'Update my shipping address',
        category: 'Account',
        priority: 'Low',
        description: 'I moved flats last week and need my default shipping address changed.',
        status: 'Open',
        customer: customer1._id,
        assignedDepartment: support._id,
      },
      {
        title: 'Invoice shows wrong tax',
        category: 'Billing',
        priority: 'Low',
        description: 'The GST calculated on my last invoice seems incorrect.',
        status: 'Resolved',
        customer: customer2._id,
        assignedDepartment: billing._id,
        resolvedAt: new Date(),
      },
      {
        title: 'App crashes on upload',
        category: 'Technical',
        priority: 'High',
        description: 'Whenever I try to upload a PDF, the app closes automatically.',
        status: 'In Progress',
        customer: customer2._id,
        assignedDepartment: engineering._id,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
      {
        title: 'Can\'t reset my password',
        category: 'Account',
        priority: 'Medium',
        description: 'The reset link is not arriving in my email inbox.',
        status: 'Open',
        customer: customer1._id,
        assignedDepartment: support._id,
      },
      {
        title: 'Subscription not activating',
        category: 'Billing',
        priority: 'High',
        description: 'Paid for the pro plan but still on free tier.',
        status: 'Open',
        customer: customer2._id,
        assignedDepartment: billing._id,
      },
      {
        title: 'How to export data?',
        category: 'Other',
        priority: 'Low',
        description: 'Is there a way to export my history to CSV?',
        status: 'Closed',
        customer: customer1._id,
        assignedDepartment: support._id,
        resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        title: 'Screen goes blank on login',
        category: 'Technical',
        priority: 'High',
        description: 'Just getting a white screen after entering my credentials.',
        status: 'Open',
        customer: customer1._id,
        assignedDepartment: engineering._id,
      },
      {
        title: 'Double charged for order',
        category: 'Billing',
        priority: 'High',
        description: 'I see two deductions on my credit card statement.',
        status: 'In Progress',
        customer: customer2._id,
        assignedDepartment: billing._id,
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), 
      },
      {
        title: 'Typo in my profile name',
        category: 'Account',
        priority: 'Low',
        description: 'I accidentally misspelled my last name.',
        status: 'Resolved',
        customer: customer1._id,
        assignedDepartment: support._id,
        resolvedAt: new Date(),
      },
      {
        title: 'API rate limit exceeded too early',
        category: 'Technical',
        priority: 'Medium',
        description: 'Getting a 429 error after only 10 requests.',
        status: 'Open',
        customer: customer2._id,
        assignedDepartment: engineering._id,
      },
      {
        title: 'Refund request',
        category: 'Billing',
        priority: 'Medium',
        description: 'I would like to cancel and get a refund within the 30-day window.',
        status: 'Open',
        customer: customer1._id,
        assignedDepartment: billing._id,
      },
    ], { ordered: true });

    await Comment.create([
      {
        ticket: tickets[0]._id,
        author: customer1._id,
        text: 'Any update on this? The charge is still pending.',
      },
      {
        ticket: tickets[0]._id,
        author: admin._id,
        text: 'Thanks for the screenshot. I have passed this to Billing and will confirm today.',
      },
      {
        ticket: tickets[0]._id,
        author: customer1._id,
        text: 'Great, thank you!',
      }
    ]);

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};



seedData();

