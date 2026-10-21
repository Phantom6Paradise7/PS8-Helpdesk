const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/dashboardController');
const { protect, allowRoles } = require('../middleware/authHandler');

router.get('/metrics', protect, allowRoles('admin'), getDashboardMetrics);

module.exports = router;