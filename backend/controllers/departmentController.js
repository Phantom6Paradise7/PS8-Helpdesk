const Department = require('../models/Department');
const Ticket = require('../models/Ticket');

const getDepartment = async (req, res, next) => {
  try {
    const departments = await Department.find({}).sort({ createdAt: -1 }).lean();
    const counts = await Ticket.aggregate([
      { $match: { status: { $in: ['Open', 'In Progress'] }, assignedDepartment: { $ne: null } } },
      { $group: { _id: '$assignedDepartment', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => { countMap[c._id.toString()] = c.count; });
    res.status(200).json(
      departments.map((d) => ({ ...d, openTickets: countMap[d._id.toString()] || 0 }))
    );
  } catch (error) {
    next(error);
  }
};

const createDepartment = async(req, res, next) => {
  try {
    const { name, description } = req.body;
    const departmentExists = await Department.findOne({name});
    if (departmentExists) {
      res.status(409);
      throw new Error('Department with this name already exists');
    }

    const department = await Department.create ({
      name, 
      description,
    });

    res.status(201).json(department);
  } catch (error) {
    next (error);
  }
};

const updateDepartment = async(req, res, next) => {
  try {
    const { name, description, isActive} = req.body;
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404);
      throw new Error('Department not found');
    }

    department.name = name || department.name;
    department.description = description || department.description;
    if (isActive !== undefined) {
      department.isActive = isActive;
    }

    const updatedDepartment = await department.save();
    res.status(200).json(updatedDepartment);
  } catch (error) {
    next (error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404);
      throw new Error('Department not found');
    }
    await Ticket.updateMany({ assignedDepartment: department._id }, { assignedDepartment: null });
    await department.deleteOne();

    res.status(200).json({message: 'Department removed succesfully'});
  } catch (error) {
    next (error);
  }
};

module.exports = {getDepartment, createDepartment, updateDepartment, deleteDepartment};