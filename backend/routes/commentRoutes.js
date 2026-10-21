const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTicketComments, addTicketComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authHandler');

router.use(protect);

const handler = (fn) => (req, res, next) => {
  if (!req.params.ticketId && req.params.id) {
    req.params.ticketId = req.params.id;
  }
  return fn(req, res, next);
};

router
  .route('/')
  .get(handler(getTicketComments))
  .post(handler(addTicketComment));

router
  .route('/:ticketId')
  .get(getTicketComments)
  .post(addTicketComment);

module.exports = router;