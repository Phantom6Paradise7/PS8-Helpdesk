const Ticket = require('../models/Ticket');
const Department = require('../models/Department');

const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({customer: req.user._id})
    .populate('assignedDepartment', 'name')
    .sort({createdAt: -1});
    res.status(200).json(tickets);
  } catch (error) {
    next (error);
  }
};

const getAllTickets = async (req, res, next) => {
  try {
    const { status, priority, category } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.status = status;
    if (priority && priority !== 'All') filter.priority = priority;
    if (category && category !== 'All') filter.category = category;

    const ticket = await Ticket.find(filter)
    .populate('customer', 'name email')
    .populate('assignedDepartment', 'name')
    .sort({ createdAt: -1});

    res.status(200).json(ticket);
  } catch (error) {
    next (error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    .populate('customer', 'name email')
    .populate('assignedDepartment', 'name');

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }
    const userRole = (req.user.role || '').toLowerCase();
    const customerId = (ticket.customer?._id || ticket.customer).toString();
    if (customerId !== req.user._id.toString() && userRole !== 'admin' && userRole !== 'support') {
      res.status(403);
      throw new Error('Not authorized to view this ticket');
    }
    res.status(200).json(ticket);
  } catch (error) {
    next (error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { title, category, priority, description, screenshotUrl} = req.body;
    const ticket = await Ticket.create({
      title, 
      category: category || 'Billing',
      priority: priority || 'Low',
      description,
      screenshotUrl: screenshotUrl || '',
      customer: req.user.id,
      status: 'Open',
    });

    res.status(201).json(ticket);
  } catch (error) {
    next (error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const { title, category, priority, description, screenshotUrl} = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    const customerId = (ticket.customer?._id || ticket.customer).toString();
    if (customerId !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to edit this ticket');
    }

    if (ticket.status !== 'Open') {
      res.status(400);
      throw new Error('You can only edit this ticket when it is open');
    }

    ticket.title = title || ticket.title;
    ticket.category = category || ticket.category;
    ticket.priority = priority || ticket.priority;
    ticket.description = description || ticket.description;
    if (screenshotUrl !== undefined) ticket.screenshotUrl = screenshotUrl;
    const updatedTicket = await ticket.save();
    res.status(200).json(updatedTicket);
  } catch (error) {
    next (error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error ('Ticket not found');
    }
    const customerId = (ticket.customer?._id || ticket.customer).toString();
    if (customerId !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this ticket');
    }
    if (ticket.status !== 'Open') {
      res.status(400);
      throw new Error('You can only delete a ticket while it is Open');
    }

    await ticket.deleteOne();
    res.status(200).json({message: 'Ticket deleted successfully'})
  } catch (error) {
    next (error);
  }
};

const populateTicket = (id) =>
  Ticket.findById(id).populate('customer', 'name email').populate('assignedDepartment', 'name');

const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }
    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status: ${status}`);
    }
    ticket.status = status;
    if (status === 'Resolved') ticket.resolvedAt = Date.now();
    await ticket.save();
    res.status(200).json(await populateTicket(ticket._id));
  } catch (error) {
    next(error);
  }
};

const assignDepartment = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }
    if (ticket.status === 'Closed') {
      res.status(400);
      throw new Error('Closed tickets are read-only');
    }
    const dept = await Department.findById(req.body.department);
    if (!dept) {
      res.status(404);
      throw new Error('Department not found');
    }
    ticket.assignedDepartment = dept._id;
    await ticket.save();
    res.status(200).json(await populateTicket(ticket._id));
  } catch (error) {
    next(error);
  }
};

const reopenTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket){
      res.status(404);
      throw new Error ('Ticket not found');
    }
    const customerId = (ticket.customer?._id || ticket.customer).toString();
    if (customerId !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to reopen this ticket');
    }

    if (ticket.status !== 'Resolved') {
      res.status(400);
      throw new Error('Only resolved tickets can be reopened');
    } 

    if (ticket.reopenCount >= 1) {
      res.status(400);
      throw new Error('This ticket has already been reopened once and cannot be reopened again');
    }

    ticket.status = 'Open';
    ticket.reopenCount += 1;
    ticket.resolvedAt = null;

    const updatedTicket = await ticket.save();
    res.status(200).json(updatedTicket);
  } catch (error) {
    next (error);
  }
};

module.exports = {getMyTickets, getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket, updateTicketStatus, assignDepartment, reopenTicket};