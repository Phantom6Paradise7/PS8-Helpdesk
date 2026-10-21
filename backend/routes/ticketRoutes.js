const express = require('express');
const router = express.Router();
const {
  getMyTickets,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
  assignDepartment,
  reopenTicket
} = require('../controllers/ticketController');
const { protect, allowRoles } = require('../middleware/authHandler');

router.use(protect);

router.get('/all', allowRoles('admin', 'support'), getAllTickets);
router.get('/my-tickets', allowRoles('customer', 'admin', 'support'), getMyTickets);

router
  .route('/')
  .get((req, res, next) => {
    const role = (req.user?.role || '').toLowerCase();
    if (role === 'admin' || role === 'support') {
      return getAllTickets(req, res, next);
    }
    return getMyTickets(req, res, next);
  })
  .post(allowRoles('customer', 'admin', 'support'), createTicket);

router
  .route('/:id')
  .get(getTicketById)
  .put(allowRoles('customer', 'admin', 'support'), updateTicket)
  .delete(allowRoles('customer', 'admin', 'support'), deleteTicket);

router.put('/:id/status', allowRoles('admin', 'support'), updateTicketStatus);
router.patch('/:id/status', allowRoles('admin', 'support'), updateTicketStatus);
router.patch('/:id/assign', allowRoles('admin', 'support'), assignDepartment);
router.put('/:id/assign', allowRoles('admin', 'support'), assignDepartment);
router.patch('/:id/reopen', allowRoles('customer', 'admin', 'support'), reopenTicket);
router.put('/:id/reopen', allowRoles('customer', 'admin', 'support'), reopenTicket);

module.exports = router;
