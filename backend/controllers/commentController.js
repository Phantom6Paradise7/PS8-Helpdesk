const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');

const getTicketComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    const customerId = (ticket.customer?._id || ticket.customer).toString();
    const userRole = (req.user.role || '').toLowerCase();
    if (customerId !== req.user._id.toString() && userRole !== 'admin' && userRole !== 'support') {
      res.status(403);
      throw new Error('Not authorized to view this ticket');
    }

    const comments = await Comment.find({ticket: req.params.ticketId})
    .populate('author', 'name role')
    .sort({createdAt: 1});
    res.status(200).json(comments);
  } catch (error) {
    next (error);
  }
};

const addTicketComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    const customerId = (ticket.customer?._id || ticket.customer).toString();
    const userRole = (req.user.role || '').toLowerCase();
    if (customerId !== req.user._id.toString() && userRole !== 'admin' && userRole !== 'support') {
      res.status(403);
      throw new Error('Not authorized to view this ticket');
    }

    if (ticket.status === 'Closed') {
      res.status(400);
      throw new Error('This ticket is closed and read-only. No further replies are allowed');
    }

    const comment = await Comment.create({
      ticket: req.params.ticketId,
      author : req.user._id,
      text,
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name role');

    res.status(201).json(populatedComment);
  } catch (error) {
    next (error);
  }
};

module.exports = {getTicketComments, addTicketComment};