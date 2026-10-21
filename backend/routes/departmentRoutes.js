const express = require('express');
const router = express.Router();
const {getDepartment, createDepartment, updateDepartment, deleteDepartment,} = require('../controllers/departmentController');
const { protect, allowRoles } = require('../middleware/authHandler');

router.use(protect);

router.
route('/')
.get(getDepartment)
.post(allowRoles('admin'), createDepartment);

router.
route('/:id')
.put(allowRoles('admin'), updateDepartment)
.delete(allowRoles('admin'), deleteDepartment);

module.exports = router;